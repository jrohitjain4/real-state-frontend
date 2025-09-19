@echo off
echo Starting Real Estate Application Servers...

REM Kill any existing node processes
taskkill /F /IM node.exe 2>nul

REM Start Backend Server
echo Starting Backend Server on port 5000...
cd /d "D:\menifest-project\real-state\local\real-state-project\backend1"
start "Backend Server" cmd /k "npm run dev"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend Server  
echo Starting Frontend Server on port 3000...
cd /d "D:\menifest-project\real-state\local\real-state-project\packages\main"
start "Frontend Server" cmd /k "npm start"

echo.
echo ================================
echo   SERVERS STARTED SUCCESSFULLY!
echo ================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close this window but keep the server windows open.
echo.
pause
