# VERIFICACIÓN DE RUTAS - ASGP Full Stack

## ✅ CONFIGURACIÓN ACTUAL

### Backend (HTTPS)
- **URL Base**: `https://98.95.235.51`
- **Puerto**: 443 (HTTPS via NGINX)
- **Proxy**: NGINX → Node.js (localhost:3000)
- **CORS**: Configurado para `https://main.d2dxwi2afljxg5.amplifyapp.com`

### Frontend (Amplify)
- **URL**: `https://main.d2dxwi2afljxg5.amplifyapp.com`
- **API URL**: `https://98.95.235.51/api`
- **Environment**: Production (environment.prod.ts)

---

## 📋 RUTAS DEL BACKEND

### 1. Autenticación (`/api/auth`)
| Método | Ruta | Controlador | Auth Required | Descripción |
|--------|------|-------------|---------------|-------------|
| POST | `/api/auth/login` | authController.login | ❌ No | Login con email/contraseña |
| POST | `/api/auth/register` | authController.register | ✅ Admin | Registrar nuevo usuario |
| GET | `/api/auth/verify` | authController.verifyToken | ✅ Token | Verificar token JWT |

### 2. Productos (`/api/productos`)
| Método | Ruta | Controlador | Auth Required | Descripción |
|--------|------|-------------|---------------|-------------|
| GET | `/api/productos` | productosController.obtenerTodos | ❌ No | Listar todos los productos |
| GET | `/api/productos/categoria/:categoria` | productosController.obtenerPorCategoria | ❌ No | Filtrar por categoría |
| GET | `/api/productos/:id` | productosController.obtenerPorId | ❌ No | Obtener un producto |
| POST | `/api/productos` | productosController.crear | ✅ Admin | Crear producto |
| PUT | `/api/productos/:id` | productosController.actualizar | ✅ Admin | Actualizar producto |
| DELETE | `/api/productos/:id` | productosController.eliminar | ✅ Admin | Eliminar producto |

### 3. Stock (`/api/stock`)
| Método | Ruta | Controlador | Auth Required | Descripción |
|--------|------|-------------|---------------|-------------|
| GET | `/api/stock` | stockController.obtenerTodo | ❌ No | Listar todo el stock |
| GET | `/api/stock/bajo` | stockController.obtenerStockBajo | ❌ No | Stock bajo mínimo |
| GET | `/api/stock/producto/:id_producto` | stockController.obtenerPorProducto | ❌ No | Stock de un producto |
| PUT | `/api/stock/producto/:id_producto` | stockController.actualizar | ✅ Admin | Actualizar stock |
| POST | `/api/stock/transferir` | stockController.transferir | ✅ Admin | Transferir entre sucursales |

### 4. Ventas (`/api/ventas`)
| Método | Ruta | Controlador | Auth Required | Descripción |
|--------|------|-------------|---------------|-------------|
| GET | `/api/ventas` | ventasController.obtenerTodas | ✅ Empleado | Listar todas las ventas |
| GET | `/api/ventas/estadisticas` | ventasController.obtenerEstadisticas | ✅ Empleado | Estadísticas de ventas |
| GET | `/api/ventas/fecha` | ventasController.obtenerPorFecha | ✅ Empleado | Ventas por rango de fechas |
| GET | `/api/ventas/usuario/:id_usuario` | ventasController.obtenerPorUsuario | ✅ Empleado | Ventas de un usuario |
| GET | `/api/ventas/:id` | ventasController.obtenerPorId | ✅ Empleado | Detalle de una venta |
| POST | `/api/ventas` | ventasController.crear | ✅ Solo Empleado | Registrar nueva venta |

### 5. Usuarios (`/api/usuarios`)
| Método | Ruta | Controlador | Auth Required | Descripción |
|--------|------|-------------|---------------|-------------|
| GET | `/api/usuarios` | usuariosController.obtenerTodos | ✅ Admin | Listar todos los usuarios |
| GET | `/api/usuarios/:id` | usuariosController.obtenerPorId | ✅ Admin | Obtener un usuario |
| POST | `/api/usuarios` | usuariosController.crear | ✅ Admin | Crear usuario |
| PUT | `/api/usuarios/:id` | usuariosController.actualizar | ✅ Admin | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | usuariosController.eliminar | ✅ Admin | Eliminar usuario |
| PUT | `/api/usuarios/:id/cambiar-contraseña` | usuariosController.cambiarContraseña | ✅ Token | Cambiar contraseña |

### 6. Cierre de Caja (`/api/cierre-caja`)
| Método | Ruta | Controlador | Auth Required | Descripción |
|--------|------|-------------|---------------|-------------|
| GET | `/api/cierre-caja/actual` | cierreCajaController.obtenerCajaActual | ✅ Solo Empleado | Caja actual del empleado |
| POST | `/api/cierre-caja/abrir` | cierreCajaController.abrirCaja | ✅ Solo Empleado | Abrir nueva caja |
| POST | `/api/cierre-caja/cerrar` | cierreCajaController.cerrarCaja | ✅ Solo Empleado | Cerrar caja actual |
| GET | `/api/cierre-caja` | cierreCajaController.obtenerTodos | ✅ Empleado | Historial de cierres |
| GET | `/api/cierre-caja/empleado/:id_empleado` | cierreCajaController.obtenerPorEmpleado | ✅ Empleado | Cierres de un empleado |
| GET | `/api/cierre-caja/:id` | cierreCajaController.obtenerPorId | ✅ Empleado | Detalle de un cierre |

---

## 📱 SERVICIOS DEL FRONTEND

### AuthService
- **Base URL**: `${environment.apiUrl}/auth` → `https://98.95.235.51/api/auth`
- Métodos:
  - `login(credentials)` → POST `/api/auth/login`
  - `loginWithCognito()` → Redirect a Cognito Hosted UI
  - `handleCognitoCallback()` → Procesa tokens de Cognito

### ProductoService
- **Base URL**: `${environment.apiUrl}/productos` → `https://98.95.235.51/api/productos`
- Métodos:
  - `getAll()` → GET `/api/productos`
  - `getById(id)` → GET `/api/productos/:id`
  - `getByCategoria(cat)` → GET `/api/productos/categoria/:categoria`
  - `create(producto)` → POST `/api/productos`
  - `update(id, producto)` → PUT `/api/productos/:id`
  - `delete(id)` → DELETE `/api/productos/:id`

### StockService
- **Base URL**: `${environment.apiUrl}/stock` → `https://98.95.235.51/api/stock`
- Métodos:
  - `getAll()` → GET `/api/stock`
  - `getByProducto(id)` → GET `/api/stock/producto/:id_producto`
  - `getStockBajo(limite)` → GET `/api/stock/bajo?limite=X`
  - `update(id, stock)` → PUT `/api/stock/producto/:id_producto`
  - `transferir(transferencia)` → POST `/api/stock/transferir`

### VentaService
- **Base URL**: `${environment.apiUrl}/ventas` → `https://98.95.235.51/api/ventas`
- Métodos:
  - `getAll()` → GET `/api/ventas`
  - `getById(id)` → GET `/api/ventas/:id`
  - `getByUsuario(idUsuario)` → GET `/api/ventas/usuario/:id_usuario`
  - `getByFecha(inicio, fin)` → GET `/api/ventas/fecha?fecha_inicio=X&fecha_fin=Y`
  - `getEstadisticas()` → GET `/api/ventas/estadisticas`
  - `create(venta)` → POST `/api/ventas`

### UsuarioService
- **Base URL**: `${environment.apiUrl}/usuarios` → `https://98.95.235.51/api/usuarios`
- Métodos:
  - `getAll()` → GET `/api/usuarios`
  - `getById(id)` → GET `/api/usuarios/:id`
  - `create(usuario)` → POST `/api/usuarios`
  - `update(id, usuario)` → PUT `/api/usuarios/:id`
  - `delete(id)` → DELETE `/api/usuarios/:id`
  - `getEmpleados()` → GET `/api/usuarios?rol=EMPLEADO`

### CierreCajaService
- **Base URL**: `${environment.apiUrl}/cierre-caja` → `https://98.95.235.51/api/cierre-caja`
- Métodos:
  - `getCajaActual()` → GET `/api/cierre-caja/actual`
  - `abrirCaja()` → POST `/api/cierre-caja/abrir`
  - `cerrarCaja(datos)` → POST `/api/cierre-caja/cerrar`
  - `getAll()` → GET `/api/cierre-caja`
  - `getByEmpleado(id)` → GET `/api/cierre-caja/empleado/:id_empleado`
  - `getById(id)` → GET `/api/cierre-caja/:id`

---

## ✅ VERIFICACIÓN DE CONFIGURACIÓN

### ✅ Backend HTTPS
- [x] NGINX instalado y corriendo
- [x] Certificado SSL autofirmado generado
- [x] Puerto 443 abierto en Security Group
- [x] Proxy inverso configurado a localhost:3000
- [x] CORS habilitado para dominio Amplify
- [x] PM2 con backend Node.js corriendo

### ✅ Frontend Amplify
- [x] environment.prod.ts con apiUrl HTTPS
- [x] Reglas SPA configuradas (status 404)
- [x] Build succeeds sin errores
- [x] Archivos JS/CSS sirviéndose correctamente

### ✅ Autenticación
- [x] JWT implementado en backend
- [x] Middleware auth.js con verificación de token
- [x] Interceptor HTTP en frontend
- [x] AuthGuard y guards de roles (admin, empleado)
- [x] Cognito configurado para OAuth

---

## 🔧 COMANDOS DE VERIFICACIÓN

```bash
# Verificar backend HTTPS
curl -k https://98.95.235.51/

# Verificar login
curl -k -X POST https://98.95.235.51/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mail":"cristian@gmail.com","contraseña":"cristian123"}'

# Verificar productos
curl -k https://98.95.235.51/api/productos

# Verificar stock
curl -k https://98.95.235.51/api/stock

# Ver logs de NGINX
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ver logs del backend
pm2 logs asgp-api
```

---

## 📝 NOTAS IMPORTANTES

1. **Certificado Autofirmado**: Los navegadores mostrarán advertencia de seguridad. Para producción real se necesita certificado de Let's Encrypt o AWS Certificate Manager.

2. **CORS**: Configurado para permitir requests desde `https://main.d2dxwi2afljxg5.amplifyapp.com` con credenciales.

3. **Auth Middleware**: Todas las rutas protegidas verifican el token JWT en el header `Authorization: Bearer <token>`.

4. **Roles**:
   - **ADMIN**: Puede gestionar productos, stock, usuarios
   - **EMPLEADO**: Puede hacer ventas, ver reportes, gestionar su caja
   - **Solo Empleado** (verifyOnlyEmpleado): Operaciones exclusivas de empleados (admin no puede)

5. **Amplify**: Auto-deploy activado. Cada push a `main` dispara un nuevo build.

---

## ✅ ESTADO FINAL

**Todo configurado y funcionando correctamente** ✨

- Backend: HTTPS en EC2 con NGINX
- Frontend: Desplegado en Amplify
- Base de Datos: RDS SQL Server
- Autenticación: JWT + Cognito OAuth
- CORS: Configurado correctamente
- Todas las rutas verificadas y mapeadas
