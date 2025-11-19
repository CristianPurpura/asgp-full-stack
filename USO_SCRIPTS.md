# 🎯 Guía de Uso de Scripts PowerShell

## Cómo usar los scripts de automatización

### 1. Cargar los scripts

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
. .\scripts.ps1
```

Esto cargará todas las funciones disponibles.

### 2. Ver comandos disponibles

```powershell
Show-Help
```

### 3. Ver estado del proyecto

```powershell
Show-Status
```

## Comandos Principales

### Instalación Inicial

```powershell
# Instalar solo backend
Install-Backend

# Instalar solo frontend
Install-Frontend

# Instalar todo el proyecto
Install-All
```

### Iniciar Servicios

**Opción 1: Iniciar backend (Terminal 1)**
```powershell
Start-Backend
```

**Opción 2: Iniciar frontend (Terminal 2 - Nueva terminal)**
```powershell
Start-Frontend
```

**Opción 3: Ver instrucciones**
```powershell
Start-All
```

### Limpieza

```powershell
# Limpiar backend
Clean-Backend

# Limpiar frontend
Clean-Frontend

# Limpiar todo
Clean-All
```

### Reiniciar (Limpiar + Instalar)

```powershell
# Reiniciar backend
Reset-Backend

# Reiniciar frontend
Reset-Frontend

# Reiniciar todo
Reset-All
```

## Flujo de Trabajo Recomendado

### Primera vez:

1. **Instalar todo el proyecto:**
   ```powershell
   . .\scripts.ps1
   Install-All
   ```

2. **Configurar .env del backend:**
   - Editar `backend/.env` con tus credenciales de SQL Server

3. **Crear la base de datos:**
   - Ejecutar `database/ASGP_DB.sql` en SSMS

4. **Iniciar backend (Terminal 1):**
   ```powershell
   Start-Backend
   ```

5. **Iniciar frontend (Terminal 2 - Nueva terminal):**
   ```powershell
   cd frontend
   npm start
   ```

### Trabajo diario:

1. **Terminal 1 - Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```powershell
   cd frontend
   npm start
   ```

## Solución de Problemas

### Si hay errores de módulos:

```powershell
# Cargar scripts
. .\scripts.ps1

# Reiniciar todo
Reset-All
```

### Si necesitas limpiar cache:

```powershell
Clean-All
Install-All
```

## Tips

- **Mantén 2 terminales abiertas**: Una para backend, otra para frontend
- **Backend primero**: Siempre inicia el backend antes que el frontend
- **Auto-reload**: Los cambios se reflejan automáticamente
- **Ctrl+C**: Para detener cualquier servicio

## Enlaces Rápidos

- Backend: http://localhost:3000
- Frontend: http://localhost:4200
- API Docs: Ver `backend/README.md`

## Usuarios de Prueba

- **Admin**: facundo@gmail.com / dofacun123
- **Empleado**: empleado@gmail.com / empleado123

---

**¡Disfruta desarrollando con ASGP!** 🚀
