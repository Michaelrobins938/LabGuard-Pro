@echo off
echo 🚀 Starting Vercel deployment for LabGuard Pro Web App...

REM Check if we're in the correct directory
if not exist "package.json" (
    echo ❌ Error: This script must be run from the apps/web directory
    echo Current directory: %CD%
    echo Expected files: package.json, vercel.json
    pause
    exit /b 1
)

if not exist "vercel.json" (
    echo ❌ Error: vercel.json not found
    pause
    exit /b 1
)

REM Verify the project structure
echo 📁 Verifying project structure...
if not exist "src" (
    echo ❌ Error: src directory not found
    pause
    exit /b 1
)

if not exist "src\app" (
    echo ❌ Error: src\app directory not found
    pause
    exit /b 1
)

echo ✅ Project structure verified

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Generate Prisma client
echo 🗄️ Generating Prisma client...
call npx prisma generate

REM Build the project
echo 🔨 Building the project...
call npm run build

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build completed successfully
    echo 🚀 Ready for deployment to Vercel
    echo.
    echo 📋 Next steps:
    echo 1. Make sure your Vercel project is configured with root directory: apps/web
    echo 2. Push your changes to GitHub
    echo 3. Vercel will automatically deploy from the main branch
) else (
    echo ❌ Build failed
    pause
    exit /b 1
)

pause 