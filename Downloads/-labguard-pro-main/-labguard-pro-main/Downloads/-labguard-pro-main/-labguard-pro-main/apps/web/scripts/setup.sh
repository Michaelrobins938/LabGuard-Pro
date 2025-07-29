#!/bin/bash

echo "🚀 Setting up LabGuard Pro Web Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.local.example .env.local
    echo "⚠️  Please update .env.local with your configuration before continuing"
    echo "   Required variables:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - SMTP configuration (for email functionality)"
    exit 0
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️  Setting up database..."
npm run db:push

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Setup complete!"
echo ""
echo "🎉 LabGuard Pro is ready to use!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For production deployment, see README.md for detailed instructions." 