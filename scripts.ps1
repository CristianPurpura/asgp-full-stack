# ⚡ Scripts de PowerShell para ASGP

# Este archivo contiene comandos útiles para trabajar con el proyecto

# ===========================================
# INSTALACIÓN INICIAL
# ===========================================

# Instalar dependencias del backend
function Install-Backend {
    Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Green
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✅ Backend listo!" -ForegroundColor Green
}

# Instalar dependencias del frontend
function Install-Frontend {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Green
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✅ Frontend listo!" -ForegroundColor Green
}

# Instalar todo el proyecto
function Install-All {
    Write-Host "🚀 Instalando proyecto completo..." -ForegroundColor Cyan
    Install-Backend
    Install-Frontend
    Write-Host "✅ ¡Instalación completa!" -ForegroundColor Green
}

# ===========================================
# INICIAR SERVICIOS
# ===========================================

# Iniciar backend
function Start-Backend {
    Write-Host "🚀 Iniciando backend..." -ForegroundColor Green
    Set-Location backend
    npm run dev
}

# Iniciar frontend
function Start-Frontend {
    Write-Host "🚀 Iniciando frontend..." -ForegroundColor Green
    Set-Location frontend
    npm start
}

# Iniciar ambos (requiere 2 terminales)
function Start-All {
    Write-Host "⚠️  Necesitas abrir 2 terminales:" -ForegroundColor Yellow
    Write-Host "   Terminal 1: cd backend; npm run dev" -ForegroundColor Cyan
    Write-Host "   Terminal 2: cd frontend; npm start" -ForegroundColor Cyan
}

# ===========================================
# LIMPIEZA
# ===========================================

# Limpiar node_modules del backend
function Clean-Backend {
    Write-Host "🧹 Limpiando backend..." -ForegroundColor Yellow
    Set-Location backend
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    Set-Location ..
    Write-Host "✅ Backend limpio!" -ForegroundColor Green
}

# Limpiar node_modules del frontend
function Clean-Frontend {
    Write-Host "🧹 Limpiando frontend..." -ForegroundColor Yellow
    Set-Location frontend
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    Set-Location ..
    Write-Host "✅ Frontend limpio!" -ForegroundColor Green
}

# Limpiar todo
function Clean-All {
    Write-Host "🧹 Limpiando proyecto completo..." -ForegroundColor Yellow
    Clean-Backend
    Clean-Frontend
    Write-Host "✅ Proyecto limpio!" -ForegroundColor Green
}

# ===========================================
# REINICIAR (LIMPIAR + INSTALAR)
# ===========================================

# Reiniciar backend
function Reset-Backend {
    Write-Host "🔄 Reiniciando backend..." -ForegroundColor Cyan
    Clean-Backend
    Install-Backend
}

# Reiniciar frontend
function Reset-Frontend {
    Write-Host "🔄 Reiniciando frontend..." -ForegroundColor Cyan
    Clean-Frontend
    Install-Frontend
}

# Reiniciar todo
function Reset-All {
    Write-Host "🔄 Reiniciando proyecto completo..." -ForegroundColor Cyan
    Clean-All
    Install-All
}

# ===========================================
# INFORMACIÓN
# ===========================================

# Mostrar ayuda
function Show-Help {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  📚 COMANDOS DISPONIBLES - ASGP" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "📦 INSTALACIÓN:" -ForegroundColor Green
    Write-Host "   Install-Backend      - Instalar dependencias del backend"
    Write-Host "   Install-Frontend     - Instalar dependencias del frontend"
    Write-Host "   Install-All          - Instalar todo el proyecto"
    
    Write-Host "`n🚀 INICIAR:" -ForegroundColor Green
    Write-Host "   Start-Backend        - Iniciar servidor backend"
    Write-Host "   Start-Frontend       - Iniciar aplicación frontend"
    Write-Host "   Start-All            - Ver instrucciones para iniciar todo"
    
    Write-Host "`n🧹 LIMPIEZA:" -ForegroundColor Yellow
    Write-Host "   Clean-Backend        - Limpiar node_modules del backend"
    Write-Host "   Clean-Frontend       - Limpiar node_modules del frontend"
    Write-Host "   Clean-All            - Limpiar todo"
    
    Write-Host "`n🔄 REINICIAR:" -ForegroundColor Cyan
    Write-Host "   Reset-Backend        - Limpiar e instalar backend"
    Write-Host "   Reset-Frontend       - Limpiar e instalar frontend"
    Write-Host "   Reset-All            - Limpiar e instalar todo"
    
    Write-Host "`n❓ AYUDA:" -ForegroundColor Magenta
    Write-Host "   Show-Help            - Mostrar esta ayuda"
    Write-Host "   Show-Status          - Ver estado del proyecto"
    
    Write-Host "`n========================================`n" -ForegroundColor Cyan
}

# Mostrar estado
function Show-Status {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  📊 ESTADO DEL PROYECTO - ASGP" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    # Backend
    Write-Host "📦 BACKEND:" -ForegroundColor Green
    if (Test-Path "backend/node_modules") {
        Write-Host "   ✅ node_modules instalado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ node_modules NO instalado" -ForegroundColor Red
    }
    
    if (Test-Path "backend/.env") {
        Write-Host "   ✅ .env configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  .env NO configurado" -ForegroundColor Yellow
    }
    
    # Frontend
    Write-Host "`n📱 FRONTEND:" -ForegroundColor Green
    if (Test-Path "frontend/node_modules") {
        Write-Host "   ✅ node_modules instalado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ node_modules NO instalado" -ForegroundColor Red
    }
    
    # Base de datos
    Write-Host "`n🗄️  BASE DE DATOS:" -ForegroundColor Green
    if (Test-Path "database/ASGP_DB.sql") {
        Write-Host "   ✅ Script SQL disponible" -ForegroundColor Green
    }
    
    Write-Host "`n========================================`n" -ForegroundColor Cyan
}

# ===========================================
# MENSAJE DE BIENVENIDA
# ===========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  🏪 ASGP - Sistema de Gestión" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "¡Bienvenido! Usa 'Show-Help' para ver comandos disponibles" -ForegroundColor Yellow
Write-Host "O usa 'Show-Status' para ver el estado del proyecto`n" -ForegroundColor Yellow

# Exportar funciones
Export-ModuleMember -Function *
