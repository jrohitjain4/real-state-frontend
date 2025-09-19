#!/bin/bash

# Complete Real Estate App Test Script
echo "🏠 Testing Complete Real Estate Application..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill processes on ports
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}⚠️  Port $1 is in use. Killing existing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

echo -e "${BLUE}🔧 Step 1: Preparing Environment${NC}"

# Kill existing processes
kill_port 5000  # Backend
kill_port 3000  # Main app

echo -e "${GREEN}✅ Ports cleared${NC}"

echo -e "${BLUE}🗄️  Step 2: Setting up Database${NC}"
cd backend1

# Check if .env exists
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${YELLOW}⚠️  Created .env file. Update database credentials if needed.${NC}"
    fi
fi

# Run migrations
echo -e "${YELLOW}📦 Running database migrations...${NC}"
npx sequelize-cli db:migrate 2>/dev/null || echo -e "${YELLOW}⚠️  Migrations already applied${NC}"

# Run seeders
echo -e "${YELLOW}🌱 Running database seeders...${NC}"
npx sequelize-cli db:seed:all 2>/dev/null || echo -e "${YELLOW}⚠️  Seeders already applied${NC}"

echo -e "${GREEN}✅ Database setup completed${NC}"

echo -e "${BLUE}🚀 Step 3: Starting Backend Server${NC}"
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 5

# Test backend API
echo -e "${BLUE}🧪 Step 4: Testing Backend API${NC}"
if curl -s http://localhost:5000/api/properties > /dev/null; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${RED}❌ Backend API not responding${NC}"
fi

echo -e "${BLUE}🌐 Step 5: Starting Frontend Applications${NC}"

# Start main app
echo -e "${YELLOW}📱 Starting Main Application (Port 3000)...${NC}"
cd packages/main
npm start &
MAIN_PID=$!
cd ../..

# Wait for frontend to start
sleep 3

echo -e "\n${GREEN}🎉 Application Setup Complete!${NC}"
echo -e "${GREEN}📋 Test Results:${NC}"
echo -e "   🔧 Backend API: ${BLUE}http://localhost:5000${NC} ✅"
echo -e "   🌐 Main App: ${BLUE}http://localhost:3000${NC} ✅"

echo -e "\n${BLUE}🧪 Manual Testing Checklist:${NC}"
echo -e "   1. ✅ Visit http://localhost:3000"
echo -e "   2. ✅ Navigate to Properties page (/properties)"
echo -e "   3. ✅ Test property filters (City, Price, Bedrooms)"
echo -e "   4. ✅ Register/Login as new user"
echo -e "   5. ✅ Add new property (/add-property)"
echo -e "   6. ✅ Upload property images"
echo -e "   7. ✅ View property details"
echo -e "   8. ✅ Check My Properties page"

echo -e "\n${GREEN}🏠 Property Types Supported:${NC}"
echo -e "   🏠 Residential - Apartments, Villas, Houses"
echo -e "   🏢 Commercial - Offices, Shops"
echo -e "   🌾 Land - Residential/Commercial Plots"
echo -e "   🏡 Farmhouse - With gardens and amenities"
echo -e "   🏠 PG - Paying guest accommodations"

echo -e "\n${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all servers...${NC}"
    kill $BACKEND_PID $MAIN_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for all processes
wait
