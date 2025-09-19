#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Real Estate Project Setup...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file from template...');
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ .env file created! Please update your database credentials.\n');
        console.log('⚠️  IMPORTANT: Update the following in your .env file:');
        console.log('   - DB_PASSWORD: Your PostgreSQL password');
        console.log('   - JWT_SECRET: A secure random string');
        console.log('   - Other configuration as needed\n');
    } else {
        console.log('❌ env.example file not found. Please create .env manually.\n');
        process.exit(1);
    }
}

// Function to run command with proper error handling
function runCommand(command, description) {
    try {
        console.log(`📦 ${description}...`);
        execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        console.log(`✅ ${description} completed!\n`);
    } catch (error) {
        console.log(`❌ ${description} failed:`, error.message);
        return false;
    }
    return true;
}

// Check if PostgreSQL is running
function checkPostgreSQL() {
    try {
        execSync('psql --version', { stdio: 'pipe' });
        return true;
    } catch (error) {
        console.log('❌ PostgreSQL is not installed or not in PATH');
        console.log('📋 Please install PostgreSQL:');
        console.log('   macOS: brew install postgresql');
        console.log('   Ubuntu: sudo apt-get install postgresql');
        console.log('   Windows: Download from https://www.postgresql.org/download/');
        return false;
    }
}

// Main setup process
async function setup() {
    // Check PostgreSQL
    if (!checkPostgreSQL()) {
        process.exit(1);
    }

    // Install dependencies
    if (!runCommand('npm install', 'Installing dependencies')) {
        process.exit(1);
    }

    // Database setup
    console.log('🗄️  Setting up database...\n');
    
    // Try to create database (will fail if already exists, which is fine)
    try {
        execSync('npx sequelize-cli db:create', { stdio: 'pipe', cwd: path.join(__dirname, '..') });
        console.log('✅ Database created successfully!');
    } catch (error) {
        console.log('ℹ️  Database already exists or creation failed - continuing...');
    }

    // Run migrations
    if (!runCommand('npx sequelize-cli db:migrate', 'Running database migrations')) {
        process.exit(1);
    }

    // Run seeders
    if (!runCommand('npx sequelize-cli db:seed:all', 'Running database seeders')) {
        process.exit(1);
    }

    // Create upload directories
    const uploadDirs = ['uploads', 'uploads/properties', 'uploads/profiles', 'uploads/kyc'];
    uploadDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        }
    });

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Update your .env file with correct database credentials');
    console.log('   2. Start the backend server: npm run dev');
    console.log('   3. Start the frontend applications from their respective directories');
    console.log('\n📝 Demo credentials:');
    console.log('   Email: demo@realstate.com');
    console.log('   Password: demo123');
    console.log('\n🔗 Default URLs:');
    console.log('   Backend API: http://localhost:5000');
    console.log('   Main App: http://localhost:3000');
    console.log('   Admin App: http://localhost:3001');
}

// Run setup
setup().catch(error => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
});
