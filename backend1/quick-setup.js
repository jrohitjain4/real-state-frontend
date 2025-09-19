// Quick setup script for development
const { execSync } = require('child_process');

console.log('🚀 Setting up backend...\n');

try {
    // Start the server
    console.log('📦 Starting backend server...');
    execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Setup failed:', error.message);
}
