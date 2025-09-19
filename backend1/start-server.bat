@echo off
echo Starting Real Estate Backend Server...
echo =====================================

REM Kill existing Node.js processes
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start the server
echo Starting server...
node server.js

pause
