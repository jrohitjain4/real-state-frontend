#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Real Estate Project...${NC}\n"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}⚠️  Port $1 is in use. Killing existing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Starting PostgreSQL...${NC}"
    if command -v brew &> /dev/null; then
        brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null
    else
        sudo systemctl start postgresql 2>/dev/null || sudo service postgresql start 2>/dev/null
    fi
    sleep 3
fi

# Kill existing processes on required ports
kill_port 5000  # Backend
kill_port 3000  # Main app
kill_port 3001  # Admin app

echo -e "${GREEN}✅ Ports cleared${NC}\n"

# Start backend
echo -e "${BLUE}📦 Starting Backend Server...${NC}"
cd backend1
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${YELLOW}⚠️  Created .env file from template. Please update your database credentials.${NC}"
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

# Run setup if needed
if [ "$1" = "--setup" ]; then
    echo -e "${YELLOW}🔧 Running database setup...${NC}"
    npm run setup
fi

npm run dev &
BACKEND_PID=$!
cd ..

sleep 5

# Start main application
echo -e "${BLUE}🌐 Starting Main Application...${NC}"
cd packages/main
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing main app dependencies...${NC}"
    npm install
fi
npm start &
MAIN_PID=$!
cd ../..

sleep 3

# Start admin application
echo -e "${BLUE}⚙️  Starting Admin Application...${NC}"
cd packages/admin
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing admin app dependencies...${NC}"
    npm install
fi
npm start &
ADMIN_PID=$!
cd ../..

echo -e "\n${GREEN}🎉 All applications started successfully!${NC}"
echo -e "${GREEN}📋 Application URLs:${NC}"
echo -e "   🔧 Backend API: ${BLUE}http://localhost:5000${NC}"
echo -e "   🌐 Main App: ${BLUE}http://localhost:3000${NC}"
echo -e "   ⚙️  Admin App: ${BLUE}http://localhost:3001${NC}"
echo -e "\n${YELLOW}📝 Demo Credentials:${NC}"
echo -e "   📧 Email: demo@realstate.com"
echo -e "   🔑 Password: demo123"
echo -e "\n${RED}Press Ctrl+C to stop all servers${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all servers...${NC}"
    kill $BACKEND_PID $MAIN_PID $ADMIN_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for all processes
wait
