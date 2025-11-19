# 🚀 ASGP Backend - API RESTful

Backend del Sistema de Administración y Gestión de Productos desarrollado con Node.js, Express y SQL Server.

## 📋 Requisitos Previos

- **Node.js** (v14 o superior)
- **SQL Server** (2016 o superior)
- **npm** o **yarn**

## 🛠️ Instalación

1. **Clonar el repositorio o navegar a la carpeta del backend**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Ejecutar el script `../database/ASGP_DB.sql` en SQL Server para crear la base de datos y las tablas
   - Puedes usar SQL Server Management Studio (SSMS) o ejecutar desde línea de comandos

4. **Configurar variables de entorno**
   - Copiar el archivo `.env.example` a `.env`
   - Editar `.env` con tus credenciales de SQL Server:
   ```env
   DB_USER=sa
   DB_PASSWORD=tu_contraseña
   DB_SERVER=localhost
   DB_DATABASE=ASGP_DB
   DB_PORT=1433
   PORT=3000
   JWT_SECRET=tu_clave_secreta_muy_segura
   NODE_ENV=development
   ```

## ▶️ Ejecutar el Servidor

### Modo de desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo de producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Documentación de la API

### 🔐 Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "mail": "facundo@gmail.com",
  "contraseña": "dofacun123"
}
```

#### Registrar Usuario (Solo ADMIN)
```http
POST /api/auth/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_completo": "Juan Pérez",
  "mail": "juan@example.com",
  "contraseña": "password123",
  "rol": "EMPLEADO"
}
```

#### Verificar Token
```http
GET /api/auth/verify
Authorization: Bearer {token}
```

---

### 📦 Productos

#### Obtener todos los productos
```http
GET /api/productos
Authorization: Bearer {token}
```

#### Obtener producto por ID
```http
GET /api/productos/:id
Authorization: Bearer {token}
```

#### Obtener productos por categoría
```http
GET /api/productos/categoria/:categoria
Authorization: Bearer {token}
```

#### Crear producto (Solo ADMIN)
```http
POST /api/productos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Producto Nuevo",
  "descripcion": "Descripción del producto",
  "categoria": "CATEGORIA",
  "precio": 150.50
}
```

#### Actualizar producto (Solo ADMIN)
```http
PUT /api/productos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Producto Actualizado",
  "descripcion": "Nueva descripción",
  "categoria": "CATEGORIA",
  "precio": 200.00
}
```

#### Eliminar producto (Solo ADMIN)
```http
DELETE /api/productos/:id
Authorization: Bearer {token}
```

---

### 👥 Usuarios

#### Obtener todos los usuarios (Solo ADMIN)
```http
GET /api/usuarios
Authorization: Bearer {token}
```

#### Obtener usuario por ID (Solo ADMIN)
```http
GET /api/usuarios/:id
Authorization: Bearer {token}
```

#### Actualizar usuario (Solo ADMIN)
```http
PUT /api/usuarios/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_completo": "Juan Carlos Pérez",
  "mail": "juan.perez@example.com",
  "rol": "EMPLEADO"
}
```

#### Eliminar usuario (Solo ADMIN)
```http
DELETE /api/usuarios/:id
Authorization: Bearer {token}
```

#### Cambiar contraseña
```http
PUT /api/usuarios/:id/cambiar-contraseña
Authorization: Bearer {token}
Content-Type: application/json

{
  "contraseña_actual": "password123",
  "contraseña_nueva": "nuevaPassword456"
}
```

---

### 📊 Stock

#### Obtener todo el stock
```http
GET /api/stock
Authorization: Bearer {token}
```

#### Obtener stock de un producto
```http
GET /api/stock/producto/:id_producto
Authorization: Bearer {token}
```

#### Obtener productos con stock bajo
```http
GET /api/stock/bajo?limite=10
Authorization: Bearer {token}
```

#### Actualizar stock (Solo ADMIN)
```http
PUT /api/stock/producto/:id_producto
Authorization: Bearer {token}
Content-Type: application/json

{
  "cantidad_deposito": 150,
  "cantidad_sucursal": 30
}
```

#### Transferir stock de depósito a sucursal (Solo ADMIN)
```http
POST /api/stock/transferir
Authorization: Bearer {token}
Content-Type: application/json

{
  "id_producto": 1,
  "cantidad": 20
}
```

---

### 💰 Ventas

#### Obtener todas las ventas
```http
GET /api/ventas
Authorization: Bearer {token}
```

#### Obtener venta por ID
```http
GET /api/ventas/:id
Authorization: Bearer {token}
```

#### Obtener ventas por usuario
```http
GET /api/ventas/usuario/:id_usuario
Authorization: Bearer {token}
```

#### Obtener ventas por fecha
```http
GET /api/ventas/fecha?fecha_inicio=2024-01-01&fecha_fin=2024-12-31
Authorization: Bearer {token}
```

#### Obtener estadísticas de ventas
```http
GET /api/ventas/estadisticas
Authorization: Bearer {token}
```

#### Registrar venta
```http
POST /api/ventas
Authorization: Bearer {token}
Content-Type: application/json

{
  "id_producto": 1,
  "cantidad": 5,
  "precio_unitario": 100.00
}
```

---

### 💵 Cierre de Caja

#### Obtener caja actual del usuario
```http
GET /api/cierre-caja/actual
Authorization: Bearer {token}
```

#### Abrir caja
```http
POST /api/cierre-caja/abrir
Authorization: Bearer {token}
```

#### Cerrar caja
```http
POST /api/cierre-caja/cerrar
Authorization: Bearer {token}
Content-Type: application/json

{
  "monto_final": 15000.50
}
```

#### Obtener todos los cierres de caja (Solo ADMIN)
```http
GET /api/cierre-caja
Authorization: Bearer {token}
```

#### Obtener historial de cierres de un empleado (Solo ADMIN)
```http
GET /api/cierre-caja/empleado/:id_empleado
Authorization: Bearer {token}
```

---

## 🔒 Roles y Permisos

### ADMIN
- Acceso completo a todas las funcionalidades
- Gestión de usuarios, productos, stock
- Visualización de reportes y estadísticas

### EMPLEADO
- Registro de ventas
- Apertura y cierre de caja
- Consulta de productos y stock
- Visualización de sus propias ventas

## 👤 Usuarios de Prueba

### Administradores:
- Email: `facundo@gmail.com` | Contraseña: `dofacun123`
- Email: `cristian@gmail.com` | Contraseña: `cristian123`
- Email: `gustavo@gmail.com` | Contraseña: `gustavo123`
- Email: `julian@gmail.com` | Contraseña: `julian123`
- Email: `iara@gmail.com` | Contraseña: `iara123`

### Empleado:
- Email: `empleado@gmail.com` | Contraseña: `empleado123`

## 📂 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de SQL Server
├── controllers/
│   ├── auth.controller.js
│   ├── productos.controller.js
│   ├── usuarios.controller.js
│   ├── stock.controller.js
│   ├── ventas.controller.js
│   └── cierreCaja.controller.js
├── services/
│   ├── auth.service.js
│   ├── producto.service.js
│   ├── usuario.service.js
│   ├── stock.service.js
│   ├── venta.service.js
│   └── cierreCaja.service.js
├── repositories/
│   ├── producto.repository.js
│   ├── usuario.repository.js
│   ├── stock.repository.js
│   ├── venta.repository.js
│   └── cierreCaja.repository.js
├── middleware/
│   └── auth.js              # Middleware de autenticación
├── routes/
│   ├── auth.routes.js
│   ├── productos.routes.js
│   ├── usuarios.routes.js
│   ├── stock.routes.js
│   ├── ventas.routes.js
│   └── cierreCaja.routes.js
├── .env                     # Variables de entorno (no incluir en Git)
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── server.js                # Punto de entrada
```

## 🏗️ Arquitectura de 4 Capas

El backend implementa una arquitectura en capas que separa las responsabilidades:

### 1️⃣ Router (Rutas)
- **Ubicación:** `routes/`
- **Responsabilidad:** Define los endpoints de la API
- **Ejemplo:** `GET /api/productos`, `POST /api/ventas`
- **Interacción:** Recibe peticiones HTTP → Enruta al Controller

### 2️⃣ Controller (Controlador)
- **Ubicación:** `controllers/`
- **Responsabilidad:** Maneja peticiones HTTP y respuestas
- **Funciones:**
  - Extraer datos de req (params, body, query)
  - Llamar al Service correspondiente
  - Formatear respuestas HTTP (status codes, JSON)
  - Manejo de errores HTTP
- **Ejemplo:**
  ```javascript
  exports.obtenerTodos = async (req, res) => {
    try {
      const productos = await productoService.obtenerTodos();
      res.json({ success: true, data: productos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  ```
- **Interacción:** Recibe del Router → Llama al Service → Responde al Cliente

### 3️⃣ Service (Servicio - Lógica de Negocio)
- **Ubicación:** `services/`
- **Responsabilidad:** Implementa la lógica de negocio y validaciones
- **Funciones:**
  - Validaciones de datos (formato, rangos, permisos)
  - Reglas de negocio (ej: verificar stock antes de vender)
  - Coordinación de múltiples repositorios
  - Transacciones complejas
  - Cálculos y transformaciones
- **Ejemplo:**
  ```javascript
  async registrarVenta(idUsuario, idProducto, cantidad, precioUnitario) {
    // Validaciones
    if (cantidad <= 0) throw new Error('Cantidad inválida');
      
    // Verificar stock disponible
    await stockService.verificarDisponibilidadSucursal(idProducto, cantidad);
      
    // Registrar venta y descontar stock
    const venta = await ventaRepository.create({ ... });
    await stockRepository.decrementarSucursal(idProducto, cantidad);
      
    return venta;
  }
  ```
- **Interacción:** Recibe del Controller → Llama a Repository(s) → Devuelve resultado

### 4️⃣ Repository (Repositorio - Acceso a Datos)
- **Ubicación:** `repositories/`
- **Responsabilidad:** Acceso directo a la base de datos
- **Funciones:**
  - Consultas SQL (SELECT, INSERT, UPDATE, DELETE)
  - Mapeo de datos de BD a objetos JavaScript
  - Aislamiento del motor de base de datos
- **Ejemplo:**
  ```javascript
  async findById(id) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM PRODUCTOS WHERE ID = @id');
    return result.recordset[0];
  }
  ```
- **Interacción:** Recibe del Service → Ejecuta SQL → Devuelve datos puros

### 📊 Flujo de Datos Completo

```
Cliente (Angular)
  ↓ HTTP Request
[Router] → Define endpoint
  ↓
[Controller] → Extrae datos, delega lógica
  ↓
[Service] → Valida, aplica reglas de negocio
  ↓
[Repository] → Ejecuta consultas SQL
  ↓
SQL Server (Base de Datos)
  ↑ Datos
[Repository] → Mapea resultados
  ↑
[Service] → Procesa y transforma
  ↑
[Controller] → Formatea respuesta HTTP
  ↑ JSON Response
Cliente (Angular)
```

### ✅ Ventajas de esta Arquitectura

1. **Separación de Responsabilidades:** Cada capa tiene un propósito único
2. **Mantenibilidad:** Cambios en una capa no afectan a las demás
3. **Testabilidad:** Cada capa puede probarse de forma independiente
4. **Reutilización:** Los Services pueden llamarse desde múltiples Controllers
5. **Escalabilidad:** Fácil agregar nuevas funcionalidades siguiendo el patrón
6. **Flexibilidad:** Cambiar la BD solo requiere modificar Repositories

## 🔧 Tecnologías Utilizadas

- **Express.js** - Framework web
- **mssql** - Driver para SQL Server
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Encriptación de contraseñas (preparado para uso futuro)
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno
- **express-validator** - Validación de datos

## 📝 Notas Importantes

- Las contraseñas actualmente se almacenan en texto plano para mantener compatibilidad con los datos de prueba. En producción, se recomienda implementar bcrypt.
- El token JWT tiene una duración de 24 horas.
- Las transacciones de venta actualizan automáticamente el stock.
- Se implementa control de transacciones para operaciones críticas.

## 🐛 Troubleshooting

### Error de conexión a SQL Server
- Verificar que SQL Server esté en ejecución
- Verificar credenciales en el archivo `.env`
- Asegurarse de que SQL Server acepte conexiones TCP/IP
- Verificar el puerto (por defecto 1433)

### Error de autenticación
- Verificar que el token JWT sea válido
- Verificar que el usuario tenga los permisos necesarios
- El token debe enviarse en el header `Authorization: Bearer {token}`

## 👥 Autor

Grupo 3 - IFTS11

## 📄 Licencia

ISC
