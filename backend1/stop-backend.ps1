# Stop Backend Server Script
Write-Host "Stopping Real Estate Backend Server..." -ForegroundColor Yellow

$processes = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "✅ Backend server stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Node.js processes found running" -ForegroundColor Cyan
}
