# Script para iniciar Frontend y Backend

Write-Host "🚀 Iniciando servidores..." -ForegroundColor Green

# Iniciar Backend en una nueva ventana
Write-Host "📦 Iniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit"
    "-Command"
    "cd '$PSScriptRoot\backend'; npm run dev"
)

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Iniciar Frontend en una nueva ventana
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit"
    "-Command"
    "cd '$PSScriptRoot\frontend'; npm start"
)

Write-Host "`n✅ Servidores iniciándose..." -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Yellow
Write-Host "`nPresiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
