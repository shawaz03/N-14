#!/usr/bin/env bash
# ==============================================================================
# N-14 AWS EC2 BOOTSTRAP & CLOUD PROVISIONING SCRIPT (Task 2.1.3)
# Target: AWS EC2 g5.12xlarge (4x NVIDIA A10G, 96 GB VRAM, Ubuntu 22.04)
# ==============================================================================

set -euo pipefail

echo "================================================================================"
echo "          N-14 DISTRIBUTED 4xA10G ENVIRONMENT PROVISIONING"
echo "================================================================================"

# 1. System Packages Update
echo -e "\n[1/7] Updating system packages and installing tools..."
sudo apt-get update -y
sudo apt-get install -y build-essential git curl htop nvtop unzip jq python3-pip python3-venv

# 2. Verify NVIDIA GPU Architecture
echo -e "\n[2/7] Checking NVIDIA GPUs..."
if ! command -v nvidia-smi &> /dev/null; then
    echo "ERROR: nvidia-smi not found. Ensure NVIDIA drivers are installed."
    exit 1
fi

GPU_COUNT=$(nvidia-smi --query-gpu=count --format=csv,noheader | head -n 1)
echo "Detected GPUs: ${GPU_COUNT}"
nvidia-smi

if [ "${GPU_COUNT}" -lt 4 ]; then
    echo "WARNING: Less than 4 GPUs detected (${GPU_COUNT}). For production 4xA10G training, use g5.12xlarge."
fi

# 3. Create and activate Python virtual environment
echo -e "\n[3/7] Setting up Python virtual environment..."
VENV_PATH="${HOME}/n14_venv"
if [ ! -d "${VENV_PATH}" ]; then
    python3 -m venv "${VENV_PATH}"
fi
source "${VENV_PATH}/bin/activate"
pip install --upgrade pip setuptools wheel

# 4. Install exact production ML dependencies
echo -e "\n[4/7] Installing pinned ML dependencies..."
pip install -r requirements.txt
pip install flash-attn --no-build-isolation || echo "Notice: Flash-Attention fallback to PyTorch SDPA (native in PyTorch 2.5)"

# 5. Configure Accelerate Default Profile
echo -e "\n[5/7] Configuring Hugging Face Accelerate..."
mkdir -p "${HOME}/.cache/huggingface/accelerate"
cp configs/accelerate_config.yaml "${HOME}/.cache/huggingface/accelerate/default_config.yaml"
echo "Accelerate config copied to ~/.cache/huggingface/accelerate/default_config.yaml"

# 6. Verify PyTorch 2.5 CUDA & SDPA Support
echo -e "\n[6/7] Verifying PyTorch CUDA & SDPA..."
python3 -c "
import torch
print('PyTorch Version:', torch.__version__)
print('CUDA Available:', torch.cuda.is_available())
print('Device Count:', torch.cuda.device_count())
if torch.cuda.is_available():
    for i in range(torch.cuda.device_count()):
        print(f'  GPU {i}: {torch.cuda.get_device_name(i)} ({torch.cuda.get_device_properties(i).total_memory / (1024**3):.1f} GB)')
    print('bfloat16 supported:', torch.cuda.is_bf16_supported())
"

# 7. Verify Dataset and Audit Status
echo -e "\n[7/7] Verifying Golden Dataset on disk..."
if [ -f "data/n14_golden_15k.jsonl.gz" ] && [ -f "data/PHASE_1_AUDIT_PASSED.txt" ]; then
    echo "SUCCESS: Master dataset and Phase 1 Audit signoff verified."
    ls -lh data/n14_golden_15k.jsonl.gz
else
    echo "WARNING: Dataset or audit file missing. Run 'python src/build_golden_dataset.py' to generate."
fi

echo -e "\n================================================================================"
echo "          N-14 EC2 ENVIRONMENT SETUP COMPLETED SUCCESSFULLY"
echo "================================================================================"
