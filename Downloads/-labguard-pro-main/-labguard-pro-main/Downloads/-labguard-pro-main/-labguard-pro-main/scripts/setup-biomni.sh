#!/bin/bash

echo "========================================"
echo "LabGuard Pro - Stanford Biomni Setup"
echo "========================================"
echo

echo "Checking prerequisites..."

# Check if conda is installed
if ! command -v conda &> /dev/null; then
    echo "ERROR: Conda is not installed!"
    echo "Please install Anaconda or Miniconda first:"
    echo "https://docs.conda.io/en/latest/miniconda.html"
    exit 1
fi

echo "✓ Conda is installed"

# Check if Biomni repository exists
if [ ! -d "Biomni" ]; then
    echo "ERROR: Biomni repository not found!"
    echo "Please run: git clone https://github.com/snap-stanford/Biomni.git"
    exit 1
fi

echo "✓ Biomni repository found"

echo
echo "Setting up Stanford Biomni environment..."

# Create conda environment
echo "Creating conda environment 'biomni_e1'..."
conda create -n biomni_e1 python=3.11 -y
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create conda environment"
    exit 1
fi

# Install official Biomni
echo "Installing official Stanford Biomni..."
conda run -n biomni_e1 pip install git+https://github.com/snap-stanford/Biomni.git@main
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Biomni"
    exit 1
fi

# Create data directory
mkdir -p data

# Test Biomni installation
echo "Testing Biomni installation..."
conda run -n biomni_e1 python -c "from biomni.agent import A1; print('Biomni imported successfully')"
if [ $? -ne 0 ]; then
    echo "WARNING: Biomni import test failed, but setup may still work"
fi

echo
echo "========================================"
echo "Setup completed!"
echo "========================================"
echo
echo "To use official Stanford Biomni:"
echo "1. Set environment variable: export USE_OFFICIAL_BIOMNI=true"
echo "2. Set environment variable: export BIOMNI_CONDA_ENV=biomni_e1"
echo "3. Restart your application"
echo
echo "To activate the environment manually:"
echo "conda activate biomni_e1"
echo 