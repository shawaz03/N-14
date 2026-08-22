# -*- coding: utf-8 -*-
"""
N-14 Master Golden Dataset Builder & Serializer (Task 1.3)
Generates, formats, validates, deduplicates, deterministically shuffles,
and serializes the 15,000-record N-14 Golden Dataset to data/n14_golden_15k.jsonl.gz.

Output artifacts:
- data/n14_golden_15k.jsonl.gz: Master Gzip-compressed JSONL dataset (15,000 ChatML records)
- data/dataset_audit_report.json: Comprehensive statistical and pillar quota breakdown
"""

import gzip
import hashlib
import json
import os
import random
import sys
import time
from datetime import datetime, timezone
from typing import List, Dict, Any

# Ensure project root is in python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)

from src.pillars.pillar1_ui_ux import generate_pillar1_records
from src.pillars.pillar2_backend import generate_pillar2_records
from src.pillars.pillar3_conversational import generate_pillar3_records
from src.pillars.pillar4_debugging import generate_pillar4_records
from src.pillars.pillar5_sql import generate_pillar5_records

DATA_DIR = os.path.join(ROOT_DIR, "data")
OUTPUT_GZ_PATH = os.path.join(DATA_DIR, "n14_golden_15k.jsonl.gz")
OUTPUT_REPORT_PATH = os.path.join(DATA_DIR, "dataset_audit_report.json")

EXPECTED_QUOTAS = {
    "production_ui_ux": 5250,
    "fullstack_backend": 3750,
    "conversational_ai": 3000,
    "self_healing_debug": 1800,
    "sql_data_engineering": 1200,
}

def get_hash(text: str) -> str:
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()

def build_golden_dataset():
    print("=" * 80)
    print("  N-14 MASTER GOLDEN DATASET BUILDER (TASK 1.3)")
    print("=" * 80)
    start_time = time.time()
    os.makedirs(DATA_DIR, exist_ok=True)

    # 1. Generate records from all 5 pillars
    print("\n[Step 1/5] Executing 5 Pillar Generators...")
    p1 = generate_pillar1_records()
    p2 = generate_pillar2_records()
    p3 = generate_pillar3_records()
    p4 = generate_pillar4_records()
    p5 = generate_pillar5_records()

    raw_records = p1 + p2 + p3 + p4 + p5
    total_raw = len(raw_records)
    print(f"\nTotal raw records collected: {total_raw}")

    # 2. Format verification (ChatML structure)
    print("\n[Step 2/5] Validating ChatML message formatting...")
    for idx, rec in enumerate(raw_records):
        if "messages" not in rec or len(rec["messages"]) != 3:
            raise ValueError(f"Record {idx} invalid ChatML structure: {rec}")
        roles = [m.get("role") for m in rec["messages"]]
        if roles != ["system", "user", "assistant"]:
            raise ValueError(f"Record {idx} invalid roles sequence: {roles}")
        for m in rec["messages"]:
            if not m.get("content") or not m.get("content").strip():
                raise ValueError(f"Record {idx} has empty content in role {m.get('role')}")

    # 3. Global Deduplication by user prompt SHA-256
    print("\n[Step 3/5] Performing Global SHA-256 Deduplication...")
    seen_hashes = {}
    deduped_records = []
    duplicate_count = 0

    for idx, rec in enumerate(raw_records):
        user_prompt = rec["messages"][1]["content"]
        h = get_hash(user_prompt)
        if h in seen_hashes:
            duplicate_count += 1
            print(f"  WARNING: Duplicate prompt found at record {idx} matching {seen_hashes[h]}")
        else:
            seen_hashes[h] = idx
            deduped_records.append(rec)

    print(f"Deduplication finished. Unique records: {len(deduped_records)} (Duplicates dropped: {duplicate_count})")
    if len(deduped_records) != 15000:
        raise ValueError(f"Expected 15,000 unique records, but got {len(deduped_records)}")

    # 4. Deterministic Shuffling
    print("\n[Step 4/5] Applying deterministic shuffle (seed=42)...")
    random.seed(42)
    random.shuffle(deduped_records)

    # 5. Serialization to gzip compressed JSONL
    print(f"\n[Step 5/5] Serializing to {OUTPUT_GZ_PATH}...")
    with gzip.open(OUTPUT_GZ_PATH, "wt", encoding="utf-8") as gz_file:
        for rec in deduped_records:
            gz_file.write(json.dumps(rec, ensure_ascii=False) + "\n")

    file_size_bytes = os.path.getsize(OUTPUT_GZ_PATH)
    file_size_mb = file_size_bytes / (1024 * 1024)

    # Compute sha256 checksum of generated gz file
    sha256_hash = hashlib.sha256()
    with open(OUTPUT_GZ_PATH, "rb") as f:
        for byte_block in iter(lambda: f.read(65536), b""):
            sha256_hash.update(byte_block)
    gz_sha256 = sha256_hash.hexdigest()

    # Calculate statistics
    pillar_breakdown = {}
    total_user_chars = 0
    total_assistant_chars = 0

    for rec in deduped_records:
        pillar = rec.get("pillar", "unknown")
        pillar_breakdown[pillar] = pillar_breakdown.get(pillar, 0) + 1
        total_user_chars += len(rec["messages"][1]["content"])
        total_assistant_chars += len(rec["messages"][2]["content"])

    audit_report = {
        "dataset_name": "N-14 Golden 15K Dataset",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_records": len(deduped_records),
        "target_records": 15000,
        "format": "ChatML (system/user/assistant)",
        "file_path": os.path.relpath(OUTPUT_GZ_PATH, ROOT_DIR).replace("\\", "/"),
        "file_size_bytes": file_size_bytes,
        "file_size_mb": round(file_size_mb, 2),
        "file_sha256": gz_sha256,
        "shuffle_seed": 42,
        "pillar_distribution": {
            "production_ui_ux": {
                "count": pillar_breakdown.get("production_ui_ux", 0),
                "target": EXPECTED_QUOTAS["production_ui_ux"],
                "percentage": round(pillar_breakdown.get("production_ui_ux", 0) / 150.0, 2),
                "target_percentage": 35.0,
                "status": "PASS" if pillar_breakdown.get("production_ui_ux", 0) == EXPECTED_QUOTAS["production_ui_ux"] else "FAIL"
            },
            "fullstack_backend": {
                "count": pillar_breakdown.get("fullstack_backend", 0),
                "target": EXPECTED_QUOTAS["fullstack_backend"],
                "percentage": round(pillar_breakdown.get("fullstack_backend", 0) / 150.0, 2),
                "target_percentage": 25.0,
                "status": "PASS" if pillar_breakdown.get("fullstack_backend", 0) == EXPECTED_QUOTAS["fullstack_backend"] else "FAIL"
            },
            "conversational_ai": {
                "count": pillar_breakdown.get("conversational_ai", 0),
                "target": EXPECTED_QUOTAS["conversational_ai"],
                "percentage": round(pillar_breakdown.get("conversational_ai", 0) / 150.0, 2),
                "target_percentage": 20.0,
                "status": "PASS" if pillar_breakdown.get("conversational_ai", 0) == EXPECTED_QUOTAS["conversational_ai"] else "FAIL"
            },
            "self_healing_debug": {
                "count": pillar_breakdown.get("self_healing_debug", 0),
                "target": EXPECTED_QUOTAS["self_healing_debug"],
                "percentage": round(pillar_breakdown.get("self_healing_debug", 0) / 150.0, 2),
                "target_percentage": 12.0,
                "status": "PASS" if pillar_breakdown.get("self_healing_debug", 0) == EXPECTED_QUOTAS["self_healing_debug"] else "FAIL"
            },
            "sql_data_engineering": {
                "count": pillar_breakdown.get("sql_data_engineering", 0),
                "target": EXPECTED_QUOTAS["sql_data_engineering"],
                "percentage": round(pillar_breakdown.get("sql_data_engineering", 0) / 150.0, 2),
                "target_percentage": 8.0,
                "status": "PASS" if pillar_breakdown.get("sql_data_engineering", 0) == EXPECTED_QUOTAS["sql_data_engineering"] else "FAIL"
            }
        },
        "character_statistics": {
            "avg_user_prompt_chars": round(total_user_chars / len(deduped_records), 1),
            "avg_assistant_response_chars": round(total_assistant_chars / len(deduped_records), 1),
            "total_character_count": total_user_chars + total_assistant_chars
        },
        "build_duration_seconds": round(time.time() - start_time, 2),
        "status": "SUCCESS"
    }

    with open(OUTPUT_REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(audit_report, f, indent=2)

    print(f"\nAudit report saved to: {OUTPUT_REPORT_PATH}")
    print(f"Compressed Dataset File: {OUTPUT_GZ_PATH} ({file_size_mb:.2f} MB)")
    print(f"SHA-256 Checksum: {gz_sha256}")
    print("=" * 80)
    print("  TASK 1.3 BUILD COMPLETED SUCCESSFULLY")
    print("=" * 80)
    return audit_report

if __name__ == "__main__":
    build_golden_dataset()
