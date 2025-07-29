#!/bin/bash

# 🚀 LabGuard Pro - Production Deployment Script
# This script helps automate the production deployment process

set -e  # Exit on any error

echo "🚀 LabGuard Pro - Production Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git and try again."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Generate production secrets
generate_secrets() {
    print_status "Generating production secrets..."
    
    # Generate JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET=$JWT_SECRET" >> .env.production
    
    # Generate NextAuth secret
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.production
    
    # Generate database password
    DB_PASSWORD=$(openssl rand -base64 32)
    echo "DB_PASSWORD=$DB_PASSWORD" >> .env.production
    
    print_success "Production secrets generated and saved to .env.production"
}

# Setup production environment
setup_production_env() {
    print_status "Setting up production environment..."
    
    # Create production environment file
    cat > .env.production << EOF
# LabGuard Pro - Production Environment
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://labguard_user:${DB_PASSWORD}@your-db-host:5432/labguard_pro

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# API Configuration
API_BASE_URL=https://your-api-domain.com/api
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# AI Services
OPENAI_API_KEY=your-production-openai-api-key
NEXT_PUBLIC_BIOMNI_API_KEY=your-biomni-api-key
NEXT_PUBLIC_BIOMNI_ENVIRONMENT=production

# Payment Processing (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Service (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Redis (for caching and sessions)
REDIS_URL=redis://your-redis-host:6379

# Security
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Feature Flags
ENABLE_AI_COMPLIANCE=true
ENABLE_BIOMNI_INTEGRATION=true
ENABLE_SMS_NOTIFICATIONS=true
ENABLE_EMAIL_NOTIFICATIONS=true
EOF

    print_success "Production environment file created"
    print_warning "Please update .env.production with your actual production values"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    npm ci --production=false
    
    print_success "Dependencies installed"
}

# Build applications
build_applications() {
    print_status "Building applications..."
    
    # Build backend
    print_status "Building backend API..."
    npm run build:backend
    
    # Build frontend
    print_status "Building frontend..."
    npm run build:frontend
    
    print_success "Applications built successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    npm run test
    
    print_success "Tests passed"
}

# Security audit
security_audit() {
    print_status "Running security audit..."
    
    npm audit --audit-level moderate
    
    print_success "Security audit completed"
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    # Generate Prisma client
    npm run db:generate
    
    print_success "Database setup completed"
    print_warning "Remember to run migrations on your production database"
}

# Deployment instructions
show_deployment_instructions() {
    echo ""
    echo "🎯 NEXT STEPS FOR PRODUCTION DEPLOYMENT:"
    echo "========================================"
    echo ""
    echo "1. 📊 SET UP PRODUCTION DATABASE:"
    echo "   - Create a PostgreSQL database on Railway, Supabase, or AWS RDS"
    echo "   - Update DATABASE_URL in .env.production"
    echo "   - Run: npm run db:push"
    echo ""
    echo "2. 🚀 DEPLOY BACKEND API:"
    echo "   - Connect your GitHub repo to Railway/Heroku"
    echo "   - Set environment variables from .env.production"
    echo "   - Deploy the apps/api directory"
    echo ""
    echo "3. 🌐 DEPLOY FRONTEND:"
    echo "   - Connect your GitHub repo to Vercel"
    echo "   - Set environment variables from .env.production"
    echo "   - Deploy the apps/web directory"
    echo ""
    echo "4. 🔐 CONFIGURE SERVICES:"
    echo "   - Set up Stripe production account"
    echo "   - Configure SendGrid for emails"
    echo "   - Set up Twilio for SMS"
    echo "   - Configure domain and SSL"
    echo ""
    echo "5. 📈 SET UP MONITORING:"
    echo "   - Configure Sentry for error tracking"
    echo "   - Set up Google Analytics"
    echo "   - Configure uptime monitoring"
    echo ""
    echo "📋 For detailed instructions, see: PRODUCTION_DEPLOYMENT_GUIDE.md"
    echo ""
}

# Main execution
main() {
    echo "Starting LabGuard Pro production deployment..."
    echo ""
    
    check_prerequisites
    generate_secrets
    setup_production_env
    install_dependencies
    build_applications
    run_tests
    security_audit
    setup_database
    show_deployment_instructions
    
    echo ""
    print_success "Production deployment preparation completed!"
    echo ""
    print_warning "IMPORTANT: Update .env.production with your actual production values before deploying"
    echo ""
}

# Run main function
main "$@" 