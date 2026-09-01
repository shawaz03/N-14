<div align="center">

```text
██████╗  █████╗ ██╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██║╚══███╔╝██╔════╝████╗  ██║
██████╔╝███████║██║  ███╔╝ █████╗  ██╔██╗ ██║
██╔══██╗██╔══██║██║ ███╔╝  ██╔══╝  ██║╚██╗██║
██║  ██║██║  ██║██║███████╗███████╗██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝
```

# RAIZEN 7.61B — Enterprise AI Coding Intelligence

[![Hugging Face Model](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-shawaz03%2FRAIZEN-yellow?style=for-the-badge)](https://huggingface.co/shawaz03/RAIZEN)
[![Google Colab](https://img.shields.io/badge/Google%20Colab-1--Click%20GPU%20Engine-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white)](https://colab.research.google.com/github/shawaz03/N-14/blob/main/notebooks/RAIZEN_Colab_Engine.ipynb)
[![Next.js Studio](https://img.shields.io/badge/Next.js%2014-Terminal%20Brutalism-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://github.com/shawaz03/N-14/tree/main/raizen-studio)
[![Creator](https://img.shields.io/badge/Architect%20%26%20Creator-SHAWAZ-CCFF00?style=for-the-badge&logo=vercel&logoColor=black)](https://shawaz.vercel.app/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <b>RAIZEN</b> is a state-of-the-art <b>7.61B parameter coding foundation model</b> fine-tuned from <code>Qwen2.5-Coder-7B-Instruct</code> over a curated 15,000 multi-turn dataset on 4× NVIDIA A10G GPUs.<br>
  Paired with an industrial <b>Terminal Brutalism Developer Studio</b> featuring a dual-engine live code sandbox (Monaco + React Live Preview).
</p>

---

</div>

## 👨‍💻 Architect & Creator

**RAIZEN** was conceptualized, engineered, trained, tuned, and architected by:

### 🌟 **SHAWAZ**
- 🌐 **Portfolio & Interactive Works**: [https://shawaz.vercel.app/](https://shawaz.vercel.app/)
- 🐙 **GitHub**: [@shawaz03](https://github.com/shawaz03)
- 🤗 **Hugging Face**: [@shawaz03](https://huggingface.co/shawaz03)

---

## ⚡ Key Highlights & Architecture

- 🧠 **Foundation Model**: `Qwen/Qwen2.5-Coder-7B-Instruct` base (7.61 Billion Parameters).
- 🏆 **Fine-Tuning Dataset**: 15,000 Golden ChatML Multi-Turn Samples spanning 5 core pillars:
  1. *Full-Stack Architecture* (React 18, Next.js App Router, TypeScript, Tailwind CSS)
  2. *Algorithmic Rigor & Systems* (Python, Rust, C++, Big-O complexity)
  3. *Enterprise Refactoring & Defensive Security* (Zero-day patches, sanitized inputs)
  4. *Multi-File Engineering* (Clean separation of concerns, DRY, SOLID)
  5. *Deep Chain-of-Thought Reasoning* (Step-by-step `<think>` decomposition)
- 🚀 **Distributed Training**: Distributed across **4× NVIDIA A10G GPUs** (`g5.12xlarge`) using PyTorch DDP, FlashAttention-2, and QLoRA across 3 full epochs (1,338 steps).
- 📦 **Hugging Face Model Release**: [shawaz03/RAIZEN](https://huggingface.co/shawaz03/RAIZEN) (Self-contained, merged weights ready for Hugging Face Transformers & vLLM).
- ⚡ **1-Click Google Colab Backend**: High-throughput vLLM PagedAttention streaming engine (8–15 tok/s) running on free T4/A100 GPUs with Cloudflare Quick Tunnels and keep-alive watchdog.
- 🖤 **Terminal Brutalism Next.js Studio**: High-contrast OLED Black (`#050505`) and Acid Lime (`#CCFF00`) developer interface with Monaco Editor and live React component preview runner.

---

## 🛠️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    RAIZEN PROJECT PIPELINE                  │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: Golden 15K Dataset Engineering                    │
│           ├── 15,000 High-Quality ChatML Dialogues          │
│           └── Deep Multi-Turn Synthetic Reasoning           │
│                                                             │
│  Phase 2: Distributed Multi-GPU Training                    │
│           ├── 4× NVIDIA A10G GPUs (AWS EC2 g5.12xlarge)     │
│           └── 3 Epochs (1,338 steps) / PyTorch DDP + QLoRA  │
│                                                             │
│  Phase 3: Model Merging & Release                           │
│           └── Published to Hugging Face: shawaz03/RAIZEN    │
│                                                             │
│  Phase 4: Google Colab Streaming Engine                     │
│           ├── FastAPI SSE /v1/chat/completions              │
│           └── Cloudflare Quick Tunnel + Watchdog Thread     │
│                                                             │
│  Phase 5: Next.js Terminal Brutalism Chat Studio            │
│           ├── Monaco Code Editor (raizen-dark theme)        │
│           ├── Sandboxed React 18 / Babel Preview Runner     │
│           └── Live Hardware Telemetry & Token Velocity      │
│                                                             │
│  Phase 6: Integration Testing & Vercel Deployment           │
│           └── 113 Unit Tests Passing / Zero-Config Deploy   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart Guide

### 1. Launch the Free GPU Inference Engine in Google Colab
1. Open the [RAIZEN Colab Notebook](https://colab.research.google.com/github/shawaz03/N-14/blob/main/notebooks/RAIZEN_Colab_Engine.ipynb).
2. Go to **Runtime > Change runtime type > T4 GPU**.
3. Run all cells (`Ctrl+F9`).
4. Copy the generated **Cloudflare Quick Tunnel URL** (e.g. `https://xxxx.trycloudflare.com`).

### 2. Run the Next.js Terminal Brutalism Studio Locally
```bash
# Clone the repository
git clone https://github.com/shawaz03/N-14.git
cd N-14/raizen-studio

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000), paste your Cloudflare Tunnel URL into the top bar, and hit `[CONNECT]`.

---

## ⌨️ Studio Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| `Escape` | **Abort Stream** | Immediately stops the active token generation stream. |
| `Ctrl + L` | **Clear Terminal** | Clears chat conversation history and resets screen. |
| `Ctrl + \` | **Toggle View** | Switches between Chat Terminal and Dual Split Sandbox. |
| `Ctrl + Enter` | **Send Prompt** | Submits command from the multiline input prompt. |

---

## 🧪 Verification & Test Suite

The entire repository is covered by automated unit tests validating model schemas, SSE chunking, CORS headers, React preview sandboxing, and Vercel builds:

```bash
python -m unittest discover -s tests -p "test_*.py" -v
# Output: Ran 113 tests in 1.1s (OK - 100% Passing)
```

---

## 📄 License & Attribution

Distributed under the **Apache 2.0 License**.

**Created & Maintained by SHAWAZ**:  
Portfolio: [https://shawaz.vercel.app/](https://shawaz.vercel.app/)  
Model: [shawaz03/RAIZEN](https://huggingface.co/shawaz03/RAIZEN)
