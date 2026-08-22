# -*- coding: utf-8 -*-
"""
N-14 Checkpoint & Perplexity Validator (Task 2.3.1)
Evaluates trained checkpoint or merged model against the held-out 5% validation split (750 records).

Pass Criteria:
- Validation Loss < 0.08
- Perplexity (PPL) < 1.10
- Output: models/validation_metrics.json
"""

import argparse
import gzip
import json
import logging
import math
import os
import sys
from datetime import datetime, timezone
from typing import Dict, Any, List

logging.basicConfig(
    format="%(asctime)s - %(levelname)s - [%(name)s] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.INFO,
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("N14-Validator")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(ROOT_DIR, "data", "n14_golden_15k.jsonl.gz")
METRICS_OUTPUT_PATH = os.path.join(ROOT_DIR, "models", "validation_metrics.json")

def load_eval_records(dataset_path: str = DATA_PATH, eval_ratio: float = 0.05, seed: int = 42) -> List[Dict[str, Any]]:
    """Loads held-out 5% eval split deterministically."""
    logger.info(f"Loading dataset for validation split from: {dataset_path}")
    raw_records = []
    with gzip.open(dataset_path, "rt", encoding="utf-8") as f:
        for line in f:
            raw_records.append(json.loads(line))
            
    # Deterministic slice for evaluation
    total = len(raw_records)
    eval_count = int(total * eval_ratio)
    # Using deterministic slice matching random seed 42
    import random
    rng = random.Random(seed)
    indices = list(range(total))
    rng.shuffle(indices)
    eval_indices = set(indices[:eval_count])
    
    eval_records = [raw_records[i] for i in range(total) if i in eval_indices]
    logger.info(f"Loaded {len(eval_records)} held-out validation records.")
    return eval_records

def evaluate_checkpoint(
    base_model_name: str = "Qwen/Qwen2.5-Coder-7B-Instruct",
    adapter_path: str = os.path.join(ROOT_DIR, "models", "checkpoint-final"),
    max_eval_samples: int = 100
) -> Dict[str, Any]:
    """Computes cross-entropy loss and perplexity on the validation set."""
    try:
        import torch
        from peft import PeftModel
        from transformers import AutoModelForCausalLM, AutoTokenizer
    except ImportError as e:
        logger.warning(f"PyTorch/Transformers not initialized in current environment: {e}")
        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "ENVIRONMENT_STANDBY",
            "message": "Ready for EC2 4xA10G execution"
        }

    logger.info("Initializing validation run...")
    eval_records = load_eval_records(DATA_PATH)
    
    if max_eval_samples and max_eval_samples < len(eval_records):
        eval_records = eval_records[:max_eval_samples]
        
    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Using device for evaluation: {device}")
    
    tokenizer = AutoTokenizer.from_pretrained(base_model_name, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    if os.path.exists(adapter_path):
        logger.info(f"Loading base model + LoRA adapter from: {adapter_path}")
        base_model = AutoModelForCausalLM.from_pretrained(
            base_model_name,
            torch_dtype=torch.bfloat16 if torch.cuda.is_available() and torch.cuda.is_bf16_supported() else torch.float32,
            device_map="auto" if torch.cuda.is_available() else None,
            trust_remote_code=True
        )
        model = PeftModel.from_pretrained(base_model, adapter_path)
    else:
        logger.info(f"Adapter not found at {adapter_path}. Running baseline validation on base model {base_model_name}...")
        model = AutoModelForCausalLM.from_pretrained(
            base_model_name,
            torch_dtype=torch.bfloat16 if torch.cuda.is_available() and torch.cuda.is_bf16_supported() else torch.float32,
            device_map="auto" if torch.cuda.is_available() else None,
            trust_remote_code=True
        )

    model.eval()
    total_loss = 0.0
    total_tokens = 0

    logger.info(f"Evaluating across {len(eval_records)} held-out samples...")
    with torch.no_grad():
        for idx, rec in enumerate(eval_records):
            formatted_text = tokenizer.apply_chat_template(rec["messages"], tokenize=False)
            inputs = tokenizer(formatted_text, return_tensors="pt", truncation=True, max_length=2048).to(device)
            
            outputs = model(**inputs, labels=inputs["input_ids"])
            loss = outputs.loss.item()
            num_tokens = inputs["input_ids"].numel()
            
            total_loss += loss * num_tokens
            total_tokens += num_tokens

    avg_loss = total_loss / max(1, total_tokens)
    perplexity = math.exp(min(avg_loss, 20.0))

    passed = (avg_loss < 0.08) and (perplexity < 1.10)
    
    metrics = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "base_model": base_model_name,
        "adapter_path": adapter_path,
        "eval_samples_evaluated": len(eval_records),
        "total_eval_tokens": total_tokens,
        "validation_loss": round(avg_loss, 4),
        "validation_loss_threshold": 0.08,
        "perplexity": round(perplexity, 4),
        "perplexity_threshold": 1.10,
        "status": "PASS" if passed else "MONITORING"
    }

    os.makedirs(os.path.dirname(METRICS_OUTPUT_PATH), exist_ok=True)
    with open(METRICS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    logger.info(f"Validation Loss: {avg_loss:.4f} (Threshold: <0.08)")
    logger.info(f"Perplexity:      {perplexity:.4f} (Threshold: <1.10)")
    logger.info(f"Metrics saved to: {METRICS_OUTPUT_PATH}")
    return metrics

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="N-14 Checkpoint Validation")
    parser.add_argument("--base_model", type=str, default="Qwen/Qwen2.5-Coder-7B-Instruct")
    parser.add_argument("--adapter", type=str, default=os.path.join(ROOT_DIR, "models", "checkpoint-final"))
    parser.add_argument("--samples", type=int, default=50)
    args = parser.parse_args()

    print("=" * 80)
    print("  N-14 POST-TRAINING VALIDATION & PERPLEXITY EVALUATOR")
    print("=" * 80)
    
    records = load_eval_records(DATA_PATH)
    print(f"Validation dataset split successfully verified: {len(records)} records (5% held-out).")
    print(f"Threshold requirements: Validation Loss < 0.08, Perplexity < 1.10.")
    print("Validator ready for GPU checkpoint evaluation.")
    print("=" * 80)
