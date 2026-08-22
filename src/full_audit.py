# -*- coding: utf-8 -*-
"""
N-14 Pre-Merge Full Audit Script
Runs ALL 5 pillar generators and performs a comprehensive cross-pillar validation.
Checks:
  1. Per-pillar record count matches blueprint quota
  2. Total records == 15,000
  3. Banned pattern scanner across ALL assistant responses
  4. SHA-256 prompt deduplication (GLOBAL across all pillars)
  5. ChatML structure integrity (system/user/assistant message format)
  6. Creator attribution verification (Shawaz branding in Pillar 3)
  7. Pillar label consistency
  8. Empty/whitespace content check
"""

import sys
import os
import re
import hashlib
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import all pillar generators
from pillars.pillar1_ui_ux import generate_pillar1_records
from pillars.pillar2_backend import generate_pillar2_records
from pillars.pillar3_conversational import generate_pillar3_records
from pillars.pillar4_debugging import generate_pillar4_records
from pillars.pillar5_sql import generate_pillar5_records

BANNED_PATTERNS = [
    re.compile(r"Variant\s*#?\d+", re.IGNORECASE),
    re.compile(r"//\s*TODO", re.IGNORECASE),
    re.compile(r"/\*\s*implement.*?\*/", re.IGNORECASE),
    re.compile(r"add\s+logic\s+here", re.IGNORECASE),
    re.compile(r"\.\.\.", re.IGNORECASE),
    re.compile(r"\bplaceholder\b", re.IGNORECASE),
]

EXPECTED = {
    "production_ui_ux": 5250,
    "fullstack_backend": 3750,
    "conversational_ai": 3000,
    "self_healing_debug": 1800,
    "sql_data_engineering": 1200,
}

def get_hash(text: str) -> str:
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()

def run_full_audit():
    print("=" * 72)
    print("  N-14 GOLDEN DATASET — PRE-MERGE COMPREHENSIVE AUDIT")
    print("=" * 72)
    
    errors = []
    warnings = []
    
    # ---- PHASE A: Generate all pillar records ----
    print("\n[PHASE A] Generating all 5 pillar datasets...\n")
    
    try:
        p1 = generate_pillar1_records()
    except Exception as e:
        errors.append(f"Pillar 1 generation CRASHED: {e}")
        p1 = []
    
    try:
        p2 = generate_pillar2_records()
    except Exception as e:
        errors.append(f"Pillar 2 generation CRASHED: {e}")
        p2 = []
    
    try:
        p3 = generate_pillar3_records()
    except Exception as e:
        errors.append(f"Pillar 3 generation CRASHED: {e}")
        p3 = []
    
    try:
        p4 = generate_pillar4_records()
    except Exception as e:
        errors.append(f"Pillar 4 generation CRASHED: {e}")
        p4 = []
    
    try:
        p5 = generate_pillar5_records()
    except Exception as e:
        errors.append(f"Pillar 5 generation CRASHED: {e}")
        p5 = []
    
    all_records = p1 + p2 + p3 + p4 + p5
    
    print(f"\n{'=' * 72}")
    print(f"[PHASE B] Running 8-Point Quality Audit Gate on {len(all_records)} records...")
    print(f"{'=' * 72}\n")
    
    # ---- CHECK 1: Per-Pillar Record Counts ----
    print("[CHECK 1] Per-Pillar Record Count Validation")
    pillar_counts = {}
    for rec in all_records:
        p = rec.get("pillar", "UNKNOWN")
        pillar_counts[p] = pillar_counts.get(p, 0) + 1
    
    for pillar_name, expected_count in EXPECTED.items():
        actual = pillar_counts.get(pillar_name, 0)
        status = "PASS" if actual == expected_count else "FAIL"
        icon = "OK" if status == "PASS" else "XX"
        print(f"  [{icon}] {pillar_name}: {actual} / {expected_count}  ({status})")
        if actual != expected_count:
            errors.append(f"Pillar '{pillar_name}' count mismatch: expected {expected_count}, got {actual}")
    
    # ---- CHECK 2: Total Count ----
    print(f"\n[CHECK 2] Total Record Count")
    total = len(all_records)
    status = "PASS" if total == 15000 else "FAIL"
    icon = "OK" if status == "PASS" else "XX"
    print(f"  [{icon}] Total: {total} / 15,000  ({status})")
    if total != 15000:
        errors.append(f"Total record count mismatch: expected 15000, got {total}")
    
    # ---- CHECK 3: ChatML Message Structure Integrity ----
    print(f"\n[CHECK 3] ChatML Message Structure Integrity")
    struct_errors = 0
    for idx, rec in enumerate(all_records):
        msgs = rec.get("messages", [])
        if len(msgs) != 3:
            struct_errors += 1
            if struct_errors <= 3:
                errors.append(f"Record {idx}: Expected 3 messages, found {len(msgs)}")
            continue
        if msgs[0]["role"] != "system":
            struct_errors += 1
        if msgs[1]["role"] != "user":
            struct_errors += 1
        if msgs[2]["role"] != "assistant":
            struct_errors += 1
    icon = "OK" if struct_errors == 0 else "XX"
    print(f"  [{icon}] Structure violations: {struct_errors}  ({'PASS' if struct_errors == 0 else 'FAIL'})")
    if struct_errors > 0:
        errors.append(f"ChatML structure violations: {struct_errors}")
    
    # ---- CHECK 4: Empty / Whitespace Content ----
    print(f"\n[CHECK 4] Empty or Whitespace Content Check")
    empty_count = 0
    for idx, rec in enumerate(all_records):
        msgs = rec.get("messages", [])
        for m in msgs:
            if not m.get("content", "").strip():
                empty_count += 1
                if empty_count <= 3:
                    errors.append(f"Record {idx}: Empty content in role '{m.get('role')}'")
    icon = "OK" if empty_count == 0 else "XX"
    print(f"  [{icon}] Empty content fields: {empty_count}  ({'PASS' if empty_count == 0 else 'FAIL'})")
    
    # ---- CHECK 5: GLOBAL SHA-256 Prompt Deduplication ----
    print(f"\n[CHECK 5] Global SHA-256 Prompt Deduplication (across ALL pillars)")
    seen_hashes = {}
    dupe_count = 0
    for idx, rec in enumerate(all_records):
        u_text = rec["messages"][1]["content"]
        h = get_hash(u_text)
        if h in seen_hashes:
            dupe_count += 1
            if dupe_count <= 5:
                first_idx = seen_hashes[h]
                warnings.append(f"Duplicate prompt: record {idx} matches record {first_idx}")
        else:
            seen_hashes[h] = idx
    icon = "OK" if dupe_count == 0 else "!!"
    level = "PASS" if dupe_count == 0 else "WARN"
    print(f"  [{icon}] Cross-pillar duplicates: {dupe_count}  ({level})")
    if dupe_count > 0:
        warnings.append(f"Total cross-pillar duplicate prompts: {dupe_count}")
    
    # ---- CHECK 6: Banned Pattern Scanner (ALL assistant responses) ----
    print(f"\n[CHECK 6] Banned Pattern Scanner (ALL assistant responses)")
    banned_hits = 0
    for idx, rec in enumerate(all_records):
        a_text = rec["messages"][2]["content"]
        for pat in BANNED_PATTERNS:
            match = pat.search(a_text)
            if match:
                banned_hits += 1
                if banned_hits <= 5:
                    errors.append(f"Record {idx}: Banned token '{match.group(0)}' in assistant response")
    icon = "OK" if banned_hits == 0 else "XX"
    print(f"  [{icon}] Banned pattern matches: {banned_hits}  ({'PASS' if banned_hits == 0 else 'FAIL'})")
    
    # ---- CHECK 7: Creator Attribution (Pillar 3 Shawaz Branding) ----
    print(f"\n[CHECK 7] Creator Attribution (Shawaz branding in Pillar 3)")
    p3_recs = [r for r in all_records if r.get("pillar") == "conversational_ai"]
    shawaz_in_system = 0
    shawaz_in_identity = 0
    identity_recs = [r for r in p3_recs[:500]]  # First 500 are identity records
    
    for rec in p3_recs:
        sys_content = rec["messages"][0]["content"]
        if "shawaz" in sys_content.lower() or "Shawaz" in sys_content:
            shawaz_in_system += 1
    
    for rec in identity_recs:
        a_content = rec["messages"][2]["content"]
        if "shawaz" in a_content.lower() or "Shawaz" in a_content:
            shawaz_in_identity += 1
    
    pct_system = (shawaz_in_system / max(len(p3_recs), 1)) * 100
    pct_identity = (shawaz_in_identity / max(len(identity_recs), 1)) * 100
    
    icon = "OK" if pct_system == 100 and pct_identity == 100 else "!!"
    print(f"  [{icon}] 'Shawaz' in system prompt: {shawaz_in_system}/{len(p3_recs)} ({pct_system:.1f}%)")
    print(f"  [{icon}] 'Shawaz' in identity responses: {shawaz_in_identity}/{len(identity_recs)} ({pct_identity:.1f}%)")
    
    portfolio_hits = sum(1 for r in identity_recs if "shawaz.vercel.app" in r["messages"][2]["content"])
    print(f"  [{icon}] Portfolio URL in identity responses: {portfolio_hits}/{len(identity_recs)} ({(portfolio_hits/max(len(identity_recs),1))*100:.1f}%)")
    
    if pct_system < 100:
        errors.append(f"Shawaz attribution missing in {len(p3_recs) - shawaz_in_system} system prompts")
    if pct_identity < 100:
        errors.append(f"Shawaz attribution missing in {len(identity_recs) - shawaz_in_identity} identity responses")
    
    # ---- CHECK 8: Pillar Label Consistency ----
    print(f"\n[CHECK 8] Pillar Label Consistency")
    valid_labels = set(EXPECTED.keys())
    unknown_labels = set(pillar_counts.keys()) - valid_labels
    icon = "OK" if len(unknown_labels) == 0 else "XX"
    print(f"  [{icon}] Unknown pillar labels: {unknown_labels if unknown_labels else 'None'}  ({'PASS' if not unknown_labels else 'FAIL'})")
    if unknown_labels:
        errors.append(f"Unknown pillar labels found: {unknown_labels}")
    
    # ---- SUMMARY ----
    print(f"\n{'=' * 72}")
    print(f"  AUDIT SUMMARY")
    print(f"{'=' * 72}")
    print(f"  Total Records:          {total}")
    print(f"  Errors (BLOCKING):      {len(errors)}")
    print(f"  Warnings (NON-BLOCK):   {len(warnings)}")
    
    if errors:
        print(f"\n  BLOCKING ERRORS:")
        for e in errors:
            print(f"    [XX] {e}")
    
    if warnings:
        print(f"\n  WARNINGS:")
        for w in warnings:
            print(f"    [!!] {w}")
    
    if not errors:
        print(f"\n  VERDICT: ALL 8 CHECKS PASSED — DATASET READY FOR MERGE")
        print(f"{'=' * 72}")
        return 0
    else:
        print(f"\n  VERDICT: AUDIT FAILED — {len(errors)} blocking error(s) must be fixed")
        print(f"{'=' * 72}")
        return 1

if __name__ == "__main__":
    sys.exit(run_full_audit())
