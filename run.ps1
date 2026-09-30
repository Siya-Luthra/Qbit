# run.ps1 - Startup script for QBit

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       Starting QBit             " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Start Backend in a new window/process
Write-Host "Starting FastAPI Backend..." -ForegroundColor Green
$BackendProcess = Start-Process -FilePath "python" -ArgumentList "-m uvicorn main:app --reload" -WorkingDirectory "$PSScriptRoot\backend" -PassThru

# Start Frontend in a new window/process
Write-Host "Starting React Frontend..." -ForegroundColor Green
$FrontendProcess = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru

Write-Host "`nServers are starting up!" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Gray
Write-Host "Frontend UI: http://localhost:5173" -ForegroundColor Gray
Write-Host "`nPress ENTER in this window to STOP both servers and exit..." -ForegroundColor Red

# Wait for ENTER press
Read-Host

Write-Host "`nStopping servers..." -ForegroundColor Yellow
Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue

Write-Host "Done!" -ForegroundColor Green
