# Backend Server Management Script
Write-Host "Real Estate Backend Server Manager" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if backend is already running
$existingProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($existingProcesses) {
    Write-Host "Stopping existing Node.js processes..." -ForegroundColor Yellow
    $existingProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
}

Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Hidden -PassThru

Start-Sleep -Seconds 3

# Test if server is running
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend server is running successfully!" -ForegroundColor Green
    Write-Host "Server URL: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "API Base URL: http://localhost:5000/api" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend server failed to start or is not responding" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTo stop the server, run: Get-Process -Name 'node' | Stop-Process -Force" -ForegroundColor Yellow
