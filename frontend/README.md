# 🎨 ASGP Frontend - Aplicación Angular

Frontend del Sistema de Administración y Gestión de Productos desarrollado con Angular 17.

## 📋 Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Angular CLI** (v17 o superior)

## 🛠️ Instalación

1. **Navegar a la carpeta del frontend**
   ```powershell
   cd frontend
   ```

2. **Instalar Angular CLI globalmente** (si no lo tienes)
   ```powershell
   npm install -g @angular/cli
   ```

3. **Instalar dependencias**
   ```powershell
   npm install
   ```

4. **Configurar la URL del backend**
   - Editar `src/environments/environment.ts` si es necesario
   - Por defecto apunta a `http://localhost:3000/api`

## ▶️ Ejecutar la Aplicación

### Modo de desarrollo
```powershell
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Compilar para producción
```powershell
npm run build
# o
ng build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🔑 Acceso al Sistema

### Credenciales de Prueba

**Administradores:**
- Email: `facundo@gmail.com` | Contraseña: `dofacun123`
- Email: `cristian@gmail.com` | Contraseña: `cristian123`
- Email: `gustavo@gmail.com` | Contraseña: `gustavo123`
- Email: `julian@gmail.com` | Contraseña: `julian123`
- Email: `iara@gmail.com` | Contraseña: `iara123`

**Empleado:**
- Email: `empleado@gmail.com` | Contraseña: `empleado123`

## 📱 Funcionalidades

### Para todos los usuarios autenticados:
- ✅ Login/Logout
- 📊 Dashboard con estadísticas
- 📦 Visualizar productos
- 📊 Consultar stock
- 💰 Registrar ventas
- 💵 Abrir/cerrar caja

### Solo para Administradores:
- ➕ Crear, editar y eliminar productos
- 📝 Gestionar stock (actualizar cantidades, transferir entre depósito y sucursal)
- 👥 Gestión de usuarios
- 📈 Ver estadísticas completas de ventas
- 📋 Ver historial de cierres de caja

## 📂 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes de la aplicación
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── productos/
│   │   │   ├── stock/
│   │   │   ├── ventas/
│   │   │   ├── cierre-caja/
│   │   │   └── usuarios/
│   │   ├── guards/              # Guards de rutas
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── interceptors/        # Interceptores HTTP
│   │   │   └── auth.interceptor.ts
│   │   ├── models/              # Interfaces y modelos
│   │   │   ├── auth.model.ts
│   │   │   ├── producto.model.ts
│   │   │   ├── stock.model.ts
│   │   │   ├── venta.model.ts
│   │   │   └── cierre-caja.model.ts
│   │   ├── services/            # Servicios
│   │   │   ├── auth.service.ts
│   │   │   ├── producto.service.ts
│   │   │   ├── stock.service.ts
│   │   │   ├── venta.service.ts
│   │   │   └── cierre-caja.service.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/            # Configuración de entornos
│   ├── assets/                  # Recursos estáticos
│   ├── styles.css              # Estilos globales
│   └── index.html              # HTML principal
├── angular.json
├── package.json
└── tsconfig.json
```

## 🎨 Características Técnicas

### Arquitectura
- **Standalone Components**: Uso de componentes independientes de Angular 17
- **Signals**: Gestión reactiva del estado con Angular Signals
- **Lazy Loading**: Carga diferida de rutas para mejor rendimiento
- **Functional Guards**: Guards funcionales para protección de rutas
- **HTTP Interceptors**: Interceptor para agregar el token JWT automáticamente

### Servicios
Todos los servicios utilizan:
- **HttpClient** para comunicación con la API
- **RxJS Observables** para manejo asíncrono
- **Environment variables** para configuración

### Routing
- Rutas protegidas con `authGuard`
- Rutas de administrador protegidas con `adminGuard`
- Lazy loading de componentes

### Estilos
- CSS personalizado con variables y clases utilitarias
- Diseño responsive (mobile-first)
- Tema moderno y limpio

## 🔐 Seguridad

- **JWT Token**: Almacenado en localStorage
- **Auth Guard**: Protege rutas no autorizadas
- **Admin Guard**: Restringe acceso a funcionalidades de administrador
- **Interceptor**: Agrega automáticamente el token a todas las peticiones HTTP

## 🚀 Flujo de Trabajo

### Login
1. Usuario ingresa credenciales
2. Sistema valida con el backend
3. Si es correcto, guarda el token y redirige al dashboard
4. Si es incorrecto, muestra mensaje de error

### Dashboard
- Muestra resumen de datos importantes
- Enlaces rápidos a secciones principales
- Información personalizada según el rol del usuario

### Gestión de Productos (ADMIN)
1. Ver listado de productos
2. Crear nuevo producto
3. Editar producto existente
4. Eliminar producto
5. Filtrar por categoría

### Gestión de Stock (ADMIN)
1. Ver stock de todos los productos
2. Actualizar cantidades de depósito y sucursal
3. Transferir stock de depósito a sucursal
4. Ver productos con stock bajo

### Registro de Ventas (EMPLEADO/ADMIN)
1. Seleccionar producto
2. Ingresar cantidad
3. Sistema verifica stock disponible
4. Registra la venta y actualiza el stock automáticamente

### Cierre de Caja (EMPLEADO/ADMIN)
1. Abrir caja al iniciar turno
2. Registrar ventas durante el turno
3. Ver ventas acumuladas
4. Cerrar caja ingresando monto final

## 🛠️ Comandos Útiles

```powershell
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

# Ejecutar tests
npm test

# Ver versión de Angular CLI
ng version

# Generar nuevo componente
ng generate component components/nombre-componente

# Generar nuevo servicio
ng generate service services/nombre-servicio
```

## 📊 API Endpoints Utilizados

El frontend consume los siguientes endpoints del backend:

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro (ADMIN)
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto (ADMIN)
- `PUT /api/productos/:id` - Actualizar producto (ADMIN)
- `DELETE /api/productos/:id` - Eliminar producto (ADMIN)
- `GET /api/stock` - Listar stock
- `PUT /api/stock/producto/:id` - Actualizar stock (ADMIN)
- `POST /api/stock/transferir` - Transferir stock (ADMIN)
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Registrar venta
- `GET /api/ventas/estadisticas` - Estadísticas
- `GET /api/cierre-caja/actual` - Caja actual
- `POST /api/cierre-caja/abrir` - Abrir caja
- `POST /api/cierre-caja/cerrar` - Cerrar caja

## 🐛 Troubleshooting

### Error: No puede conectar con el backend
- Verificar que el backend esté corriendo en `http://localhost:3000`
- Revisar la configuración en `src/environments/environment.ts`
- Verificar que CORS esté habilitado en el backend

### Error: Token inválido
- Cerrar sesión y volver a iniciar
- Verificar que el backend esté usando la misma clave JWT_SECRET

### Error: Módulo no encontrado
- Ejecutar `npm install` para instalar todas las dependencias
- Verificar que Node.js y npm estén actualizados

## 📝 Notas de Desarrollo

- El proyecto usa **TypeScript** en modo estricto
- Se recomienda usar **VS Code** con las extensiones de Angular
- Los componentes son **standalone** (no usan NgModules)
- Se usa **Angular Signals** para estado reactivo
- Todos los servicios inyectan dependencias mediante el constructor

## 🔄 Actualizar Angular

Para actualizar Angular a una versión más reciente:

```powershell
ng update @angular/cli @angular/core
```

## 👥 Autor

Grupo 3 - IFTS11

## 📄 Licencia

ISC

---

## 💡 Tips de Uso

1. **Modo Oscuro**: Los estilos actuales son claros, puedes personalizar los colores en `styles.css`

2. **Personalización**: Modifica los colores principales editando las variables CSS en `styles.css`

3. **Responsivo**: La aplicación está optimizada para desktop, tablet y móvil

4. **Performance**: Los componentes se cargan de forma diferida (lazy loading) para mejor rendimiento

5. **Mantenimiento**: Los componentes están desacoplados y son fáciles de mantener

¡Disfruta usando ASGP! 🎉
