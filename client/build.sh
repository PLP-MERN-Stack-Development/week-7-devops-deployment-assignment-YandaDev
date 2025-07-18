#!/bin/bash

# build.sh - Production build script for TechTalkZA

echo "🚀 Starting TechTalkZA Production Build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    exit 1
fi

# Set production environment
export NODE_ENV=production

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔍 Running linting..."
pnpm run lint

echo "🏗️ Building application..."
pnpm run build

echo "📊 Analyzing bundle size..."
if [ -d "dist" ]; then
    echo "Build output:"
    ls -la dist/
    echo "Bundle sizes:"
    find dist -name "*.js" -o -name "*.css" | xargs ls -lh
fi

echo "✅ Build completed successfully!"
echo "🌐 You can preview the build with: pnpm run preview"
