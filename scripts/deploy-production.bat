@echo off
REM 🚀 LabGuard Pro - Production Deployment Script (Windows)
REM This script helps automate the production deployment process

echo 🚀 LabGuard Pro - Production Deployment Script
echo ==============================================
echo.

REM Check prerequisites
echo [INFO] Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ and try again.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm and try again.
    exit /b 1
)

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] git is not installed. Please install git and try again.
    exit /b 1
)

echo [SUCCESS] Prerequisites check passed
echo.

REM Generate production secrets
echo [INFO] Generating production secrets...

REM Generate JWT secret (using PowerShell for better random generation)
for /f "delims=" %%i in ('powershell -command "[System.Web.Security.Membership]::GeneratePassword(32, 0)"') do set JWT_SECRET=%%i
echo JWT_SECRET=%JWT_SECRET% >> .env.production

REM Generate NextAuth secret
for /f "delims=" %%i in ('powershell -command "[System.Web.Security.Membership]::GeneratePassword(32, 0)"') do set NEXTAUTH_SECRET=%%i
echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET% >> .env.production

REM Generate database password
for /f "delims=" %%i in ('powershell -command "[System.Web.Security.Membership]::GeneratePassword(32, 0)"') do set DB_PASSWORD=%%i
echo DB_PASSWORD=%DB_PASSWORD% >> .env.production

echo [SUCCESS] Production secrets generated and saved to .env.production
echo.

REM Setup production environment
echo [INFO] Setting up production environment...

REM Create production environment file
(
echo # LabGuard Pro - Production Environment
echo NODE_ENV=production
echo.
echo # Database Configuration
echo DATABASE_URL=postgresql://labguard_user:%DB_PASSWORD%@your-db-host:5432/labguard_pro
echo.
echo # Authentication
echo NEXTAUTH_URL=https://your-domain.com
echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET%
echo JWT_SECRET=%JWT_SECRET%
echo JWT_EXPIRES_IN=7d
echo.
echo # API Configuration
echo API_BASE_URL=https://your-api-domain.com/api
echo NEXT_PUBLIC_API_URL=https://your-api-domain.com
echo.
echo # AI Services
echo OPENAI_API_KEY=your-production-openai-api-key
echo NEXT_PUBLIC_BIOMNI_API_KEY=your-biomni-api-key
echo NEXT_PUBLIC_BIOMNI_ENVIRONMENT=production
echo.
echo # Payment Processing (Stripe)
echo STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
echo STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
echo STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
echo.
echo # Email Service (SendGrid)
echo SMTP_HOST=smtp.sendgrid.net
echo SMTP_PORT=587
echo SMTP_USER=apikey
echo SMTP_PASS=your-sendgrid-api-key
echo SMTP_FROM=noreply@yourdomain.com
echo.
echo # SMS Service (Twilio)
echo TWILIO_ACCOUNT_SID=your-twilio-account-sid
echo TWILIO_AUTH_TOKEN=your-twilio-auth-token
echo TWILIO_PHONE_NUMBER=+1234567890
echo.
echo # Redis (for caching and sessions)
echo REDIS_URL=redis://your-redis-host:6379
echo.
echo # Security
echo CORS_ORIGIN=https://your-domain.com
echo RATE_LIMIT_WINDOW_MS=900000
echo RATE_LIMIT_MAX_REQUESTS=100
echo.
echo # Monitoring
echo SENTRY_DSN=your-sentry-dsn
echo LOG_LEVEL=info
echo.
echo # Feature Flags
echo ENABLE_AI_COMPLIANCE=true
echo ENABLE_BIOMNI_INTEGRATION=true
echo ENABLE_SMS_NOTIFICATIONS=true
echo ENABLE_EMAIL_NOTIFICATIONS=true
) > .env.production

echo [SUCCESS] Production environment file created
echo [WARNING] Please update .env.production with your actual production values
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm ci --production=false
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [SUCCESS] Dependencies installed
echo.

REM Build applications
echo [INFO] Building applications...

echo [INFO] Building backend API...
call npm run build:backend
if errorlevel 1 (
    echo [ERROR] Failed to build backend
    exit /b 1
)

echo [INFO] Building frontend...
call npm run build:frontend
if errorlevel 1 (
    echo [ERROR] Failed to build frontend
    exit /b 1
)

echo [SUCCESS] Applications built successfully
echo.

REM Run tests
echo [INFO] Running tests...
call npm run test
if errorlevel 1 (
    echo [ERROR] Tests failed
    exit /b 1
)
echo [SUCCESS] Tests passed
echo.

REM Security audit
echo [INFO] Running security audit...
call npm audit --audit-level moderate
echo [SUCCESS] Security audit completed
echo.

REM Database setup
echo [INFO] Setting up database...
call npm run db:generate
if errorlevel 1 (
    echo [ERROR] Failed to generate database client
    exit /b 1
)
echo [SUCCESS] Database setup completed
echo [WARNING] Remember to run migrations on your production database
echo.

REM Show deployment instructions
echo.
echo 🎯 NEXT STEPS FOR PRODUCTION DEPLOYMENT:
echo ========================================
echo.
echo 1. 📊 SET UP PRODUCTION DATABASE:
echo    - Create a PostgreSQL database on Railway, Supabase, or AWS RDS
echo    - Update DATABASE_URL in .env.production
echo    - Run: npm run db:push
echo.
echo 2. 🚀 DEPLOY BACKEND API:
echo    - Connect your GitHub repo to Railway/Heroku
echo    - Set environment variables from .env.production
echo    - Deploy the apps/api directory
echo.
echo 3. 🌐 DEPLOY FRONTEND:
echo    - Connect your GitHub repo to Vercel
echo    - Set environment variables from .env.production
echo    - Deploy the apps/web directory
echo.
echo 4. 🔐 CONFIGURE SERVICES:
echo    - Set up Stripe production account
echo    - Configure SendGrid for emails
echo    - Set up Twilio for SMS
echo    - Configure domain and SSL
echo.
echo 5. 📈 SET UP MONITORING:
echo    - Configure Sentry for error tracking
echo    - Set up Google Analytics
echo    - Configure uptime monitoring
echo.
echo 📋 For detailed instructions, see: PRODUCTION_DEPLOYMENT_GUIDE.md
echo.

echo.
echo [SUCCESS] Production deployment preparation completed!
echo.
echo [WARNING] IMPORTANT: Update .env.production with your actual production values before deploying
echo.

pause 