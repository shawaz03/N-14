#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
N-14 Training Script Entrypoint (Task 2.2)
Aliases src/train_n14.py for CLI execution and accelerate launch.
Usage:
    accelerate launch scripts/train.py
    python scripts/train.py --dry_run
"""

import os
import sys

# Ensure root dir is on path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)

from src.train_n14 import main

if __name__ == "__main__":
    main()
