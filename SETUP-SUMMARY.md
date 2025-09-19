# 🏠 Real Estate Project - Mac Setup Summary

## ✅ What's Been Configured

### 🔧 Mac Compatibility
- ✅ Fixed case-sensitive file naming issues (removed double .js.js extensions)
- ✅ Created cross-platform startup scripts
- ✅ Added proper Sequelize configuration for Mac
- ✅ Environment variable templates created

### 📦 Package Management
- ✅ Updated all package.json files with proper scripts
- ✅ Added root-level package.json for managing all packages
- ✅ Cross-platform dependency management

### 🗄️ Database Setup
- ✅ Comprehensive property seeder with 8 sample listings
- ✅ Automated migration and seeder scripts
- ✅ Database configuration for PostgreSQL
- ✅ Demo user creation with credentials

### 🚀 Automation Scripts
- ✅ `setup-mac.sh` - Complete Mac setup automation
- ✅ `start-all.sh` - Start all applications at once
- ✅ `scripts/setup.js` - Database setup automation
- ✅ Root-level npm scripts for easy management

## 🎯 Quick Start Commands

### For Mac Users (Recommended)
```bash
git clone <your-repo-url>
cd real-state-project
chmod +x setup-mac.sh
./setup-mac.sh
```

### Start All Applications
```bash
./start-all.sh
```

### Individual Commands
```bash
# Backend only
cd backend1 && npm run dev

# Main app only  
cd packages/main && npm start

# Admin app only
cd packages/admin && npm start
```

## 📋 Sample Data Included

### Properties (8 listings)
1. **Luxury 2BHK Apartment** - Mumbai (₹85 Lakh)
2. **4BHK Villa with Garden** - Bandra West (₹2.5 Cr)
3. **Modern 3BHK House** - Andheri East (₹1.5 Cr)
4. **Premium Office Space** - Nariman Point (₹45K/sqft)
5. **Retail Shop in Mall** - Borivali West (₹1.2 Cr)
6. **Residential Plot** - Thane West (₹1.8 Cr)
7. **1BHK Rental Apartment** - Powai (₹25K/month)
8. **3BHK Sea View Apartment** - Marine Drive (₹1.2 Cr)

### Demo User
- **Email**: demo@realstate.com
- **Password**: demo123

## 🌐 Application URLs
- **Backend API**: http://localhost:5000
- **Main Application**: http://localhost:3000  
- **Admin Panel**: http://localhost:3001

## 📁 Key Files Created/Modified

### New Files
- `env.example` - Environment template
- `config/database.js` - Sequelize config
- `.sequelizerc` - Sequelize CLI config
- `scripts/setup.js` - Database setup automation
- `seeders/20250918000000-seed-properties.js` - Property listings
- `setup-mac.sh` - Mac setup script
- `start-all.sh` - Application startup script
- `package.json` (root) - Monorepo management
- `.gitignore` - Version control exclusions
- `README.md` - Comprehensive documentation

### Modified Files
- `backend1/package.json` - Added database scripts
- Migration files - Fixed double .js.js extensions

## 🛠️ Available Scripts

### Root Level
```bash
npm run setup          # Complete project setup
npm run dev            # Start all applications
npm run install:all    # Install all dependencies
npm run build          # Build all applications
```

### Backend (backend1/)
```bash
npm run dev            # Start with nodemon
npm run setup          # Database setup
npm run db:migrate     # Run migrations
npm run db:seed        # Run seeders
npm run db:reset       # Complete database reset
```

## 🔍 Troubleshooting

### Common Issues
1. **Port conflicts**: Use `lsof -ti:PORT | xargs kill -9`
2. **PostgreSQL not running**: `brew services start postgresql@14`
3. **Permission issues**: `chmod +x script-name.sh`
4. **Node modules**: Delete and `npm install` again

### Database Issues
```bash
# Reset everything
cd backend1
npm run db:reset

# Or step by step
npx sequelize-cli db:drop
npx sequelize-cli db:create  
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## 🎉 Ready to Go!

Your real estate project is now fully configured for Mac development. Simply run:

```bash
git pull origin main
./setup-mac.sh  # First time only
./start-all.sh  # Every time you want to start
```

Happy coding! 🚀
