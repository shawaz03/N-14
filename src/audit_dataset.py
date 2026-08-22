# -*- coding: utf-8 -*-
"""
N-14 Automated 5-Point Quality Audit Gate (Task 1.4)
Script: src/audit_dataset.py

Performs strict automated validation on the serialized dataset: data/n14_golden_15k.jsonl.gz
5-Point Quality Gate:
- Sub-Step 1.4.1: Record count validation (exact 15,000 records)
- Sub-Step 1.4.2: ChatML structure integrity test (100% of records)
- Sub-Step 1.4.3: Zero placeholder and banned pattern scanner
- Sub-Step 1.4.4: SHA-256 instruction duplicate rate check (0.00%)
- Sub-Step 1.4.5: Pillar ratio within +/- 0.5% tolerance of config & signoff marker file generation

Gate Condition: data/PHASE_1_AUDIT_PASSED.txt written ONLY if all 5 tests pass.
"""

import gzip
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_GZ_PATH = os.path.join(ROOT_DIR, "data", "n14_golden_15k.jsonl.gz")
MARKER_PATH = os.path.join(ROOT_DIR, "data", "PHASE_1_AUDIT_PASSED.txt")

BANNED_PATTERNS = [
    re.compile(r"Variant\s*#?\d+", re.IGNORECASE),
    re.compile(r"//\s*TODO", re.IGNORECASE),
    re.compile(r"/\*\s*implement.*?\*/", re.IGNORECASE),
    re.compile(r"add\s+logic\s+here", re.IGNORECASE),
    re.compile(r"\.\.\.", re.IGNORECASE),
    re.compile(r"\bplaceholder\b", re.IGNORECASE),
]

EXPECTED_PILLAR_QUOTAS = {
    "production_ui_ux": 5250,
    "fullstack_backend": 3750,
    "conversational_ai": 3000,
    "self_healing_debug": 1800,
    "sql_data_engineering": 1200,
}

EXPECTED_PILLAR_RATIOS = {
    "production_ui_ux": 0.35,
    "fullstack_backend": 0.25,
    "conversational_ai": 0.20,
    "self_healing_debug": 0.12,
    "sql_data_engineering": 0.08,
}

def load_dataset() -> List[Dict[str, Any]]:
    if not os.path.exists(DATA_GZ_PATH):
        raise FileNotFoundError(f"Master dataset file not found at: {DATA_GZ_PATH}")
    
    records = []
    with gzip.open(DATA_GZ_PATH, "rt", encoding="utf-8") as f:
        for line in f:
            records.append(json.loads(line))
    return records

# ----------------------------------------------------------------------
# SUB-STEP 1.4.1: Record Count Validation (Target: Exactly 15,000 records)
# ----------------------------------------------------------------------
def test_1_4_1_record_count(records: List[Dict[str, Any]]) -> Tuple[bool, Dict[str, Any]]:
    actual_count = len(records)
    target_count = 15000
    passed = (actual_count == target_count)
    result = {
        "test": "1.4.1 Record Count Validation",
        "target": target_count,
        "actual": actual_count,
        "passed": passed,
        "details": f"Found exactly {actual_count} records in {os.path.basename(DATA_GZ_PATH)}" if passed else f"Count mismatch: expected {target_count}, got {actual_count}"
    }
    return passed, result

# ----------------------------------------------------------------------
# SUB-STEP 1.4.2: ChatML Structure Integrity Test
# ----------------------------------------------------------------------
def test_1_4_2_chatml_structure(records: List[Dict[str, Any]]) -> Tuple[bool, Dict[str, Any]]:
    violations = 0
    violation_samples = []

    for idx, rec in enumerate(records):
        if "messages" not in rec or not isinstance(rec["messages"], list):
            violations += 1
            if len(violation_samples) < 3:
                violation_samples.append(f"Record {idx}: Missing 'messages' list")
            continue
        
        msgs = rec["messages"]
        if len(msgs) != 3:
            violations += 1
            if len(violation_samples) < 3:
                violation_samples.append(f"Record {idx}: Invalid message count ({len(msgs)} != 3)")
            continue
        
        expected_roles = ["system", "user", "assistant"]
        actual_roles = [m.get("role") for m in msgs]
        if actual_roles != expected_roles:
            violations += 1
            if len(violation_samples) < 3:
                violation_samples.append(f"Record {idx}: Invalid roles {actual_roles} != {expected_roles}")
            continue
        
        for m in msgs:
            content = m.get("content", "")
            if not content or not content.strip():
                violations += 1
                if len(violation_samples) < 3:
                    violation_samples.append(f"Record {idx}: Empty content for role {m.get('role')}")
                break

    passed = (violations == 0)
    result = {
        "test": "1.4.2 ChatML Structure Integrity",
        "total_checked": len(records),
        "violations": violations,
        "passed": passed,
        "violation_samples": violation_samples
    }
    return passed, result

# ----------------------------------------------------------------------
# SUB-STEP 1.4.3: Zero Placeholder & Banned Pattern Scanner
# ----------------------------------------------------------------------
def test_1_4_3_zero_placeholder(records: List[Dict[str, Any]]) -> Tuple[bool, Dict[str, Any]]:
    banned_hits = 0
    hit_samples = []

    for idx, rec in enumerate(records):
        assistant_content = rec["messages"][2]["content"]
        for pat in BANNED_PATTERNS:
            match = pat.search(assistant_content)
            if match:
                banned_hits += 1
                if len(hit_samples) < 5:
                    hit_samples.append({
                        "record_idx": idx,
                        "matched_token": match.group(0),
                        "snippet": assistant_content[max(0, match.start() - 30):min(len(assistant_content), match.end() + 30)]
                    })

    passed = (banned_hits == 0)
    result = {
        "test": "1.4.3 Zero Placeholder & Banned Pattern Scanner",
        "total_checked": len(records),
        "banned_hits": banned_hits,
        "passed": passed,
        "hit_samples": hit_samples
    }
    return passed, result

# ----------------------------------------------------------------------
# SUB-STEP 1.4.4: SHA-256 Duplicate Rate Check (Target: 0.00%)
# ----------------------------------------------------------------------
def test_1_4_4_duplicate_rate(records: List[Dict[str, Any]]) -> Tuple[bool, Dict[str, Any]]:
    seen_hashes = {}
    duplicate_count = 0

    for idx, rec in enumerate(records):
        user_prompt = rec["messages"][1]["content"]
        h = hashlib.sha256(user_prompt.strip().encode("utf-8")).hexdigest()
        if h in seen_hashes:
            duplicate_count += 1
        else:
            seen_hashes[h] = idx

    duplicate_rate_pct = (duplicate_count / max(1, len(records))) * 100.0
    passed = (duplicate_count == 0)
    result = {
        "test": "1.4.4 Duplicate Rate Verification",
        "total_records": len(records),
        "unique_prompts": len(seen_hashes),
        "duplicates": duplicate_count,
        "duplicate_rate_pct": round(duplicate_rate_pct, 4),
        "passed": passed
    }
    return passed, result

# ----------------------------------------------------------------------
# SUB-STEP 1.4.5: Pillar Ratio Within Tolerance (+/- 0.5%) & Signoff Marker
# ----------------------------------------------------------------------
def test_1_4_5_pillar_ratios(records: List[Dict[str, Any]]) -> Tuple[bool, Dict[str, Any]]:
    total = len(records)
    pillar_counts = {}
    for rec in records:
        p = rec.get("pillar", "unknown")
        pillar_counts[p] = pillar_counts.get(p, 0) + 1

    ratio_results = {}
    all_within_tolerance = True
    TOLERANCE = 0.005  # +/- 0.5%

    for pillar, target_ratio in EXPECTED_PILLAR_RATIOS.items():
        actual_count = pillar_counts.get(pillar, 0)
        actual_ratio = actual_count / float(total) if total > 0 else 0.0
        diff = abs(actual_ratio - target_ratio)
        within_tol = (diff <= TOLERANCE) and (actual_count == EXPECTED_PILLAR_QUOTAS[pillar])
        if not within_tol:
            all_within_tolerance = False
        ratio_results[pillar] = {
            "target_count": EXPECTED_PILLAR_QUOTAS[pillar],
            "actual_count": actual_count,
            "target_ratio": round(target_ratio * 100, 2),
            "actual_ratio": round(actual_ratio * 100, 2),
            "difference_pct": round(diff * 100, 3),
            "within_tolerance": within_tol
        }

    result = {
        "test": "1.4.5 Pillar Ratio Tolerance (+/- 0.5%)",
        "tolerance_pct": TOLERANCE * 100,
        "pillar_breakdown": ratio_results,
        "passed": all_within_tolerance
    }
    return all_within_tolerance, result

# ----------------------------------------------------------------------
# MASTER RUNNER & SIGN-OFF
# ----------------------------------------------------------------------
def run_audit(substep: str = "all") -> bool:
    print("=" * 80)
    print("  N-14 AUTOMATED 5-POINT QUALITY AUDIT GATE")
    print(f"  Target Mode: {substep.upper()}")
    print("=" * 80)

    records = load_dataset()
    print(f"Loaded {len(records)} records from {DATA_GZ_PATH}\n")

    results = {}
    overall_pass = True

    if substep in ["1.4.1", "all"]:
        p1, r1 = test_1_4_1_record_count(records)
        results["1.4.1"] = r1
        status_str = "PASS" if p1 else "FAIL"
        print(f"[TEST 1.4.1] Record Count: {r1['actual']}/{r1['target']} => {status_str}")
        if not p1:
            overall_pass = False

    if substep in ["1.4.2", "all"]:
        p2, r2 = test_1_4_2_chatml_structure(records)
        results["1.4.2"] = r2
        status_str = "PASS" if p2 else "FAIL"
        print(f"[TEST 1.4.2] ChatML Structure: {r2['violations']} violations => {status_str}")
        if not p2:
            overall_pass = False

    if substep in ["1.4.3", "all"]:
        p3, r3 = test_1_4_3_zero_placeholder(records)
        results["1.4.3"] = r3
        status_str = "PASS" if p3 else "FAIL"
        print(f"[TEST 1.4.3] Zero Placeholders: {r3['banned_hits']} hits => {status_str}")
        if not p3:
            overall_pass = False

    if substep in ["1.4.4", "all"]:
        p4, r4 = test_1_4_4_duplicate_rate(records)
        results["1.4.4"] = r4
        status_str = "PASS" if p4 else "FAIL"
        print(f"[TEST 1.4.4] Duplicate Rate: {r4['duplicate_rate_pct']:.4f}% ({r4['duplicates']} dupes) => {status_str}")
        if not p4:
            overall_pass = False

    if substep in ["1.4.5", "all"]:
        p5, r5 = test_1_4_5_pillar_ratios(records)
        results["1.4.5"] = r5
        status_str = "PASS" if p5 else "FAIL"
        print(f"[TEST 1.4.5] Pillar Ratios: all within tolerance => {status_str}")
        if not p5:
            overall_pass = False

    print("=" * 80)

    # If full audit passed, generate signoff marker
    if substep == "all" and overall_pass:
        sha256_hash = hashlib.sha256()
        with open(DATA_GZ_PATH, "rb") as f:
            for block in iter(lambda: f.read(65536), b""):
                sha256_hash.update(block)
        gz_sha256 = sha256_hash.hexdigest()

        signoff_content = (
            "================================================================================\n"
            "               N-14 PHASE 1 QUALITY AUDIT GATE SIGN-OFF\n"
            "================================================================================\n"
            f"Timestamp:              {datetime.now(timezone.utc).isoformat()}\n"
            f"Dataset File:           data/n14_golden_15k.jsonl.gz\n"
            f"Total Records:          {len(records)}\n"
            f"SHA-256 Checksum:       {gz_sha256}\n"
            f"Test 1.4.1 (Count):     PASSED (15,000 / 15,000 records)\n"
            f"Test 1.4.2 (ChatML):    PASSED (100% compliant structure)\n"
            f"Test 1.4.3 (Zero-TODO): PASSED (0 banned patterns / placeholders)\n"
            f"Test 1.4.4 (Dedup):     PASSED (0.00% duplicate rate)\n"
            f"Test 1.4.5 (Pillars):   PASSED (All 5 pillar quotas exactly met)\n"
            "--------------------------------------------------------------------------------\n"
            "AUTHOR & CREATOR ATTRIBUTION: Shawaz (https://shawaz.vercel.app/)\n"
            "BASE FOUNDATION MODEL:        Qwen/Qwen2.5-Coder-7B-Instruct\n"
            "STATUS:                       PHASE 1 COMPLETE — READY FOR PHASE 2 FINE-TUNING\n"
            "================================================================================\n"
        )
        with open(MARKER_PATH, "w", encoding="utf-8") as f:
            f.write(signoff_content)
        print(f"Marker file written: {MARKER_PATH}")

    return overall_pass

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    success = run_audit(mode)
    sys.exit(0 if success else 1)
