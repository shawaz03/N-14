# 🏗️ N-14 — FINAL MASTER ARCHITECTURAL BLUEPRINT

---

## 📌 Executive Summary

| Field | Specification |
| :--- | :--- |
| **Project Name** | **N-14** |
| **Mission** | Build an autonomous, production-grade AI Full-Stack Software Engineer from scratch, achieving **10/10 graded outputs** in TypeScript, React 19, Next.js 15, Tailwind CSS, Prisma, SQL, and natural human conversation. |
| **Base Model** | [`Qwen/Qwen2.5-Coder-7B-Instruct`](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct) — #1 SOTA open-source coding model in the 7B class (88.4% HumanEval) |
| **Dataset Strategy** | **15,000 curated, zero-placeholder, production-grade records** (LIMA Principle) |
| **Training Hardware** | AWS EC2 `g5.12xlarge` — **4× NVIDIA A10G GPUs (96 GB total VRAM)**, 48 vCPUs, 192 GB RAM |
| **Training Duration** | **~45 minutes** (3 full epochs, 2,812 optimizer steps) |
| **Total AWS Cost** | **~$4.25** (from $90 available credits) |
| **Project Directory** | `d:\N-14\` (Fresh workspace, clean from scratch) |
| **HF Release Repo** | `shawaz03/n-14` |

---

## 🗺️ 5-Phase Lifecycle Overview

```
┌──────────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐
│  PHASE 1                 │    │  PHASE 2                 │    │  PHASE 3                 │
│  Golden 15K Dataset      │───►│  4×A10G Distributed      │───►│  Model Merge, Quantize   │
│  Engineering & Audit     │    │  Full-Convergence Train   │    │  & Hugging Face Release   │
│  (~10 mins, local)       │    │  (~45 mins, AWS EC2)     │    │  (~15 mins, AWS EC2)     │
└──────────────────────────┘    └──────────────────────────┘    └──────────────────────────┘
                                                                            │
┌──────────────────────────┐    ┌──────────────────────────┐                ▼
│  PHASE 5                 │    │  PHASE 4                 │◄───────────────┘
│  Next.js Chat Studio     │◄───│  FastAPI Streaming       │
│  & Live Code Sandbox     │    │  Inference API Engine    │
│  (~30 mins, local)       │    │  (~15 mins, AWS EC2)     │
└──────────────────────────┘    └──────────────────────────┘
```

### Phase Dependencies:
- Phase 2 **requires** Phase 1 (dataset must exist before training)
- Phase 3 **requires** Phase 2 (trained adapter must exist before merging)
- Phase 4 **requires** Phase 3 (merged model must exist before serving)
- Phase 5 **requires** Phase 4 (API endpoint must exist before frontend connects)

---

---

# PHASE 1: Golden 15K Dataset Engineering & Audit

**Goal**: Construct a **15,000-record, zero-placeholder, multi-pillar dataset** in strict ChatML format that covers the full problem space of modern full-stack development with 3–5 deep variations per pattern.

**Directory**: `d:\N-14\data\`

---

### Task 1.1: Create Project Scaffold

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 1.1.1 | Create fresh project directory | `d:\N-14\` with subdirectories: `src/`, `data/`, `configs/`, `scripts/`, `models/` |
| 1.1.2 | Initialize Git repository | `git init` + `.gitignore` (exclude `models/`, `*.safetensors`, `__pycache__/`) |
| 1.1.3 | Create `requirements.txt` | Pin exact versions: `transformers==4.48.0`, `torch==2.5.1`, `peft==0.14.0`, `bitsandbytes==0.45.0`, `trl==0.14.0`, `accelerate==0.36.0`, `datasets==3.2.0` |
| 1.1.4 | Create `configs/model_config.yaml` | Central config: `base_model`, `lora_r`, `lora_alpha`, `learning_rate`, `epochs`, `batch_size`, `max_seq_len` |

> **✅ Done when**: `d:\N-14\` exists with all subdirectories, Git is initialized, and config files are committed.

---

### Task 1.2: Build the 5-Pillar Dataset Generator (`src/build_golden_dataset.py`)

Each pillar must contain **handcrafted, production-grade instruction/response pairs** with zero synthetic f-string templates, zero `Variant #X` tags, and zero placeholder comments.

| Sub-Step | Pillar | Records | Content Specification |
| :--- | :--- | :--- | :--- |
| 1.2.1 | **Pillar 1: Production UI/UX** | **5,250** (35%) | Complete React 19 + TypeScript + Tailwind CSS components. Each record must include: `'use client'` directive, full `import` statements, TypeScript `interface` definitions, real `useState`/`useReducer` hooks, complete JSX with responsive classes, and Lucide icons. **Component categories**: Pricing matrices (monthly/annual toggle + feature checkmarks), Navbars (mobile hamburger + dropdown), Modal dialogs (form validation + close handlers), Kanban boards (drag-drop columns), Dashboard stat cards, Multi-step checkout wizards, OTP verification inputs, Command palettes (Cmd+K search), Audio/video players, Data tables (sort + filter + pagination), Sidebar navigation, Toast notification systems, Carousel/slider components, Settings pages, Profile cards, File upload dropzones, Calendar date pickers, Markdown split editors, Authentication forms (login/register/forgot password), 404/500 error pages. |
| 1.2.2 | **Pillar 2: Full-Stack Backend** | **3,750** (25%) | Next.js 15 App Router Server Actions with Zod schema validation and structured error responses. Prisma ORM schemas (e-commerce product catalogs, social network graphs, multi-tenant SaaS with row-level security). Express.js/Hono REST API routes. JWT authentication middleware with refresh token rotation. Stripe payment intent creation and webhook signature verification. Redis caching layers with TTL invalidation. WebSocket real-time chat server. Rate limiting middleware. File upload to S3 with presigned URLs. Email service integration (Resend/Nodemailer). Environment variable validation with `t3-env`. |
| 1.2.3 | **Pillar 3: Conversational AI** | **3,000** (20%) | Natural, friendly, human-like developer assistant dialogue. **Categories**: Greetings and self-introduction (*"Hi, I'm N-14, your full-stack engineering assistant..."*), Architecture explanations (*"Explain how Next.js Server Components differ from Client Components"*), Technology comparisons (*"Zustand vs Redux Toolkit vs Jotai — which should I pick?"*), Best practice guidance (*"How should I structure a large Next.js 15 monorepo?"*), Code review and feedback (*"Review this React component and suggest improvements"*), Career/learning advice (*"What's the best roadmap to become a senior full-stack developer?"*). |
| 1.2.4 | **Pillar 4: Self-Healing & Debug** | **1,800** (12%) | Real-world runtime errors paired with root-cause diagnosis and exact code patches. **Error categories**: React hydration mismatches (`Text content does not match server-rendered HTML`), TypeScript generic inference failures, `undefined is not a function` crashes with stack trace analysis, Next.js build failures (`Module not found`), Prisma migration conflicts, ESLint/Prettier configuration clashes, CORS errors with fix explanations, Memory leaks from missing `useEffect` cleanup, Infinite re-render loops from dependency array mistakes, `npm install` peer dependency conflicts. |
| 1.2.5 | **Pillar 5: SQL & Data Engineering** | **1,200** (8%) | Production SQL queries across PostgreSQL/MySQL. **Query categories**: Multi-table JOINs (INNER, LEFT, RIGHT, FULL OUTER), Subqueries and correlated subqueries, Common Table Expressions (CTEs) with recursive CTEs, Window functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, `LEAD()`), Aggregation with `GROUP BY` / `HAVING`, Index creation and optimization strategies, Database schema design (normalization, foreign keys, constraints), Transaction isolation levels, Stored procedures and triggers, Data migration scripts. |

> **✅ Done when**: `src/build_golden_dataset.py` generates exactly 15,000 records, each with a `system`, `user`, and `assistant` message in ChatML format. Every code response must be syntactically complete (no `// TODO`, no `...`, no `Variant #`).

---

### Task 1.3: Format & Serialize Dataset

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 1.3.1 | Format all records in ChatML structure | Each record: `{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}` |
| 1.3.2 | Deduplicate by instruction text | Use SHA-256 hash of `user` content to remove exact duplicates |
| 1.3.3 | Shuffle deterministically | `random.seed(42)` for reproducibility |
| 1.3.4 | Save as compressed JSONL | Output: `data/n14_golden_15k.jsonl.gz` |
| 1.3.5 | Save pillar-level statistics | Output: `data/dataset_audit_report.json` with per-pillar counts, avg token lengths, and min/max sequence lengths |

> **✅ Done when**: `data/n14_golden_15k.jsonl.gz` contains exactly 15,000 deduplicated, shuffled records. `dataset_audit_report.json` confirms pillar distribution within ±2% of targets.

---

### Task 1.4: Automated Quality Audit Gate

| Sub-Step | Action | Pass Criteria |
| :--- | :--- | :--- |
| 1.4.1 | **ChatML Structure Validator** | 100% of records contain exactly `system` + `user` + `assistant` roles with `<\|im_start\|>` and `<\|im_end\|>` delimiters |
| 1.4.2 | **Banned Pattern Scanner** | 0 matches for regex: `Variant #\d+`, `// TODO`, `/* implement.*\*/`, `\.\.\.`, `add logic here`, `placeholder` |
| 1.4.3 | **Token Length Distribution Check** | Mean assistant response length: 400–800 tokens. No response < 50 tokens (too short) or > 3000 tokens (too long) |
| 1.4.4 | **Pillar Balance Verification** | Each pillar within ±2% of target percentage |
| 1.4.5 | **Duplicate Check** | 0 duplicate instruction hashes |

> **✅ Done when**: All 5 audit checks pass with 0 failures. A `PHASE_1_AUDIT_PASSED.txt` marker file is written to `data/`.

---

---

# PHASE 2: 4×A10G Distributed Full-Convergence Fine-Tuning

**Goal**: Fine-tune `Qwen/Qwen2.5-Coder-7B-Instruct` on the Golden 15K dataset using **4-GPU Distributed Data Parallel (DDP)** training across **3 complete epochs** with zero early stopping.

**Runs on**: AWS EC2 `g5.12xlarge` (4× NVIDIA A10G, 96 GB VRAM, 48 vCPUs, 192 GB RAM)

---

### Task 2.1: Provision & Configure AWS EC2 Instance

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 2.1.1 | Launch `g5.12xlarge` instance | AMI: `Deep Learning OSS Nvidia Driver AMI GPU PyTorch 2.5 (Ubuntu 22.04)`, Region: `us-east-1`, Key pair: `vibe-key`, Storage: **150 GiB gp3** |
| 2.1.2 | SSH into instance | `ssh -i vibe-key.pem ubuntu@<PUBLIC_IP>` |
| 2.1.3 | Verify 4 GPUs detected | `nvidia-smi` must show 4× NVIDIA A10G with 24 GB each |
| 2.1.4 | Install Python dependencies | `pip install transformers==4.48.0 torch peft bitsandbytes trl accelerate datasets wandb` |
| 2.1.5 | Upload dataset & training script | `scp` the `data/n14_golden_15k.jsonl.gz` and `src/train_n14.py` to the EC2 instance |

> **✅ Done when**: `nvidia-smi` shows 4 GPUs, all Python packages installed, dataset file exists on EC2.

---

### Task 2.2: Write Multi-GPU Training Script (`src/train_n14.py`)

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 2.2.1 | Configure `accelerate` for multi-GPU | `accelerate config` → multi-GPU, 4 processes, bf16 mixed precision |
| 2.2.2 | Load base model in 4-bit NF4 | `BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.bfloat16)` |
| 2.2.3 | Apply LoRA adapter | `LoraConfig(r=32, lora_alpha=64, target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"], task_type="CAUSAL_LM")` |
| 2.2.4 | Configure `SFTTrainer` | `TrainingArguments`: `num_train_epochs=3`, `per_device_train_batch_size=2`, `gradient_accumulation_steps=4`, `learning_rate=1.5e-4`, `lr_scheduler_type="cosine"`, `warmup_ratio=0.05`, `bf16=True`, `save_strategy="steps"`, `save_steps=500`, `logging_steps=10`, `max_seq_length=2048`, `optim="paged_adamw_8bit"`, `attn_implementation="sdpa"` |
| 2.2.5 | Add evaluation split | 5% held-out validation set (750 records) for loss monitoring |
| 2.2.6 | Add checkpoint saving | Save at steps 500, 1000, 1500, 2000, 2500, and final (2812) |

#### Hyperparameter Summary:

| Parameter | Value | Rationale |
| :--- | :--- | :--- |
| **LoRA Rank ($r$)** | 32 | 40.3M trainable params (0.52% of model). Prevents catastrophic forgetting while giving strong adaptation. |
| **LoRA Alpha ($\alpha$)** | 64 | Standard 2:1 scaling ratio ($\alpha / r = 2$) for stable gradient flow. |
| **Learning Rate** | 1.5e-4 | Optimal for QLoRA on 7B models per Hugging Face PEFT benchmarks. |
| **LR Scheduler** | Cosine Decay | Smooth annealing prevents sudden loss spikes in final steps. |
| **Warmup Ratio** | 5% | 140 warmup steps prevents early gradient explosions on fresh LoRA weights. |
| **Effective Batch Size** | 32 (2 × 4 GPUs × 4 accum) | Large effective batch for stable convergence across 15K records. |
| **Total Optimizer Steps** | $\frac{15,000 \times 0.95}{32} \times 3 = \mathbf{\sim 1,336}$ steps | 3 complete epochs over 14,250 training records. |
| **Max Sequence Length** | 2048 tokens | Covers 99%+ of code responses without truncation. |
| **Attention** | PyTorch SDPA | Flash Attention 2 equivalent, 40% memory savings. |

> **✅ Done when**: `src/train_n14.py` is a complete, runnable script with all hyperparameters configured. Passes a dry-run syntax check (`python -c "import train_n14"`).

---

### Task 2.3: Execute Training Run

| Sub-Step | Action | Expected Observation |
| :--- | :--- | :--- |
| 2.3.1 | Launch training via `accelerate` | `accelerate launch --num_processes 4 src/train_n14.py` |
| 2.3.2 | Monitor Step 0–100 | Loss should start at `~1.5–2.0` and begin dropping. All 4 GPUs at 90%+ utilization in `nvidia-smi`. |
| 2.3.3 | Monitor Step 100–500 | Loss should reach `~0.3–0.5`. VRAM usage stable at ~18–20 GB per GPU. |
| 2.3.4 | Checkpoint at Step 500 | `models/checkpoint-500/` saved. Validation loss logged. |
| 2.3.5 | Monitor Step 500–1000 | Loss should reach `~0.08–0.15`. |
| 2.3.6 | Checkpoint at Step 1000 | `models/checkpoint-1000/` saved. |
| 2.3.7 | Final convergence (Steps 1000–1336) | Loss should settle at `~0.03–0.06`. Token accuracy > 98.5%. |
| 2.3.8 | Final checkpoint saved | `models/checkpoint-final/` with `adapter_model.safetensors` and `adapter_config.json`. |

> **✅ Done when**: Training completes all 3 epochs (~1,336 steps) without OOM errors. Final loss < 0.06. Final token accuracy > 98.5%. `models/checkpoint-final/adapter_model.safetensors` exists on disk.

---

### Task 2.4: Post-Training Validation

| Sub-Step | Action | Pass Criteria |
| :--- | :--- | :--- |
| 2.4.1 | Run validation loss on held-out 750 records | Validation loss < 0.08 |
| 2.4.2 | Compute perplexity on held-out set | Perplexity < 1.10 |
| 2.4.3 | Generate 5 smoke-test prompts and manually inspect | All 5 outputs must be complete, syntactically valid, with zero placeholders |

**Smoke Test Prompts**:
1. `"hi, tell me about yourself and your features"`
2. `"Build a 3-tier pricing card in React with Tailwind, monthly/annual toggle, and feature checkmarks"`
3. `"Write a Next.js Server Action with Zod validation for user registration"`
4. `"Fix this error: TypeError: Cannot read properties of undefined (reading 'map')"`
5. `"Write a SQL query to find the top 3 highest-paid employees in each department"`

> **✅ Done when**: Validation loss < 0.08, perplexity < 1.10, and all 5 smoke tests produce complete, accurate, human-like responses.

---

---

# PHASE 3: Model Merging, Quantization & Hugging Face Release

**Goal**: Merge the trained LoRA adapter into a standalone FP16 model, create a GGUF quantized version, and publish both to Hugging Face with a professional Model Card.

---

### Task 3.1: Merge LoRA into Standalone FP16 Weights

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 3.1.1 | Load base model in FP16 | `AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-Coder-7B-Instruct", torch_dtype=torch.float16)` |
| 3.1.2 | Load trained LoRA adapter | `PeftModel.from_pretrained(model, "models/checkpoint-final/")` |
| 3.1.3 | Merge weights permanently | `model = model.merge_and_unload()` |
| 3.1.4 | Save merged model locally | `model.save_pretrained("models/n14-merged/")` → Produces 4× `.safetensors` shards (~14.5 GB total) |
| 3.1.5 | Save tokenizer alongside | `tokenizer.save_pretrained("models/n14-merged/")` |

> **✅ Done when**: `models/n14-merged/` contains `model-00001-of-00004.safetensors` through `model-00004-of-00004.safetensors`, `model.safetensors.index.json`, `config.json`, `tokenizer.json`, `tokenizer_config.json`, and `generation_config.json`.

---

### Task 3.2: GGUF Quantization for Offline / Ollama Use

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 3.2.1 | Clone `llama.cpp` on EC2 | `git clone https://github.com/ggerganov/llama.cpp && cd llama.cpp && make -j` |
| 3.2.2 | Convert HF model to GGUF FP16 | `python convert_hf_to_gguf.py ../models/n14-merged/ --outfile n14-f16.gguf --outtype f16` |
| 3.2.3 | Quantize to Q4_K_M (4-bit) | `./llama-quantize n14-f16.gguf n14-q4_k_m.gguf Q4_K_M` → Produces ~4.5 GB file |
| 3.2.4 | Test GGUF locally on EC2 | `./llama-cli -m n14-q4_k_m.gguf -p "Build a React navbar" -n 256` |

> **✅ Done when**: `n14-q4_k_m.gguf` (~4.5 GB) exists, loads without errors, and generates valid code output in the CLI test.

---

### Task 3.3: Publish to Hugging Face Hub

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 3.3.1 | Create HF repo | `huggingface_hub.create_repo("shawaz03/n-14")` |
| 3.3.2 | Upload FP16 merged safetensors | All 4 shards + config + tokenizer files |
| 3.3.3 | Upload GGUF quantized file | `n14-q4_k_m.gguf` |
| 3.3.4 | Upload professional Model Card | `README.md` with badges, benchmarks, 1-Click Colab badge, usage snippets, Ollama `Modelfile` instructions |
| 3.3.5 | Upload Colab quickstart notebook | `n14_quickstart.ipynb` with 4-bit loading and interactive prompt form |

> **✅ Done when**: [https://huggingface.co/shawaz03/n-14](https://huggingface.co/shawaz03/n-14) is live with all files, Model Card renders correctly with badges and code snippets, and the 1-Click Colab badge opens a functional notebook.

---

---

# PHASE 4: FastAPI Streaming Inference API Engine

**Goal**: Deploy an OpenAI-compatible streaming inference backend on the EC2 GPU instance that serves token-by-token SSE responses to any HTTP client.

**Runs on**: Same `g5.12xlarge` EC2 instance (reusing it for inference after training)

---

### Task 4.1: Build FastAPI Server (`src/api_server.py`)

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 4.1.1 | Load merged FP16 model into GPU memory | `AutoModelForCausalLM.from_pretrained("models/n14-merged/", device_map="auto", torch_dtype=torch.bfloat16)` |
| 4.1.2 | Implement `/v1/chat/completions` endpoint | Accept `messages[]`, `temperature`, `top_p`, `max_tokens`, `stream` (bool). Return OpenAI-format JSON or SSE stream. |
| 4.1.3 | Implement `/health` endpoint | Return model status, GPU utilization, and device info |
| 4.1.4 | Add CORS middleware | Allow all origins (`*`) for frontend connection |
| 4.1.5 | Add N-14 System Prompt injection | Auto-prepend the N-14 system directives if no system message is provided |
| 4.1.6 | Add `TextIteratorStreamer` for token streaming | Thread-based generation with `yield` for SSE chunks |

> **✅ Done when**: `curl -X POST http://<EC2_IP>:8000/v1/chat/completions -d '{"messages":[{"role":"user","content":"hi"}], "stream":true}'` returns valid SSE token chunks.

---

### Task 4.2: Production Hardening

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 4.2.1 | Add request validation with Pydantic | Validate all incoming fields, reject malformed requests |
| 4.2.2 | Add generation guardrails | `repetition_penalty=1.05`, `eos_token_id` enforcement, max 3072 tokens hard cap |
| 4.2.3 | Add error handling | Graceful CUDA OOM recovery, timeout handling (75s max generation) |
| 4.2.4 | Run as background service | `nohup uvicorn src.api_server:app --host 0.0.0.0 --port 8000 &` |

> **✅ Done when**: API serves streaming responses reliably for 10 consecutive test prompts with zero crashes.

---

---

# PHASE 5: Next.js Chat Studio & Live Code Sandbox

**Goal**: Build a modern, split-screen web application where users chat with N-14, see real-time streaming code, and test rendered UI components live in a browser sandbox.

**Runs on**: Local machine (HP ProBook) or Vercel deployment

---

### Task 5.1: Initialize Next.js Project

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 5.1.1 | Create Next.js 15 app | `npx create-next-app@latest n14-studio --typescript --tailwind --app --src-dir` |
| 5.1.2 | Install dependencies | `lucide-react`, `zustand`, `@codesandbox/sandpack-react`, `react-markdown`, `react-syntax-highlighter` |
| 5.1.3 | Configure Tailwind dark theme | Dark neutral palette (`bg-neutral-950`, `border-neutral-800`) matching N-14 brand identity |

> **✅ Done when**: `npm run dev` starts without errors, showing a dark-themed blank page at `localhost:3000`.

---

### Task 5.2: Build Chat Interface (Left Panel)

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 5.2.1 | Create Zustand chat store | `useChatStore`: `messages[]`, `isStreaming`, `addMessage()`, `updateLastMessage()`, `clearChat()` |
| 5.2.2 | Build `ChatMessage` component | Renders user/assistant messages with avatar, timestamp, and markdown/code block formatting |
| 5.2.3 | Build `ChatInput` component | Textarea with Shift+Enter for newline, Enter to send, disabled state during streaming |
| 5.2.4 | Implement SSE streaming fetch | `fetch("/api/chat", {method: "POST"})` → `ReadableStream` reader → token-by-token UI update |
| 5.2.5 | Build Next.js API route (`/api/chat`) | Proxies requests to EC2 FastAPI backend, forwards SSE stream to frontend |

> **✅ Done when**: User types a prompt, presses Enter, and sees tokens stream in real-time character by character in the chat panel.

---

### Task 5.3: Build Workspace Dock (Right Panel)

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 5.3.1 | Build tab switcher | 3 tabs: **Preview** / **Code** / **Diff** |
| 5.3.2 | **Code Tab**: Monaco-style syntax viewer | Extracts code blocks from assistant response, displays with syntax highlighting and line numbers |
| 5.3.3 | **Preview Tab**: Sandpack live renderer | Uses `@codesandbox/sandpack-react` to render React + Tailwind code in a sandboxed iframe |
| 5.3.4 | **Diff Tab**: Before/after code comparison | Shows changes between consecutive assistant responses in unified diff format |
| 5.3.5 | Add 1-click copy and download buttons | Copy full code to clipboard, download as `.tsx` file |

> **✅ Done when**: Chat generates a React component → Code tab shows syntax-highlighted source → Preview tab renders the live interactive UI → Copy button works.

---

### Task 5.4: Settings & Configuration Panel

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 5.4.1 | Temperature slider | Range 0.05–1.0, default 0.2 |
| 5.4.2 | Max tokens slider | Range 256–3072, default 2048 |
| 5.4.3 | System prompt selector | Dropdown: "Full-Stack Engineer" / "UI/UX Designer" / "SQL Expert" / "Custom" |
| 5.4.4 | API endpoint configuration | Input field for backend URL (default: EC2 public IP) |

> **✅ Done when**: Changing temperature and max tokens visibly affects generation output. System prompt selector changes the model's behavior.

---

### Task 5.5: Deploy to Vercel (Production)

| Sub-Step | Action | Details |
| :--- | :--- | :--- |
| 5.5.1 | Push to GitHub | `git push origin main` to `shawaz03/n14-studio` |
| 5.5.2 | Connect to Vercel | Import GitHub repo → auto-deploy |
| 5.5.3 | Set environment variable | `N14_API_URL=http://<EC2_PUBLIC_IP>:8000` |
| 5.5.4 | Verify production deployment | Visit `https://n14-studio.vercel.app`, send a prompt, confirm streaming works |

> **✅ Done when**: The Chat Studio is accessible at a public Vercel URL. End-to-end flow works: User prompt → EC2 GPU inference → SSE stream → Live rendered code preview.

---

---

## 📋 Full Execution Timeline

| Phase | Duration | AWS Cost | Deliverable |
| :--- | :--- | :--- | :--- |
| **Phase 1** | ~10 mins | $0 (Local) | `data/n14_golden_15k.jsonl.gz` (audited, 15K records) |
| **Phase 2** | ~45 mins | ~$4.25 | `models/checkpoint-final/adapter_model.safetensors` (converged) |
| **Phase 3** | ~15 mins | $0 (same EC2) | `shawaz03/n-14` live on Hugging Face (FP16 + GGUF + Model Card) |
| **Phase 4** | ~15 mins | $0 (same EC2) | `http://<EC2>:8000/v1/chat/completions` streaming API |
| **Phase 5** | ~30 mins | $0 (Local/Vercel) | `https://n14-studio.vercel.app` live web app |
| **TOTAL** | **~2 hours** | **~$4.25** | **Complete end-to-end AI coding assistant** |

---

## 🛡️ Risk Mitigation

| Risk | Mitigation |
| :--- | :--- |
| CUDA OOM during multi-GPU training | `gradient_checkpointing=True`, `max_seq_length=2048`, `per_device_batch_size=2` |
| Dataset quality regression | Automated 5-point audit gate (Task 1.4) blocks Phase 2 until all checks pass |
| EC2 instance termination mid-training | Checkpoints every 500 steps; training resumes from last checkpoint |
| Model produces placeholder text | Banned pattern scanner in audit + post-training smoke tests |
| AWS credits exhausted | Total cost ~$4.25; leaves $85+ buffer for iterations and inference |
