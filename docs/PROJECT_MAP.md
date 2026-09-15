# 🗺️ N-14 Project Architecture & Directory Map

> **Project**: **RAIZEN 7.61B / N-14**  
> **Creator**: [SHAWAZ](https://shawaz.vercel.app/)  
> **Architecture**: SOTA 7.61B Coding Foundation Model (`Qwen2.5-Coder-7B-Instruct` base) + Next.js 14 Swiss Editorial Chat Studio.

---

## ⚡ Quick-Reference: "Where do I look if I need to..."

| If you want to... | Look here | Notes |
| :--- | :--- | :--- |
| **Change the Chatbot UI / Web App** | [`raizen-studio/src/`](file:///d:/N-14/raizen-studio/src) | Main Next.js 14 app (pages, components, hooks, styles) |
| **Update Training Hyperparameters & DeepSpeed** | [`configs/`](file:///d:/N-14/configs) | `model_config.yaml`, `accelerate_config.yaml`, `deepspeed_zero3.json` |
| **Modify Training Dataset Generation & 5 Pillars** | [`src/pillars/`](file:///d:/N-14/src/pillars) & [`src/build_golden_dataset.py`](file:///d:/N-14/src/build_golden_dataset.py) | Generates the 15,000 multi-turn golden dataset |
| **Inspect / Audit the Dataset** | [`data/`](file:///d:/N-14/data) & [`src/audit_dataset.py`](file:///d:/N-14/src/audit_dataset.py) | Compressed corpus, JSON audit metrics, and validation logs |
| **Run / Update the Free Colab GPU Backend** | [`notebooks/RAIZEN_Colab_Engine.ipynb`](file:///d:/N-14/notebooks/RAIZEN_Colab_Engine.ipynb) | 1-click vLLM PagedAttention streaming server for free Google Colab GPUs |
| **Provision AWS EC2 GPU & Train Model** | [`scripts/setup_ec2.sh`](file:///d:/N-14/scripts/setup_ec2.sh) & [`src/train_n14.py`](file:///d:/N-14/src/train_n14.py) | Multi-GPU A10G setup and training script |
| **Merge LoRA Adapters & Upload to Hugging Face** | [`src/merge_lora.py`](file:///d:/N-14/src/merge_lora.py) & [`src/upload_to_hf.py`](file:///d:/N-14/src/upload_to_hf.py) | Weights fusion into FP16/GGUF and hub publishing |
| **Run Automated Tests** | [`tests/`](file:///d:/N-14/tests) | Run `python -m unittest discover -s tests` (164 tests) |
| **Review Master Engineering Roadmap** | [`N14_MASTER_ARCHITECTURAL_BLUEPRINT.md`](file:///d:/N-14/N14_MASTER_ARCHITECTURAL_BLUEPRINT.md) | Full 5-phase specifications and cost breakdowns |
| **Adjust Vercel Deployment Settings** | [`vercel.json`](file:///d:/N-14/vercel.json) & [`raizen-studio/vercel.json`](file:///d:/N-14/raizen-studio/vercel.json) | Build commands and output directories for production |

---

## 📂 Directory & File Catalog (Grouped by Function)

### 1. Core Web Application (`raizen-studio`)
- [`raizen-studio/`](file:///d:/N-14/raizen-studio) — The production Next.js 14 / React 19 web application for RAIZEN Studio. Includes the chat interface, Monaco-powered live code sandbox, snippets vault, persona engine, and Swiss Editorial theme.
- [`package.json`](file:///d:/N-14/package.json) — Root npm orchestration manifest that delegates `npm run dev`, `build`, `start`, and `lint` commands directly into `raizen-studio/`.
- [`vercel.json`](file:///d:/N-14/vercel.json) — Root-level Vercel deployment configuration directing builds into `raizen-studio/` and outputting to `raizen-studio/.next`.

### 2. AI Model Training & ML Pipeline
- [`src/`](file:///d:/N-14/src) — Core Python pipeline containing the 5-pillar dataset generator (`pillars/`), dataset builder (`build_golden_dataset.py`), auditor (`audit_dataset.py`, `full_audit.py`), training engine (`train_n14.py`), LoRA merger (`merge_lora.py`), and Hugging Face publisher (`upload_to_hf.py`).
- [`configs/`](file:///d:/N-14/configs) — Machine learning configurations for multi-GPU training: `model_config.yaml` (LoRA parameters & hyperparameters), `accelerate_config.yaml` (Hugging Face Accelerate FSDP/DDP), and `deepspeed_zero3.json` (DeepSpeed ZeRO-3 offloading).
- [`scripts/`](file:///d:/N-14/scripts) — Utility scripts including AWS EC2 instance initialization (`setup_ec2.sh`), smoke test runner (`smoke_test.py`), checkpoint validator (`validate_checkpoint.py`), and training entrypoint stub (`train.py`).
- [`models/`](file:///d:/N-14/models) — Local artifact storage for model verification outputs, benchmarks, and smoke test status reports (`smoke_test_report.json`).
- [`requirements.txt`](file:///d:/N-14/requirements.txt) — Python dependency manifest specifying exact versions for PyTorch, Transformers, PEFT, TRL, BitsAndBytes, DeepSpeed, FastAPI, and Hugging Face Hub.

### 3. Dataset & Fine-Tuning Corpus
- [`data/`](file:///d:/N-14/data) — Contains the fine-tuning corpus `n14_golden_15k.jsonl.gz` (15,000 synthetic multi-turn training conversations across 5 pillars), dataset audit metrics (`dataset_audit_report.json`), and phase completion marker (`PHASE_1_AUDIT_PASSED.txt`).

### 4. Cloud Inference & Backends
- [`notebooks/`](file:///d:/N-14/notebooks) — Contains `RAIZEN_Colab_Engine.ipynb`, an interactive Google Colab notebook that loads the 7.61B model in 4-bit and launches a high-throughput vLLM PagedAttention streaming backend via Cloudflare Quick Tunnel for zero-cost GPU inference.
- [`N-14.pem`](file:///d:/N-14/N-14.pem) — RSA private SSH key used to access remote AWS EC2 training instances (`g5.12xlarge`).

### 5. Testing & Quality Assurance
- [`tests/`](file:///d:/N-14/tests) — Comprehensive test suite consisting of 52 Python unit/integration test files (164 passing tests) validating Next.js components, state hooks, markdown streaming, keyboard shortcuts, sandbox bridge, and CORS health.

### 6. Documentation & Architecture
- [`N14_MASTER_ARCHITECTURAL_BLUEPRINT.md`](file:///d:/N-14/N14_MASTER_ARCHITECTURAL_BLUEPRINT.md) — Exhaustive master specification document defining the 5 project phases, GPU hardware requirements, training hyperparameters, prompt engineering standards, and API contracts.
- [`README.md`](file:///d:/N-14/README.md) — Public-facing GitHub repository documentation featuring project overview, architecture badges, creator credits for SHAWAZ, and quickstart instructions.
- [`.gitignore`](file:///d:/N-14/.gitignore) — Root Git ignore rules preventing large model weights (`*.safetensors`, `*.bin`), virtual environments, secrets (`*.pem`), and build outputs from being committed.

### 7. Design Prototypes & Standalone HTML Mockups
*Static exploratory prototypes created during the early UI/UX design phase before the Next.js app was built:*
- [`chatbox-preview.html`](file:///d:/N-14/chatbox-preview.html) — Standalone prototype of the chat interface using the soft blue "Asian Paints Curated Palette" (Sky Mimic / Blue Dawn).
- [`raizen-chatbox-exact.html`](file:///d:/N-14/raizen-chatbox-exact.html) — Standalone prototype of the chat interface using the current "Swiss Editorial Palette" (`#FAF8F5` canvas / `#EA580C` saffron).
- [`raizen-exact-match.html`](file:///d:/N-14/raizen-exact-match.html) — Standalone landing page mockup styled with Swiss Editorial typography and layout tokens.
- [`raizen-landing-palette.html`](file:///d:/N-14/raizen-landing-palette.html) — Standalone landing page mockup styled with the Asian Paints Sky Mimic palette.
- [`raizen-timeless-studio.html`](file:///d:/N-14/raizen-timeless-studio.html) — Standalone studio mockup featuring a 3-way palette switcher (Swiss Cream, Nordic Cobalt, Kurogane Graphite).
- [`raizen-ultimate-studio.html`](file:///d:/N-14/raizen-ultimate-studio.html) — Standalone studio mockup styled in a dark "Quantum Obsidian & Hyper-Cyan" developer theme.

### 8. Typography & Font Exploration Assets
- [`diseny fontss/`](file:///d:/N-14/diseny%20fontss) — Archive containing 26 Disney font packs (Aladdin, Cinderella, Frozen, Lion King, etc.) from font exploration. Only `Frozen.otf` was selected and copied into `raizen-studio/public/fonts/`.
- [`fonts/`](file:///d:/N-14/fonts) — Contains experimental display font demo files (`GC-Fodax-Demo`, `Peachtea`). Not referenced in the active Next.js web application.

---

## ⚠️ Redundancy, Unclear Items & Risk Audit

| Item / Path | Classification | Issue / Overlap Description | Recommendation |
| :--- | :--- | :--- | :--- |
| **Root HTML files** (`*.html`) vs [`raizen-studio/public/*.html`](file:///d:/N-14/raizen-studio/public) | 🟡 **Redundant / Duplicate** | The 6 static HTML files in the root folder are near-duplicates of the 6 files inside `raizen-studio/public/`. They are design prototypes superseded by the live Next.js app. | Move prototypes into a dedicated `docs/prototypes/` folder or retain only in `public/` if needed for iframe previews. |
| **Palette Overlaps** (`chatbox-preview.html` vs `raizen-chatbox-exact.html`) | 🟡 **Historical / Superseded** | `chatbox-preview.html` and `raizen-landing-palette.html` use the discarded "Asian Paints" palette, whereas `raizen-chatbox-exact.html` and `raizen-studio` use the final "Swiss Editorial" palette. | Archive or label as legacy design explorations. |
| [`diseny fontss/`](file:///d:/N-14/diseny%20fontss) & [`fonts/`](file:///d:/N-14/fonts) | 🟡 **Unused Assets & Typo** | `diseny fontss/` contains a typo in the folder name and 25 unused font families. `fonts/` has unused demo fonts. The active font (`Frozen.otf`) is already isolated in `raizen-studio/public/fonts/`. | Safe to archive or exclude from git via `.gitignore` to save disk space. |
| [`N-14.pem`](file:///d:/N-14/N-14.pem) | 🔴 **Security Risk** | An AWS EC2 private RSA key is present directly in the project root. | Ensure `*.pem` remains in `.gitignore`, and never push to public repositories. Move to `~/.ssh/` for security. |
| [`scripts/train.py`](file:///d:/N-14/scripts/train.py) vs [`src/train_n14.py`](file:///d:/N-14/src/train_n14.py) | 🟡 **Ambiguity / Duplicate** | `scripts/train.py` is a 470-byte minimal wrapper, while `src/train_n14.py` is the actual 9KB production training engine with FSDP/LoRA support. | Keep `src/train_n14.py` as primary or have `scripts/train.py` explicitly invoke `src/train_n14.py`. |
| Dual [`vercel.json`](file:///d:/N-14/vercel.json) files | 🟢 **Intended Structure** | Root `vercel.json` redirects the build into `raizen-studio`, while `raizen-studio/vercel.json` provides headers/rewrites when deploying directly from the subdirectory. | Keep both; this enables deploying either from the repo root or from the subfolder. |
