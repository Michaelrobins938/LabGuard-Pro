#!/bin/bash

# Vercel Deployment Script for LabGuard Pro Web App
echo "🚀 Starting Vercel deployment for LabGuard Pro Web App..."

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ Error: This script must be run from the apps/web directory"
    echo "Current directory: $(pwd)"
    echo "Expected files: package.json, vercel.json"
    exit 1
fi

# Verify the project structure
echo "📁 Verifying project structure..."
if [ ! -d "src" ]; then
    echo "❌ Error: src directory not found"
    exit 1
fi

if [ ! -d "src/app" ]; then
    echo "❌ Error: src/app directory not found"
    exit 1
fi

echo "✅ Project structure verified"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
    echo "🚀 Ready for deployment to Vercel"
    echo ""
    echo "📋 Next steps:"
    echo "1. Make sure your Vercel project is configured with root directory: apps/web"
    echo "2. Push your changes to GitHub"
    echo "3. Vercel will automatically deploy from the main branch"
else
    echo "❌ Build failed"
    exit 1
fi 