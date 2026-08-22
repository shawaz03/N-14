# -*- coding: utf-8 -*-
"""
N-14 Multi-GPU Distributed SFT Training Engine (Task 2.2)
Uses transformers.Trainer directly for maximum stability across all library versions.
Target: Qwen/Qwen2.5-Coder-7B-Instruct on 4x NVIDIA A10G (96 GB VRAM)
"""

import argparse
import gzip
import json
import logging
import os
import sys
from datetime import datetime, timezone
from typing import Dict, Any

import torch
import yaml
from datasets import Dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
)

logging.basicConfig(
    format="%(asctime)s - %(levelname)s - [%(name)s] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.INFO,
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("N14-Trainer")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(ROOT_DIR, "configs", "model_config.yaml")


def load_config() -> Dict[str, Any]:
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {}


def tokenize_chat(example, tokenizer, max_length=2048):
    """Tokenizes a single ChatML conversation into input_ids and labels."""
    text = tokenizer.apply_chat_template(example["messages"], tokenize=False)
    tokenized = tokenizer(
        text,
        truncation=True,
        max_length=max_length,
        padding=False,
        return_tensors=None,
    )
    tokenized["labels"] = tokenized["input_ids"].copy()
    return tokenized


def main():
    parser = argparse.ArgumentParser(description="N-14 Distributed SFT Training Engine")
    parser.add_argument("--dataset", type=str,
                        default=os.path.join(ROOT_DIR, "data", "n14_golden_15k.jsonl.gz"))
    parser.add_argument("--output_dir", type=str,
                        default=os.path.join(ROOT_DIR, "models", "checkpoints"))
    args = parser.parse_args()

    local_rank = int(os.environ.get("LOCAL_RANK", 0))
    if local_rank == 0:
        print("=" * 80)
        print("  N-14 DISTRIBUTED SFT TRAINING ENGINE (PHASE 2)")
        print("=" * 80)

    config = load_config()
    model_name = config.get("model", {}).get("base_model", "Qwen/Qwen2.5-Coder-7B-Instruct")
    train_cfg = config.get("training", {})
    quant_cfg = config.get("quantization", {})
    lora_cfg = config.get("lora", {})

    # ── 1. Tokenizer ─────────────────────────────────────────────────────
    logger.info(f"[Rank {local_rank}] Loading tokenizer: {model_name}")
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True, padding_side="right")
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # ── 2. Dataset ────────────────────────────────────────────────────────
    logger.info(f"[Rank {local_rank}] Loading dataset: {args.dataset}")
    raw_records = []
    with gzip.open(args.dataset, "rt", encoding="utf-8") as f:
        for line in f:
            raw_records.append(json.loads(line))
    logger.info(f"Loaded {len(raw_records)} records.")

    ds = Dataset.from_list([{"messages": r["messages"]} for r in raw_records])
    ds = ds.train_test_split(test_size=0.05, seed=42)
    train_ds = ds["train"]
    eval_ds = ds["test"]
    logger.info(f"Train: {len(train_ds)}, Eval: {len(eval_ds)}")

    max_seq = config.get("model", {}).get("max_seq_length", 2048)
    train_ds = train_ds.map(lambda x: tokenize_chat(x, tokenizer, max_seq), remove_columns=train_ds.column_names)
    eval_ds = eval_ds.map(lambda x: tokenize_chat(x, tokenizer, max_seq), remove_columns=eval_ds.column_names)

    # ── 3. Model (4-bit NF4 QLoRA) ───────────────────────────────────────
    logger.info(f"[Rank {local_rank}] Loading base model in 4-bit NF4...")
    if torch.cuda.is_available():
        torch.cuda.set_device(local_rank)

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=quant_cfg.get("load_in_4bit", True),
        bnb_4bit_quant_type=quant_cfg.get("bnb_4bit_quant_type", "nf4"),
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=quant_cfg.get("bnb_4bit_use_double_quant", True),
    )

    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        quantization_config=bnb_config,
        torch_dtype=torch.bfloat16,
        device_map={"": local_rank},
        attn_implementation="sdpa",
        trust_remote_code=True,
    )

    model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=True)

    # ── 4. LoRA Adapter (r=32, alpha=64) ──────────────────────────────────
    peft_config = LoraConfig(
        r=lora_cfg.get("r", 32),
        lora_alpha=lora_cfg.get("lora_alpha", 64),
        lora_dropout=lora_cfg.get("lora_dropout", 0.05),
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=lora_cfg.get("target_modules", [
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj",
        ]),
    )
    model = get_peft_model(model, peft_config)

    if local_rank == 0:
        trainable, total = model.get_nb_trainable_parameters()
        logger.info(f"Trainable params: {trainable:,} / {total:,} ({100 * trainable / total:.2f}%)")

    # ── 5. Training Arguments ─────────────────────────────────────────────
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=train_cfg.get("num_train_epochs", 3),
        per_device_train_batch_size=train_cfg.get("per_device_train_batch_size", 2),
        per_device_eval_batch_size=2,
        gradient_accumulation_steps=train_cfg.get("gradient_accumulation_steps", 4),
        learning_rate=float(train_cfg.get("learning_rate", 1.5e-4)),
        lr_scheduler_type=train_cfg.get("lr_scheduler_type", "cosine"),
        warmup_ratio=float(train_cfg.get("warmup_ratio", 0.05)),
        weight_decay=float(train_cfg.get("weight_decay", 0.01)),
        optim=train_cfg.get("optim", "paged_adamw_8bit"),
        bf16=True,
        gradient_checkpointing=True,
        max_grad_norm=float(train_cfg.get("max_grad_norm", 1.0)),
        logging_steps=int(train_cfg.get("logging_steps", 10)),
        eval_strategy="steps",
        eval_steps=int(train_cfg.get("eval_steps", 500)),
        save_strategy="steps",
        save_steps=int(train_cfg.get("save_steps", 500)),
        save_total_limit=int(train_cfg.get("save_total_limit", 6)),
        seed=42,
        report_to="none",
        ddp_find_unused_parameters=False,
    )

    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=eval_ds,
        data_collator=data_collator,
    )

    # ── 6. Train ──────────────────────────────────────────────────────────
    logger.info(f"[Rank {local_rank}] Starting training across 3 epochs...")
    trainer.train()

    # ── 7. Save Final Adapter ─────────────────────────────────────────────
    if local_rank == 0:
        final_dir = os.path.join(ROOT_DIR, "models", "checkpoint-final")
        os.makedirs(final_dir, exist_ok=True)
        logger.info(f"Saving final LoRA adapter to: {final_dir}")
        model.save_pretrained(final_dir)
        tokenizer.save_pretrained(final_dir)
        logger.info("Training completed successfully!")


if __name__ == "__main__":
    main()
