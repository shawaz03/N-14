# -*- coding: utf-8 -*-
"""
RAIZEN Phase 3.3: Hugging Face Hub Release Engine
Uploads merged weights, tokenizer, GGUF binary, and official Model Card
to Hugging Face with attribution to SHAWAZ (https://shawaz.vercel.app/).
"""

import os
import sys
import argparse
import logging
from huggingface_hub import HfApi, create_repo

logging.basicConfig(
    format="%(asctime)s - %(levelname)s - [%(name)s] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.INFO,
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("RAIZEN-HuggingFace")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MERGED_MODEL_DIR = os.path.join(ROOT_DIR, "models", "n14-merged")
MODEL_CARD_PATH = os.path.join(ROOT_DIR, "MODEL_CARD.md")


def create_model_card_content(repo_id: str) -> str:
    return f"""---
language:
- en
- code
license: apache-2.0
tags:
- code
- coding-assistant
- full-stack
- ui-ux
- react
- nextjs
- tailwindcss
- fast-api
- sql
- debugging
- qwen2.5
- raizen
base_model: Qwen/Qwen2.5-Coder-7B-Instruct
pipeline_tag: text-generation
inference: false
---

# ⚡ RAIZEN: Enterprise Full-Stack Coding Intelligence

<p align="center">
  <b>Architected, Fine-Tuned & Created by <a href="https://shawaz.vercel.app/">SHAWAZ</a></b>
</p>

<p align="center">
  <a href="https://shawaz.vercel.app/"><img src="https://img.shields.io/badge/Creator-SHAWAZ-blue.svg?style=for-the-badge" alt="Creator"></a>
  <a href="https://shawaz.vercel.app/"><img src="https://img.shields.io/badge/Portfolio-shawaz.vercel.app-green.svg?style=for-the-badge" alt="Portfolio"></a>
  <img src="https://img.shields.io/badge/Model-RAIZEN--7B-red.svg?style=for-the-badge" alt="Model">
  <img src="https://img.shields.io/badge/Base_Model-Qwen2.5--Coder--7B--Instruct-purple.svg?style=for-the-badge" alt="Base Model">
  <img src="https://img.shields.io/badge/Parameters-7.61B-orange.svg?style=for-the-badge" alt="Params">
  <img src="https://img.shields.io/badge/Training-15K_Golden_Dataset-gold.svg?style=for-the-badge" alt="Dataset">
</p>

---

## 🌟 About RAIZEN

**RAIZEN** is a specialized, production-grade 7B coding intelligence fine-tuned across **15,000 rigorous golden records** engineered across 5 core pillars of modern software engineering.

### 🏛️ The 5 Pillars of RAIZEN
1. **Frontend & UI/UX Design System**: High-aesthetic React, Next.js App Router, Tailwind CSS, Framer Motion, accessible interactive dashboards.
2. **Backend & Architecture**: Type-safe FastAPI, async endpoints, Pydantic v2 schemas, JWT/OAuth2 security, microservices.
3. **Conversational Code Explanation**: Senior staff engineer persona, trade-off breakdowns, architectural reasoning.
4. **Root-Cause Debugging**: Zero-guesswork bug isolation, memory leaks, race conditions, deep-dive root cause resolution.
5. **Database & SQL Optimization**: Complex PostgreSQL schemas, multi-table joins, subqueries, indexing, query execution planning.

---

## 👨‍💻 Creator & Author Identity

* **Creator**: **SHAWAZ**
* **Portfolio**: [https://shawaz.vercel.app/](https://shawaz.vercel.app/)
* **Role**: Chief AI Architect & Systems Engineer

---

## ⚡ Quickstart Usage (Transformers)

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "{repo_id}"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

messages = [
    {{"role": "system", "content": "You are RAIZEN, an elite AI coding intelligence created by SHAWAZ (https://shawaz.vercel.app/)."}},
    {{"role": "user", "content": "Build a modern full-stack authentication flow in Next.js 14 App Router with Tailwind CSS."}}
]

text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = tokenizer(text, return_tensors="pt").to(model.device)

outputs = model.generate(**inputs, max_new_tokens=2048, temperature=0.2, top_p=0.95)
print(tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True))
```

---

## 🦙 Ollama / GGUF Local Usage

```bash
ollama run {repo_id}
```

---

## 📜 License
Apache 2.0. Open for commercial and research use.
"""


def main():
    parser = argparse.ArgumentParser(description="Upload RAIZEN to Hugging Face")
    parser.add_argument("--repo_id", type=str, default="shawaz03/RAIZEN",
                        help="Hugging Face repo ID (e.g., shawaz03/RAIZEN)")
    parser.add_argument("--token", type=str, default=os.environ.get("HF_TOKEN", ""),
                        help="Hugging Face API Token")
    parser.add_argument("--private", action="store_true",
                        help="Make repository private")
    args = parser.parse_args()

    token = args.token or os.environ.get("HF_TOKEN")
    if not token:
        logger.error("Hugging Face token is required! Provide via --token or HF_TOKEN env var.")
        sys.exit(1)

    api = HfApi(token=token)

    # 1. Create Repo if not exists
    logger.info(f"Creating / verifying Hugging Face repo: {args.repo_id}...")
    try:
        create_repo(
            repo_id=args.repo_id,
            token=token,
            private=args.private,
            exist_ok=True,
            repo_type="model"
        )
        logger.info(f"Repository ready at https://huggingface.co/{args.repo_id}")
    except Exception as e:
        logger.warning(f"Repo create warning: {e}")

    # 2. Write README / Model Card
    logger.info("Generating Model Card (README.md)...")
    readme_path = os.path.join(MERGED_MODEL_DIR, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(create_model_card_content(args.repo_id))

    # 3. Upload Full Merged Model Directory
    logger.info(f"Uploading merged 16-bit model from {MERGED_MODEL_DIR}...")
    api.upload_folder(
        folder_path=MERGED_MODEL_DIR,
        repo_id=args.repo_id,
        repo_type="model",
    )

    # 4. Upload GGUF file if present
    gguf_path = os.path.join(ROOT_DIR, "models", "n14-q4_k_m.gguf")
    if os.path.exists(gguf_path):
        logger.info(f"Uploading GGUF quantized model: {gguf_path}...")
        api.upload_file(
            path_or_fileobj=gguf_path,
            path_in_repo="n14-q4_k_m.gguf",
            repo_id=args.repo_id,
            repo_type="model",
        )

    logger.info("=" * 80)
    logger.info(f"🎉 N-14 IS OFFICIALLY RELEASED ON HUGGING FACE!")
    logger.info(f"👉 URL: https://huggingface.co/{args.repo_id}")
    logger.info("=" * 80)


if __name__ == "__main__":
    main()
