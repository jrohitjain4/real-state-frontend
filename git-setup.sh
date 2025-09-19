#!/bin/bash

# Real Estate Project - Git Setup Script
echo "🚀 Setting up Git repository for Real Estate Project..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Add all files
echo "📁 Adding all project files..."
git add .

# Create comprehensive commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Complete Real Estate Project

Features:
✅ Backend API with Node.js/Express/PostgreSQL
✅ Property listings with filters and search
✅ User authentication and authorization
✅ File upload for property images
✅ Admin panel with React/Material-UI
✅ Main application with property browsing
✅ Database migrations and seeders
✅ Mac compatibility and setup scripts
✅ Cross-platform startup scripts
✅ Comprehensive documentation

Tech Stack:
- Backend: Node.js, Express, PostgreSQL, Sequelize
- Frontend: React, Material-UI, React Router
- Database: PostgreSQL with migrations
- Authentication: JWT
- File Upload: Multer
- Development: Nodemon, Cross-env

Project Structure:
- backend1/: API server with controllers, models, routes
- packages/main/: Main React application
- packages/admin/: Admin panel
- migrations/: Database schema migrations  
- seeders/: Sample data including properties
- scripts/: Setup and utility scripts"

echo "✅ Git repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create repository on GitHub/GitLab"
echo "2. Add remote: git remote add origin YOUR_REPO_URL"
echo "3. Push: git push -u origin main"
echo ""
echo "🌐 Example GitHub setup:"
echo "git remote add origin https://github.com/YOUR_USERNAME/real-estate-project.git"
echo "git push -u origin main"
