# PowerShell script to start and monitor servers
Write-Host "Starting Real Estate Application Servers..." -ForegroundColor Green

# Kill existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Function to start backend server with restart capability
function Start-BackendServer {
    $backendPath = "D:\menifest-project\real-state\local\real-state-project\backend1"
    
    Write-Host "Starting Backend Server..." -ForegroundColor Cyan
    
    # Start backend in a new PowerShell window
    $backendScript = @"
Set-Location '$backendPath'
Write-Host 'Backend Server Starting...' -ForegroundColor Green
npm run dev
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript -WindowStyle Normal
}

# Function to start frontend server
function Start-FrontendServer {
    $frontendPath = "D:\menifest-project\real-state\local\real-state-project\packages\main"
    
    Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
    
    # Start frontend in a new PowerShell window  
    $frontendScript = @"
Set-Location '$frontendPath'
Write-Host 'Frontend Server Starting...' -ForegroundColor Green
npm start
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript -WindowStyle Normal
}

# Start both servers
Start-BackendServer
Start-Sleep -Seconds 3
Start-FrontendServer

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "   SERVERS STARTED SUCCESSFULLY!" -ForegroundColor Green  
Write-Host "================================" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Both servers are running in separate windows." -ForegroundColor Yellow
Write-Host "Keep those windows open to keep servers running." -ForegroundColor Yellow
Write-Host ""

# Wait and check if servers are responding
Write-Host "Checking server status..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -TimeoutSec 5
    if ($backendResponse.success) {
        Write-Host "✅ Backend Server: RUNNING" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend Server: NOT RESPONDING" -ForegroundColor Red
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend Server: RUNNING" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend Server: NOT RESPONDING" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit this monitor..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
