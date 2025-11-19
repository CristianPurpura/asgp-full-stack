# 🚀 GUÍA DE INICIO RÁPIDO - ASGP

## Instalación y Configuración Completa

### 1️⃣ CONFIGURAR SQL SERVER

1. Abrir **SQL Server Management Studio** (SSMS)
2. Conectar a tu instancia de SQL Server
3. Abrir el archivo `database/ASGP_DB.sql`
4. Ejecutar el script completo (presionar F5)
5. Verificar que se creó la base de datos `ASGP_DB`

### 2️⃣ CONFIGURAR BACKEND

```powershell
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar el archivo .env con tus credenciales de SQL Server:
# DB_USER=sa
# DB_PASSWORD=tu_contraseña
# DB_SERVER=localhost
# DB_DATABASE=ASGP_DB
# DB_PORT=1433
# PORT=3000
# JWT_SECRET=clave_secreta_muy_larga_y_segura
# NODE_ENV=development

# Iniciar el servidor
npm run dev
```

El servidor estará en: **http://localhost:3000**

### 3️⃣ CONFIGURAR FRONTEND

```powershell
# Abrir una NUEVA terminal PowerShell

# Navegar a la carpeta frontend
cd frontend

# Instalar Angular CLI globalmente (si no lo tienes)
npm install -g @angular/cli

# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

La aplicación estará en: **http://localhost:4200**

### 4️⃣ PROBAR LA APLICACIÓN

1. Abrir el navegador en **http://localhost:4200**
2. Usar estas credenciales:
   - **Admin**: `facundo@gmail.com` / `dofacun123`
   - **Empleado**: `empleado@gmail.com` / `empleado123`

## ✅ VERIFICACIÓN

### Backend funcionando correctamente:
- Abrir: http://localhost:3000
- Deberías ver un mensaje JSON con información de la API

### Frontend funcionando correctamente:
- Abrir: http://localhost:4200
- Deberías ver la pantalla de login

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: No puede conectar a SQL Server
```powershell
# Verificar que SQL Server esté corriendo:
# 1. Abrir "Servicios" de Windows (services.msc)
# 2. Buscar "SQL Server (MSSQLSERVER)"
# 3. Verificar que esté "En ejecución"
```

### Error: Puerto 3000 o 4200 en uso
```powershell
# Backend - Cambiar puerto en backend/.env:
PORT=3001

# Frontend - Cambiar puerto:
ng serve --port 4201
```

### Error: Módulo no encontrado
```powershell
# Eliminar node_modules y reinstalar:
rm -r node_modules
npm install
```

## 📱 FUNCIONALIDADES PRINCIPALES

### Como ADMIN puedes:
- ✅ Gestionar productos (crear, editar, eliminar)
- ✅ Gestionar stock (actualizar cantidades, transferir)
- ✅ Ver todas las ventas y estadísticas
- ✅ Gestionar usuarios
- ✅ Ver historial de cierres de caja

### Como EMPLEADO puedes:
- ✅ Ver productos y stock
- ✅ Registrar ventas
- ✅ Abrir y cerrar caja
- ✅ Ver tus propias ventas

## 🎯 PRÓXIMOS PASOS

1. Explorar el Dashboard
2. Crear algunos productos nuevos
3. Actualizar stock
4. Registrar ventas de prueba
5. Abrir y cerrar caja

## 📚 DOCUMENTACIÓN ADICIONAL

- **Backend**: Ver `backend/README.md`
- **Frontend**: Ver `frontend/README.md`
- **General**: Ver `README.md` principal

## 💡 TIPS

- Mantener ambas terminales abiertas (backend y frontend)
- Backend debe estar corriendo ANTES de iniciar el frontend
- Los cambios en el código se recargan automáticamente
- Los tokens JWT expiran en 24 horas

## 🆘 AYUDA

Si encuentras algún problema:
1. Verificar que SQL Server esté corriendo
2. Verificar que backend esté en puerto 3000
3. Verificar que frontend esté en puerto 4200
4. Revisar la consola del navegador para errores
5. Revisar la terminal del backend para logs

---

**¡Listo! Ya puedes usar ASGP** 🎉
