#!/bin/bash

echo "🚀 BLACK BLADE BOT - QUICK DEPLOYMENT"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Not a git repository. Please run 'git init' first."
    exit 1
fi

echo "📊 Git Status:"
git status --short

echo ""
echo "📝 Committing changes..."
git add .
git commit -m "feat: Plugin engine rebuild with ESM format

- Permanent plugin auto-loader in index.js
- Fixed settings.js syntax
- All 9 plugins in ESM format
- Proper data persistence with helpers
- Ready for production deployment"

echo ""
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ DEPLOYMENT STARTED!"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for Render to auto-deploy"
echo "2. Check logs at: https://dashboard.render.com"
echo "3. Test bot: .menu"
echo ""
