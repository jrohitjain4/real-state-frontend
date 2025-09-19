#!/bin/bash

# Complete Real Estate Project Startup Script
echo "🏠 Starting Complete Real Estate Project..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill processes on ports
kill_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $1 is in use. Killing existing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Kill existing processes
kill_port 5000  # Backend
kill_port 3000  # Main app
kill_port 3001  # Admin app

echo -e "${GREEN}✅ Ports cleared${NC}\n"

# Start backend
echo -e "${BLUE}📦 Starting Backend Server (Port 5000)...${NC}"
cd backend1
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${YELLOW}⚠️  Created .env file. Please update database credentials if needed.${NC}"
    fi
fi
npm run dev &
BACKEND_PID=$!
cd ..

sleep 5

# Start main application
echo -e "${BLUE}🌐 Starting Main Application (Port 3000)...${NC}"
cd packages/main
npm start &
MAIN_PID=$!
cd ../..

sleep 3

# Start admin application
echo -e "${BLUE}⚙️  Starting Admin Application (Port 3001)...${NC}"
cd packages/admin
npm start &
ADMIN_PID=$!
cd ../..

echo -e "\n${GREEN}🎉 All applications started successfully!${NC}"
echo -e "${GREEN}📋 Application URLs:${NC}"
echo -e "   🔧 Backend API: ${BLUE}http://localhost:5000${NC}"
echo -e "   🌐 Main App: ${BLUE}http://localhost:3000${NC}"
echo -e "   ⚙️  Admin App: ${BLUE}http://localhost:3001${NC}"
echo -e "\n${GREEN}🏠 Real Estate Features Available:${NC}"
echo -e "   ✅ Property Listings with Advanced Filters"
echo -e "   ✅ Add Property with Multiple Types (Residential/Commercial/Land)"
echo -e "   ✅ Image Upload for Properties"
echo -e "   ✅ User Authentication & Profile Management"
echo -e "   ✅ Admin Panel for Property Management"
echo -e "   ✅ Responsive Design for Mobile & Desktop"
echo -e "\n${YELLOW}📝 Test the Complete Flow:${NC}"
echo -e "   1. Visit Main App: http://localhost:3000"
echo -e "   2. Go to Properties page to see listings"
echo -e "   3. Register/Login to add new properties"
echo -e "   4. Use Add Property page for full property creation"
echo -e "   5. Check Admin panel for property management"
echo -e "\n${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

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
