@echo off
echo ========================================
echo LabGuard Pro - Stanford Biomni Setup
echo ========================================
echo.

echo Checking prerequisites...

REM Check if conda is installed
conda --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Conda is not installed!
    echo Please install Anaconda or Miniconda first:
    echo https://docs.conda.io/en/latest/miniconda.html
    pause
    exit /b 1
)

echo ✓ Conda is installed

REM Check if Biomni repository exists
if not exist "Biomni" (
    echo ERROR: Biomni repository not found!
    echo Please run: git clone https://github.com/snap-stanford/Biomni.git
    pause
    exit /b 1
)

echo ✓ Biomni repository found

echo.
echo Setting up Stanford Biomni environment...

REM Create conda environment
echo Creating conda environment 'biomni_e1'...
conda create -n biomni_e1 python=3.11 -y
if %errorlevel% neq 0 (
    echo ERROR: Failed to create conda environment
    pause
    exit /b 1
)

REM Install official Biomni
echo Installing official Stanford Biomni...
conda run -n biomni_e1 pip install git+https://github.com/snap-stanford/Biomni.git@main
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Biomni
    pause
    exit /b 1
)

REM Create data directory
if not exist "data" mkdir data

REM Test Biomni installation
echo Testing Biomni installation...
conda run -n biomni_e1 python -c "from biomni.agent import A1; print('Biomni imported successfully')"
if %errorlevel% neq 0 (
    echo WARNING: Biomni import test failed, but setup may still work
)

echo.
echo ========================================
echo Setup completed!
echo ========================================
echo.
echo To use official Stanford Biomni:
echo 1. Set environment variable: USE_OFFICIAL_BIOMNI=true
echo 2. Set environment variable: BIOMNI_CONDA_ENV=biomni_e1
echo 3. Restart your application
echo.
echo To activate the environment manually:
echo conda activate biomni_e1
echo.
pause 