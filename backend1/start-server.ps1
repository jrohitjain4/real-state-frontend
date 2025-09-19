# Backend Server Startup Script
Write-Host "Starting Real Estate Backend Server..." -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Kill any existing Node.js processes
Write-Host "Stopping existing Node.js processes..." -ForegroundColor Yellow
$existingProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($existingProcesses) {
    $existingProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "Stopped existing processes" -ForegroundColor Green
} else {
    Write-Host "No existing Node.js processes found" -ForegroundColor Cyan
}

# Check if port 5000 is in use
Write-Host "Checking port 5000..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Port 5000 is in use. Killing process..." -ForegroundColor Yellow
    $processId = $portInUse.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Start the server
Write-Host "Starting backend server..." -ForegroundColor Cyan
try {
    Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Hidden -PassThru
    Start-Sleep -Seconds 3
    
    # Test if server is running
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method GET -TimeoutSec 5
    Write-Host "Backend server is running successfully!" -ForegroundColor Green
    Write-Host "Server URL: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "API Base URL: http://localhost:5000/api" -ForegroundColor Cyan
    Write-Host "Backend server is ready to accept requests!" -ForegroundColor Green
    
} catch {
    Write-Host "Failed to start backend server" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Try running: node server.js" -ForegroundColor Yellow
}

Write-Host "To stop the server, run: Get-Process -Name node | Stop-Process -Force" -ForegroundColor Yellow