#!/bin/bash

# 🚀 LabGuard Pro - Beta Launch Setup Script

echo "🚀 Setting up LabGuard Pro for Beta Launch..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start database services
echo "🗄️ Starting database services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Set up database schema
echo "🗃️ Setting up database schema..."
npm run db:generate
npm run db:push
npm run db:seed

# Create environment file if it doesn't exist
if [ ! -f "apps/web/.env.local" ]; then
    echo "⚙️ Creating environment configuration..."
    cat > apps/web/.env.local << EOF
# LabGuard Pro - Beta Environment
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=labguard-pro-beta-secret-key-2024
API_BASE_URL=http://localhost:3001/api
DATABASE_URL=postgresql://postgres:password@localhost:5432/labguard_pro
OPENAI_API_KEY=your-openai-api-key-here
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
REDIS_URL=redis://localhost:6379
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

# Build the application
echo "🔨 Building application..."
npm run build

echo ""
echo "🎉 Setup complete! LabGuard Pro is ready for beta launch."
echo ""
echo "📋 Next steps:"
echo "1. Start the development servers: npm run dev"
echo "2. Visit http://localhost:3000 to see the landing page"
echo "3. Register a new account or use demo credentials"
echo "4. Explore the dashboard and features"
echo ""
echo "🔑 Demo Account:"
echo "Email: beta@labguardpro.com"
echo "Password: LabGuard2024!"
echo ""
echo "📞 For support, check BETA_LAUNCH_GUIDE.md"
echo "" 