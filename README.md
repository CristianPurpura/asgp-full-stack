# 🏪 ASGP - Sistema de Administración y Gestión de Productos

Sistema completo de gestión de productos, stock, ventas y control de caja desarrollado con **Node.js**, **Express**, **SQL Server** y **Angular**.

## 📋 Descripción del Proyecto

ASGP es un sistema integral diseñado para la administración de pequeños y medianos comercios. Permite gestionar productos, control de inventario (depósito y sucursal), registro de ventas, y control de apertura/cierre de caja por empleado.

### Características Principales

✅ **Gestión de Productos**: CRUD completo de productos con categorías y precios  
✅ **Control de Stock**: Gestión separada de stock en depósito y sucursal  
✅ **Registro de Ventas**: Sistema de ventas con actualización automática de stock  
✅ **Cierre de Caja**: Control de apertura y cierre de caja por empleado  
✅ **Gestión de Usuarios**: Administración de usuarios con roles (Admin/Empleado)  
✅ **Autenticación JWT**: Sistema seguro de autenticación con tokens  
✅ **Estadísticas**: Reportes y estadísticas de ventas  
✅ **Interfaz Responsive**: Diseño adaptable a móviles y tablets  

## 🏗️ Arquitectura del Proyecto

```
Practica_Express/
├── backend/                 # API RESTful con Node.js y Express
│   ├── config/             # Configuración de base de datos
│   ├── controllers/        # Controladores HTTP (capa 2)
│   ├── services/           # Lógica de negocio (capa 3)
│   ├── repositories/       # Acceso a datos (capa 4)
│   ├── middleware/         # Middleware de autenticación
│   ├── routes/             # Definición de rutas (capa 1)
│   ├── .env                # Variables de entorno
│   ├── server.js           # Punto de entrada
│   └── package.json
├── frontend/               # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Componentes de UI
│   │   │   ├── services/   # Servicios HTTP
│   │   │   ├── guards/     # Guards de autenticación
│   │   │   ├── models/     # Interfaces TypeScript
│   │   │   └── interceptors/ # Interceptores HTTP
│   │   ├── environments/   # Configuración de entornos
│   │   └── styles.css      # Estilos globales
│   ├── angular.json
│   └── package.json
├── database/               # Scripts SQL
│   └── ASGP_DB.sql        # Script de creación de BD
└── README.md              # Este archivo
```

### Arquitectura de 4 Capas (Backend)

El backend implementa una **arquitectura en capas** que separa responsabilidades:

```
┌─────────────────────────────────────────┐
│  1. ROUTER (routes/)                    │
│  Define endpoints HTTP                  │
└─────────────┬───────────────────────────┘
			  ↓
┌─────────────────────────────────────────┐
│  2. CONTROLLER (controllers/)           │
│  Maneja peticiones y respuestas HTTP    │
└─────────────┬───────────────────────────┘
			  ↓
┌─────────────────────────────────────────┐
│  3. SERVICE (services/)                 │
│  Lógica de negocio y validaciones       │
└─────────────┬───────────────────────────┘
			  ↓
┌─────────────────────────────────────────┐
│  4. REPOSITORY (repositories/)          │
│  Acceso directo a SQL Server            │
└─────────────────────────────────────────┘
```

**Beneficios:**
- ✅ Separación clara de responsabilidades
- ✅ Código mantenible y escalable
- ✅ Fácil de testear cada capa
- ✅ Reutilización de lógica de negocio

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** v14+
- **Express.js** v4.18 - Framework web
- **SQL Server** 2016+ - Base de datos
- **mssql** v10 - Driver para SQL Server
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación (preparado para uso)
- **CORS** - Manejo de peticiones cross-origin
- **Arquitectura:** 4 capas (Router-Controller-Service-Repository)

### Frontend
- **Angular** v17 - Framework frontend
- **TypeScript** v5.2 - Lenguaje tipado
- **RxJS** v7.8 - Programación reactiva
- **Angular Router** - Navegación
- **Angular Signals** - Gestión de estado reactiva

### Base de Datos
- **SQL Server** 2016+
- 5 tablas principales: PRODUCTOS, USUARIOS, STOCK, VENTAS, CIERRE_CAJA
- Relaciones con claves foráneas
- Datos de prueba precargados

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- npm (v9 o superior)
- SQL Server (2016 o superior)
- SQL Server Management Studio (SSMS) - opcional pero recomendado

### 1. Clonar o Descargar el Proyecto

```powershell
cd Practica_Express
```

### 2. Configurar la Base de Datos

1. Abrir SQL Server Management Studio
2. Ejecutar el script `database/ASGP_DB.sql`
3. Esto creará la base de datos `ASGP_DB` con todas las tablas y datos de prueba

### 3. Configurar el Backend

```powershell
cd backend
npm install
```

Configurar las variables de entorno en `.env`:

```env
DB_USER=sa
DB_PASSWORD=tu_contraseña_sql_server
DB_SERVER=localhost
DB_DATABASE=ASGP_DB
DB_PORT=1433
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_segura_y_larga
NODE_ENV=development
```

Iniciar el servidor:

```powershell
npm run dev    # Modo desarrollo con nodemon
# o
npm start      # Modo producción
```

El servidor estará corriendo en `http://localhost:3000`

### 4. Configurar el Frontend

```powershell
cd frontend
npm install
```

Si no tienes Angular CLI instalado:

```powershell
npm install -g @angular/cli
```

Iniciar la aplicación:

```powershell
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## 🔑 Usuarios de Prueba

### Administradores (Acceso completo):
- **facundo@gmail.com** / dofacun123
- **cristian@gmail.com** / cristian123
- **gustavo@gmail.com** / gustavo123
- **julian@gmail.com** / julian123
- **iara@gmail.com** / iara123

### Empleado (Acceso limitado):
- **empleado@gmail.com** / empleado123

## 📚 Documentación de la API

Ver documentación completa en: [`backend/README.md`](backend/README.md)

### Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (ADMIN)
- `GET /api/auth/verify` - Verificar token

#### Productos
- `GET /api/productos` - Listar todos los productos
- `POST /api/productos` - Crear producto (ADMIN)
- `PUT /api/productos/:id` - Actualizar producto (ADMIN)
- `DELETE /api/productos/:id` - Eliminar producto (ADMIN)

#### Stock
- `GET /api/stock` - Ver todo el stock
- `PUT /api/stock/producto/:id` - Actualizar stock (ADMIN)
- `POST /api/stock/transferir` - Transferir de depósito a sucursal (ADMIN)
- `GET /api/stock/bajo` - Ver productos con stock bajo

#### Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Registrar venta
- `GET /api/ventas/estadisticas` - Obtener estadísticas

#### Cierre de Caja
- `GET /api/cierre-caja/actual` - Ver caja actual
- `POST /api/cierre-caja/abrir` - Abrir caja
- `POST /api/cierre-caja/cerrar` - Cerrar caja

Todas las rutas (excepto login) requieren token JWT en el header:
```
Authorization: Bearer {token}
```

## 🎯 Flujo de Uso

### 1. Iniciar Sesión
- Acceder a `http://localhost:4200`
- Ingresar con las credenciales de prueba
- El sistema redirige al dashboard

### 2. Dashboard
- Ver resumen de productos, ventas y stock
- Acceder a las diferentes secciones

### 3. Gestión de Productos (ADMIN)
- Ver listado de productos
- Crear nuevos productos
- Editar o eliminar productos existentes

### 4. Gestión de Stock (ADMIN)
- Ver stock en depósito y sucursal
- Actualizar cantidades
- Transferir productos de depósito a sucursal
- Identificar productos con stock bajo

### 5. Registro de Ventas (EMPLEADO/ADMIN)
- Seleccionar producto
- Ingresar cantidad
- Sistema valida stock disponible
- Registra la venta y actualiza stock automáticamente

### 6. Cierre de Caja (EMPLEADO/ADMIN)
- Abrir caja al iniciar el turno
- Registrar ventas durante el turno
- Ver total acumulado
- Cerrar caja al finalizar el turno ingresando el monto final

## 📊 Estructura de la Base de Datos

### Tablas Principales

**USUARIOS**
- ID, NOMBRE_COMPLETO, MAIL, CONTRASEÑA, ROL (ADMIN/EMPLEADO)

**PRODUCTOS**
- ID, NOMBRE, DESCRIPCION, CATEGORIA, PRECIO

**STOCK**
- ID, ID_PRODUCTO, CANTIDAD_DEPOSITO, CANTIDAD_SUCURSAL

**VENTAS**
- ID, ID_USUARIO, ID_PRODUCTO, CANTIDAD, PRECIO_UNITARIO, TOTAL, FECHA

**CIERRE_CAJA**
- ID, ID_EMPLEADO, FECHA_APERTURA, FECHA_CIERRE, MONTO_FINAL

### Relaciones
- STOCK → PRODUCTOS (1:1)
- VENTAS → USUARIOS (N:1)
- VENTAS → PRODUCTOS (N:1)
- CIERRE_CAJA → USUARIOS (N:1)

## 🔒 Seguridad

- ✅ Autenticación con JWT (JSON Web Tokens)
- ✅ Tokens con expiración de 24 horas
- ✅ Protección de rutas con Guards
- ✅ Roles de usuario (ADMIN/EMPLEADO)
- ✅ Middleware de autenticación en todas las rutas protegidas
- ✅ Validación de datos en el servidor
- ✅ CORS configurado para peticiones cross-origin

## 🐛 Troubleshooting

### Backend no se conecta a SQL Server
- Verificar que SQL Server esté corriendo
- Revisar credenciales en `.env`
- Verificar que el puerto 1433 esté abierto
- Habilitar TCP/IP en SQL Server Configuration Manager

### Frontend no conecta con Backend
- Verificar que el backend esté corriendo en puerto 3000
- Revisar `frontend/src/environments/environment.ts`
- Verificar que CORS esté configurado en el backend

### Error de autenticación
- Verificar que el token no haya expirado
- Cerrar sesión y volver a iniciar
- Limpiar localStorage del navegador

## 📝 Scripts Útiles

### Backend
```powershell
npm start      # Iniciar servidor
npm run dev    # Modo desarrollo con auto-reload
```

### Frontend
```powershell
npm start      # Iniciar aplicación
npm run build  # Compilar para producción
ng generate component nombre  # Generar nuevo componente
```

## 🚀 Despliegue en Producción

### Backend
1. Configurar variable de entorno `NODE_ENV=production`
2. Usar `npm start` para iniciar el servidor
3. Configurar reverse proxy con Nginx o Apache
4. Habilitar HTTPS

### Frontend
1. Ejecutar `npm run build`
2. Servir contenido de `dist/` con servidor web
3. Configurar rutas para SPA (Single Page Application)

## 🤝 Contribuciones

Este es un proyecto académico del Grupo 3 - IFTS11.

## 👥 Autores

- Facundo
- Cristian
- Gustavo
- Julian
- Iara

## 📄 Licencia

ISC - Instituto de Formación Técnica Superior N° 11

## 📞 Soporte

Para reportar problemas o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

## 🎯 Próximas Mejoras Sugeridas

- [ ] Implementar encriptación de contraseñas con bcrypt
- [ ] Agregar paginación en listados
- [ ] Exportar reportes a PDF/Excel
- [ ] Notificaciones en tiempo real
- [ ] Gráficos de estadísticas
- [ ] Historial de cambios en productos
- [ ] Búsqueda avanzada y filtros
- [ ] Modo offline para ventas
- [ ] Impresión de tickets de venta
- [ ] Dashboard con gráficos interactivos

---

**¡Gracias por usar ASGP!** 🎉

Para más información, consulta los README específicos en las carpetas `backend/` y `frontend/`.
