# -*- coding: utf-8 -*-
"""
N-14 Phase 3.1: LoRA Weight Merging Engine
Merges trained LoRA adapter (checkpoint-final) with base model (Qwen2.5-Coder-7B-Instruct)
into full standalone 16-bit safetensors shards (~14.5 GB total).
"""

import os
import sys
import torch
import logging
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

logging.basicConfig(
    format="%(asctime)s - %(levelname)s - [%(name)s] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.INFO,
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("N14-Merge")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_MODEL_NAME = "Qwen/Qwen2.5-Coder-7B-Instruct"
ADAPTER_DIR = os.path.join(ROOT_DIR, "models", "checkpoint-final")
OUTPUT_DIR = os.path.join(ROOT_DIR, "models", "n14-merged")


def merge_weights():
    print("=" * 80)
    print("  N-14: LORA ADAPTER WEIGHT MERGER (PHASE 3.1)")
    print("=" * 80)

    if not os.path.exists(ADAPTER_DIR):
        logger.error(f"Adapter directory not found at: {ADAPTER_DIR}")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 1. Load Tokenizer
    logger.info(f"Loading tokenizer: {BASE_MODEL_NAME}...")
    tokenizer = AutoTokenizer.from_pretrained(
        BASE_MODEL_NAME,
        trust_remote_code=True,
        padding_side="right"
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # 2. Load Base Model in full 16-bit precision (bfloat16)
    logger.info(f"Loading base model in bfloat16: {BASE_MODEL_NAME}...")
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_NAME,
        torch_dtype=torch.bfloat16,
        device_map="cpu",  # Merge on CPU/RAM to ensure clean serialization
        trust_remote_code=True,
        low_cpu_mem_usage=True,
    )

    # 3. Load Trained LoRA Adapter
    logger.info(f"Loading trained LoRA adapter from: {ADAPTER_DIR}...")
    model = PeftModel.from_pretrained(base_model, ADAPTER_DIR)

    # 4. Permanently Merge Weights
    logger.info("Merging LoRA weights into base model...")
    model = model.merge_and_unload()
    logger.info("LoRA merge complete!")

    # 5. Save Merged Model and Tokenizer
    logger.info(f"Saving merged standalone model to: {OUTPUT_DIR}...")
    model.save_pretrained(
        OUTPUT_DIR,
        safe_serialization=True,
        max_shard_size="4GB"
    )
    tokenizer.save_pretrained(OUTPUT_DIR)

    logger.info("=" * 80)
    logger.info(f"SUCCESS: Full standalone N-14 model saved to {OUTPUT_DIR}")
    logger.info("=" * 80)


if __name__ == "__main__":
    merge_weights()
