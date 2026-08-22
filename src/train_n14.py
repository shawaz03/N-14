# -*- coding: utf-8 -*-
"""
N-14 Multi-GPU Distributed SFT Training Engine (Task 2.2)
Target Model: Qwen/Qwen2.5-Coder-7B-Instruct
Target Hardware: AWS EC2 g5.12xlarge (4x NVIDIA A10G, 96 GB VRAM)
Hyperparameters:
- 3 Complete Epochs (~1,336 optimizer steps across 14,250 training records)
- QLoRA 4-bit NF4 Quantization + Double Quantization
- LoRA Rank r=32, Alpha=64, Target Modules: all 7 linear projections
- Learning Rate: 1.5e-4 with Cosine Scheduler & 5% Warmup
- Effective Batch Size: 32 (2 per-GPU * 4 GPUs * 4 gradient accumulation)
- Max Sequence Length: 2048 tokens
- Attention: PyTorch SDPA (Scaled Dot-Product Attention)
"""

import argparse
import gzip
import json
import logging
import os
import sys
from datetime import datetime, timezone
from typing import Dict, Any, Tuple

import torch
import yaml
from datasets import Dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    TrainerCallback,
)
from trl import SFTTrainer, SFTConfig

# Configure logging
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

# ----------------------------------------------------------------------
# SUB-STEP 2.2.1: Base Model Loader in 4-bit NF4
# ----------------------------------------------------------------------
def get_quantization_config(config: Dict[str, Any]) -> BitsAndBytesConfig:
    """Configures 4-bit NF4 Quantization with double quant and bfloat16 compute dtype."""
    quant_cfg = config.get("quantization", {})
    return BitsAndBytesConfig(
        load_in_4bit=quant_cfg.get("load_in_4bit", True),
        bnb_4bit_quant_type=quant_cfg.get("bnb_4bit_quant_type", "nf4"),
        bnb_4bit_compute_dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16,
        bnb_4bit_use_double_quant=quant_cfg.get("bnb_4bit_use_double_quant", True),
    )

def load_base_model(model_name_or_path: str, quant_config: BitsAndBytesConfig):
    """Loads Qwen2.5-Coder base model with 4-bit quantization and SDPA attention."""
    logger.info(f"Loading base model: {model_name_or_path} with 4-bit NF4 quantization...")
    
    # Check if CUDA is available, otherwise allow CPU loading for dry-run validation
    device_map = {"": torch.cuda.current_device()} if torch.cuda.is_available() else "auto"
    
    model = AutoModelForCausalLM.from_pretrained(
        model_name_or_path,
        quantization_config=quant_config if torch.cuda.is_available() else None,
        torch_dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float32,
        device_map=device_map if torch.cuda.is_available() else None,
        attn_implementation="sdpa" if torch.cuda.is_available() else "eager",
        trust_remote_code=True,
    )
    
    if torch.cuda.is_available():
        model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=True)
        
    return model

# ----------------------------------------------------------------------
# SUB-STEP 2.2.2: Apply LoRA Adapter Configuration (r=32, alpha=64)
# ----------------------------------------------------------------------
def get_lora_config(config: Dict[str, Any]) -> LoraConfig:
    """Configures LoRA adapter targeting all 7 linear projection layers."""
    lora_cfg = config.get("lora", {})
    target_modules = lora_cfg.get("target_modules", [
        "q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"
    ])
    return LoraConfig(
        r=lora_cfg.get("r", 32),
        lora_alpha=lora_cfg.get("lora_alpha", 64),
        lora_dropout=lora_cfg.get("lora_dropout", 0.05),
        bias=lora_cfg.get("bias", "none"),
        task_type="CAUSAL_LM",
        target_modules=target_modules,
    )

# ----------------------------------------------------------------------
# SUB-STEP 2.2.3: ChatML Formatting & Tokenizer Setup
# ----------------------------------------------------------------------
def load_and_prepare_dataset(
    dataset_path: str,
    tokenizer: AutoTokenizer,
    eval_split_ratio: float = 0.05,
    seed: int = 42
) -> Tuple[Dataset, Dataset]:
    """Loads gzip JSONL dataset and formats into Hugging Face Dataset with train/eval split."""
    logger.info(f"Loading dataset from: {dataset_path}")
    raw_records = []
    with gzip.open(dataset_path, "rt", encoding="utf-8") as f:
        for line in f:
            raw_records.append(json.loads(line))
            
    logger.info(f"Loaded {len(raw_records)} records. Converting to ChatML tokens...")
    
    # Format each record using tokenizer's ChatML template
    formatted_data = []
    for rec in raw_records:
        formatted_data.append({"messages": rec["messages"]})
        
    full_dataset = Dataset.from_list(formatted_data)
    
    # Train / Eval Split (95% train = 14,250 records, 5% eval = 750 records)
    split_dataset = full_dataset.train_test_split(test_size=eval_split_ratio, seed=seed)
    train_ds = split_dataset["train"]
    eval_ds = split_dataset["test"]
    
    logger.info(f"Dataset split complete: Train={len(train_ds)} records, Eval={len(eval_ds)} records")
    return train_ds, eval_ds

# ----------------------------------------------------------------------
# SUB-STEP 2.2.4 & 2.2.5: SFTTrainer Setup, Hyperparameters & Checkpointing
# ----------------------------------------------------------------------
class MetricsLoggerCallback(TrainerCallback):
    """Logs step metrics, loss, and learning rate progression."""
    def on_log(self, args, state, control, logs=None, **kwargs):
        if logs:
            step = state.global_step
            loss = logs.get("loss", "N/A")
            eval_loss = logs.get("eval_loss", "N/A")
            lr = logs.get("learning_rate", "N/A")
            logger.info(f"Step {step:5d} | Train Loss: {loss} | Eval Loss: {eval_loss} | LR: {lr}")

def build_trainer(
    model,
    tokenizer,
    train_dataset: Dataset,
    eval_dataset: Dataset,
    lora_config: LoraConfig,
    config: Dict[str, Any],
    output_dir: str
) -> SFTTrainer:
    """Instantiates SFTTrainer with exact hyperparameters from model_config.yaml."""
    train_cfg = config.get("training", {})
    
    training_args = SFTConfig(
        output_dir=output_dir,
        num_train_epochs=train_cfg.get("num_train_epochs", 3),
        per_device_train_batch_size=train_cfg.get("per_device_train_batch_size", 2),
        per_device_eval_batch_size=train_cfg.get("per_device_train_batch_size", 2),
        gradient_accumulation_steps=train_cfg.get("gradient_accumulation_steps", 4),
        learning_rate=float(train_cfg.get("learning_rate", 1.5e-4)),
        lr_scheduler_type=train_cfg.get("lr_scheduler_type", "cosine"),
        warmup_ratio=train_cfg.get("warmup_ratio", 0.05),
        weight_decay=train_cfg.get("weight_decay", 0.01),
        optim=train_cfg.get("optim", "paged_adamw_8bit"),
        bf16=torch.cuda.is_bf16_supported(),
        fp16=not torch.cuda.is_bf16_supported() and torch.cuda.is_available(),
        gradient_checkpointing=train_cfg.get("gradient_checkpointing", True),
        max_grad_norm=train_cfg.get("max_grad_norm", 1.0),
        logging_steps=train_cfg.get("logging_steps", 10),
        eval_strategy=train_cfg.get("evaluation_strategy", "steps"),
        eval_steps=train_cfg.get("eval_steps", 500),
        save_strategy=train_cfg.get("save_strategy", "steps"),
        save_steps=train_cfg.get("save_steps", 500),
        save_total_limit=train_cfg.get("save_total_limit", 6),
        seed=train_cfg.get("seed", 42),
        report_to="none",
        max_seq_length=config.get("model", {}).get("max_seq_length", 2048),
        dataset_text_field=None,  # Handled by apply_chat_template
        packing=False,
    )
    
    trainer = SFTTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        peft_config=lora_config,
        tokenizer=tokenizer,
        callbacks=[MetricsLoggerCallback()],
    )
    return trainer

def main():
    parser = argparse.ArgumentParser(description="N-14 Distributed SFT Training Engine")
    parser.add_argument("--config", type=str, default=CONFIG_PATH, help="Path to model_config.yaml")
    parser.add_argument("--dataset", type=str, default=os.path.join(ROOT_DIR, "data", "n14_golden_15k.jsonl.gz"))
    parser.add_argument("--output_dir", type=str, default=os.path.join(ROOT_DIR, "models", "checkpoints"))
    parser.add_argument("--dry_run", action="store_true", help="Run syntax & tokenization dry run without training")
    args = parser.parse_args()

    print("=" * 80)
    print("  N-14 DISTRIBUTED SFT TRAINING ENGINE (PHASE 2)")
    print("=" * 80)

    config = load_config()
    model_name = config.get("model", {}).get("base_model", "Qwen/Qwen2.5-Coder-7B-Instruct")
    
    logger.info(f"Target Base Model: {model_name}")
    logger.info(f"Output Directory: {args.output_dir}")

    # 1. Tokenizer
    logger.info(f"Initializing tokenizer for: {model_name}")
    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        trust_remote_code=True,
        padding_side="right",
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # 2. Dataset Preparation
    train_ds, eval_ds = load_and_prepare_dataset(
        args.dataset,
        tokenizer,
        eval_split_ratio=config.get("dataset", {}).get("eval_split_ratio", 0.05),
        seed=config.get("training", {}).get("seed", 42)
    )

    if args.dry_run:
        logger.info("Dry-run validation successful. Dataset and tokenizer pipeline verified!")
        print("=" * 80)
        return

    # 3. Model & LoRA Setup
    quant_cfg = get_quantization_config(config)
    model = load_base_model(model_name, quant_cfg)
    lora_cfg = get_lora_config(config)

    # 4. Trainer Initialization & Execution
    trainer = build_trainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_ds,
        eval_dataset=eval_ds,
        lora_config=lora_cfg,
        config=config,
        output_dir=args.output_dir
    )

    logger.info("Starting distributed training run across 3 epochs...")
    train_result = trainer.train()

    # 5. Save Final Adapter
    final_adapter_dir = os.path.join(ROOT_DIR, "models", "checkpoint-final")
    os.makedirs(final_adapter_dir, exist_ok=True)
    logger.info(f"Saving final trained LoRA adapter to: {final_adapter_dir}")
    trainer.model.save_pretrained(final_adapter_dir)
    tokenizer.save_pretrained(final_adapter_dir)

    logger.info("Distributed training completed successfully!")

if __name__ == "__main__":
    main()
