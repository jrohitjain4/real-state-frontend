#!/bin/bash

# Real Estate Project - Mac Setup Script
# This script will set up everything needed to run the project on macOS

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🏠 Real Estate Project - Mac Setup${NC}\n"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Homebrew if not exists
install_homebrew() {
    if ! command_exists brew; then
        echo -e "${YELLOW}📦 Installing Homebrew...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for M1/M2 Macs
        if [[ $(uname -m) == 'arm64' ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
    else
        echo -e "${GREEN}✅ Homebrew is already installed${NC}"
    fi
}

# Function to install Node.js
install_node() {
    if ! command_exists node; then
        echo -e "${YELLOW}📦 Installing Node.js...${NC}"
        brew install node
    else
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✅ Node.js is already installed: ${NODE_VERSION}${NC}"
    fi
}

# Function to install PostgreSQL
install_postgresql() {
    if ! command_exists psql; then
        echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"
        brew install postgresql@14
        brew services start postgresql@14
        
        # Create postgres user if it doesn't exist
        createuser -s postgres 2>/dev/null || true
        
        echo -e "${GREEN}✅ PostgreSQL installed and started${NC}"
    else
        echo -e "${GREEN}✅ PostgreSQL is already installed${NC}"
        
        # Start PostgreSQL if not running
        if ! pgrep -x "postgres" > /dev/null; then
            echo -e "${YELLOW}🔄 Starting PostgreSQL...${NC}"
            brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null
        fi
    fi
}

# Function to set up project
setup_project() {
    echo -e "${BLUE}🔧 Setting up project...${NC}"
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
        npm install
    fi
    
    # Setup backend
    echo -e "${YELLOW}🔧 Setting up backend...${NC}"
    cd backend1
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            echo -e "${GREEN}✅ Created .env file from template${NC}"
            echo -e "${YELLOW}⚠️  Please update your database password in .env file${NC}"
        fi
    fi
    
    # Install backend dependencies
    npm install
    
    # Run database setup
    echo -e "${YELLOW}🗄️  Setting up database...${NC}"
    npm run setup
    
    cd ..
    
    # Setup frontend packages
    echo -e "${YELLOW}🔧 Setting up main application...${NC}"
    cd packages/main
    npm install
    cd ../..
    
    echo -e "${YELLOW}🔧 Setting up admin application...${NC}"
    cd packages/admin
    npm install
    cd ../..
    
    echo -e "${GREEN}✅ Project setup completed!${NC}"
}

# Main setup process
main() {
    echo -e "${BLUE}🚀 Starting Mac setup process...${NC}\n"
    
    # Check if running on macOS
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo -e "${RED}❌ This script is designed for macOS only${NC}"
        exit 1
    fi
    
    # Install prerequisites
    install_homebrew
    install_node
    install_postgresql
    
    echo -e "\n${BLUE}📋 Prerequisites installed successfully!${NC}\n"
    
    # Setup project
    setup_project
    
    echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
    echo -e "\n${PURPLE}📋 Next Steps:${NC}"
    echo -e "1. ${YELLOW}Update your database password in backend1/.env${NC}"
    echo -e "2. ${YELLOW}Start all applications: ./start-all.sh${NC}"
    echo -e "3. ${YELLOW}Or start individually:${NC}"
    echo -e "   • Backend: ${BLUE}cd backend1 && npm run dev${NC}"
    echo -e "   • Main App: ${BLUE}cd packages/main && npm start${NC}"
    echo -e "   • Admin App: ${BLUE}cd packages/admin && npm start${NC}"
    
    echo -e "\n${PURPLE}🌐 Application URLs:${NC}"
    echo -e "• Backend API: ${BLUE}http://localhost:5000${NC}"
    echo -e "• Main App: ${BLUE}http://localhost:3000${NC}"
    echo -e "• Admin Panel: ${BLUE}http://localhost:3001${NC}"
    
    echo -e "\n${PURPLE}👤 Demo Credentials:${NC}"
    echo -e "• Email: ${BLUE}demo@realstate.com${NC}"
    echo -e "• Password: ${BLUE}demo123${NC}"
    
    echo -e "\n${GREEN}Happy Coding! 🚀${NC}\n"
}

# Run main function
main "$@"
