# 🏠 Complete Real Estate Project

A full-stack real estate application with comprehensive property management, advanced search filters, multi-type property support, and admin panel.

## ✨ **FULLY RESTORED & ENHANCED FEATURES**

### 🎯 **Complete Property Management System**
- ✅ **Add Property Page** - Multi-step form with dynamic fields based on property type
- ✅ **Property Listings** - Beautiful grid layout with advanced filtering
- ✅ **Property Types Support** - Residential, Commercial, Land, PG, Farmhouse, Studio
- ✅ **Image Upload** - Multiple property images with management
- ✅ **Advanced Filters** - City, Price Range, Bedrooms, Furnishing Status
- ✅ **User Authentication** - Complete registration, login, profile management

### 🔥 **Backend Features**
- ✅ **Complete API** - All CRUD operations for properties
- ✅ **Database Migrations** - All tables properly created and seeded
- ✅ **File Upload** - Property images and user documents
- ✅ **Authentication** - JWT-based secure authentication
- ✅ **Property Controller** - Full functionality for all property operations

### 🎨 **Frontend Features**
- ✅ **Modern UI/UX** - Clean, responsive design
- ✅ **Property Listing Page** - Beautiful cards with hover effects
- ✅ **Add Property Form** - Dynamic multi-step form
- ✅ **Admin Panel** - Complete property management interface
- ✅ **Mobile Responsive** - Works perfectly on all devices

## 🏗️ Project Structure

```
real-state-project/
├── backend1/           # Node.js/Express API server
├── packages/
│   ├── main/          # Main React application (Port 3000)
│   └── admin/         # Admin React application (Port 3001)
└── start-all.sh       # Startup script for all applications
```

## 🚀 Quick Start (Mac/Linux)

### 🎯 One-Command Setup (Recommended for Mac)

```bash
# Clone and setup everything automatically
git clone <your-repo-url>
cd real-state-project
chmod +x setup-mac.sh
./setup-mac.sh
```

This script will:
- ✅ Install Homebrew (if not installed)
- ✅ Install Node.js and PostgreSQL
- ✅ Set up all project dependencies
- ✅ Create and migrate database
- ✅ Seed sample data including property listings
- ✅ Configure environment files

### Manual Prerequisites (if needed)

1. **Node.js** (v16 or higher)
   ```bash
   # Install using Homebrew
   brew install node
   ```

2. **PostgreSQL**
   ```bash
   # Install using Homebrew
   brew install postgresql@14
   brew services start postgresql@14
   ```

3. **Git**
   ```bash
   brew install git
   ```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd real-state-project
   ```

2. **Run the automated setup** (Recommended)
   ```bash
   # Make script executable
   chmod +x start-all.sh
   
   # Run setup and start all applications
   ./start-all.sh --setup
   ```

3. **Manual setup** (Alternative)
   ```bash
   # Setup backend
   cd backend1
   npm install
   cp env.example .env
   # Edit .env file with your database credentials
   npm run setup
   
   # Setup main app
   cd ../packages/main
   npm install
   
   # Setup admin app
   cd ../admin
   npm install
   
   # Go back to root and start all
   cd ../../
   ./start-all.sh
   ```

## 🔧 Configuration

### Database Configuration

Update `backend1/.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=real_state
DB_PORT=5432

JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
PORT=5000
```

### PostgreSQL Setup

If you're setting up PostgreSQL for the first time:

```bash
# Start PostgreSQL service
brew services start postgresql@14

# Create a database user (optional)
createuser -s postgres

# Set password for postgres user
psql -U postgres -c "ALTER USER postgres PASSWORD 'your_password';"
```

## 🖥️ Application URLs

- **Backend API**: http://localhost:5000
- **Main Application**: http://localhost:3000
- **Admin Panel**: http://localhost:3001

## 👤 Demo Credentials

```
Email: demo@realstate.com
Password: demo123
```

## 📦 Available Scripts

### Backend (backend1/)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run setup` - Run complete database setup
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Run database seeders
- `npm run db:reset` - Reset database (drop, create, migrate, seed)

### Frontend Applications
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🗄️ Database Management

### Reset Database
```bash
cd backend1
npm run db:reset
```

### Run Migrations Only
```bash
cd backend1
npm run db:migrate
```

### Run Seeders Only
```bash
cd backend1
npm run db:seed
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process on specific port
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Main app
lsof -ti:3001 | xargs kill -9  # Admin app
```

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if not running
brew services start postgresql@14

# Check PostgreSQL status
psql -U postgres -c "SELECT version();"
```

### Permission Issues
```bash
# Make scripts executable
chmod +x start-all.sh
chmod +x backend1/scripts/setup.js
```

### Node Modules Issues
```bash
# Clean install for all packages
rm -rf backend1/node_modules packages/main/node_modules packages/admin/node_modules
cd backend1 && npm install
cd ../packages/main && npm install
cd ../admin && npm install
```

## 🌟 Features

- **Property Listings**: Browse and search properties
- **User Authentication**: Registration, login, JWT-based auth
- **Admin Panel**: Manage properties, users, and categories
- **File Uploads**: Property images and user documents
- **Responsive Design**: Works on desktop and mobile
- **Real-time Data**: Live property updates

## 🛠️ Development

### Project Structure
```
backend1/
├── controllers/     # Route handlers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── migrations/     # Database migrations
├── seeders/        # Database seeders
├── uploads/        # File uploads
└── scripts/        # Utility scripts

packages/main/src/
├── components/     # React components
├── pages/         # Page components
└── styles/        # CSS files

packages/admin/src/
├── components/     # Admin components
├── pages/         # Admin pages
└── utils/         # Utility functions
```

### Adding New Properties
Properties are automatically seeded with sample data. To add more:

1. Edit `backend1/seeders/20250918000000-seed-properties.js`
2. Run `npm run db:seed` in backend1 directory

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property (authenticated)
- `GET /api/categories` - Get categories

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Happy Coding! 🚀**
