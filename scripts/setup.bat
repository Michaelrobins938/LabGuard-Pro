@echo off
echo 🚀 Setting up LabGuard Pro Web Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local from template...
    copy env.local.example .env.local
    echo ⚠️  Please update .env.local with your configuration before continuing
    echo    Required variables:
    echo    - DATABASE_URL
    echo    - NEXTAUTH_SECRET
    echo    - SMTP configuration (for email functionality)
    pause
    exit /b 0
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run db:generate

REM Push database schema
echo 🗄️  Setting up database...
npm run db:push

REM Seed database
echo 🌱 Seeding database...
npm run db:seed

echo ✅ Setup complete!
echo.
echo 🎉 LabGuard Pro is ready to use!
echo.
echo Next steps:
echo 1. Update .env.local with your configuration
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo For production deployment, see README.md for detailed instructions.
pause 