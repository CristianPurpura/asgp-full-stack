# 🏗️ Arquitectura de 4 Capas - ASGP Backend

## Introducción

Este documento detalla la arquitectura en capas implementada en el backend del sistema ASGP. La arquitectura sigue el patrón **Router → Controller → Service → Repository**, que proporciona una separación clara de responsabilidades y facilita el mantenimiento y escalabilidad del código.

## Capas de la Arquitectura

### 📍 Capa 1: Router (Rutas)

**Ubicación:** `backend/routes/`

**Responsabilidad:** Define los endpoints de la API y el enrutamiento HTTP.

**Archivos:**
- `auth.routes.js` - Rutas de autenticación
- `productos.routes.js` - Rutas de productos
- `usuarios.routes.js` - Rutas de usuarios
- `stock.routes.js` - Rutas de stock
- `ventas.routes.js` - Rutas de ventas
- `cierreCaja.routes.js` - Rutas de cierre de caja

**Ejemplo:**
```javascript
// productos.routes.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const { verificarToken, esAdmin } = require('../middleware/auth');

router.get('/', verificarToken, productosController.obtenerTodos);
router.get('/:id', verificarToken, productosController.obtenerPorId);
router.post('/', verificarToken, esAdmin, productosController.crear);

module.exports = router;
```

**Características:**
- Define verbos HTTP (GET, POST, PUT, DELETE)
- Aplica middlewares de autenticación y autorización
- Delega la ejecución a los Controllers
- No contiene lógica de negocio

---

### 🎮 Capa 2: Controller (Controlador)

**Ubicación:** `backend/controllers/`

**Responsabilidad:** Manejar peticiones y respuestas HTTP.

**Archivos:**
- `auth.controller.js`
- `productos.controller.js`
- `usuarios.controller.js`
- `stock.controller.js`
- `ventas.controller.js`
- `cierreCaja.controller.js`

**Funciones:**
- ✅ Extraer datos de `req.params`, `req.body`, `req.query`, `req.user`
- ✅ Llamar al Service correspondiente
- ✅ Formatear respuestas HTTP (códigos de estado, JSON)
- ✅ Manejo de errores y traducción a códigos HTTP

**Ejemplo:**
```javascript
// productos.controller.js
const productoService = require('../services/producto.service');

exports.obtenerPorId = async (req, res) => {
    try {
        const producto = await productoService.obtenerPorId(req.params.id);
        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
```

**Principios:**
- ❌ NO contiene lógica de negocio
- ❌ NO accede directamente a la base de datos
- ✅ Solo maneja la capa HTTP
- ✅ Delega toda la lógica al Service

---

### 🧠 Capa 3: Service (Servicio - Lógica de Negocio)

**Ubicación:** `backend/services/`

**Responsabilidad:** Implementar la lógica de negocio y validaciones.

**Archivos:**
- `auth.service.js` - Lógica de autenticación y JWT
- `producto.service.js` - Lógica de productos
- `usuario.service.js` - Lógica de usuarios
- `stock.service.js` - Lógica de inventario
- `venta.service.js` - Lógica de ventas
- `cierreCaja.service.js` - Lógica de cierre de caja

**Funciones:**
- ✅ Validaciones de datos (formato, rangos, reglas)
- ✅ Reglas de negocio complejas
- ✅ Coordinación de múltiples repositorios
- ✅ Manejo de transacciones
- ✅ Cálculos y transformaciones

**Ejemplo:**
```javascript
// venta.service.js
const ventaRepository = require('../repositories/venta.repository');
const stockService = require('./stock.service');
const productoRepository = require('../repositories/producto.repository');

class VentaService {
    async registrarVenta(idUsuario, idProducto, cantidad, precioUnitario) {
        // Validaciones de negocio
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        // Verificar que el producto existe
        const productoExiste = await productoRepository.exists(idProducto);
        if (!productoExiste) {
            throw new Error('Producto no encontrado');
        }

        // Calcular total
        const total = cantidad * precioUnitario;

        // Verificar stock disponible
        await stockService.verificarDisponibilidadSucursal(idProducto, cantidad);

        // Registrar venta
        const datosVenta = {
            id_usuario: idUsuario,
            id_producto: idProducto,
            cantidad,
            precio_unitario: precioUnitario,
            total
        };

        const ventaId = await ventaRepository.create(datosVenta);

        // Descontar stock
        await stockService.descontarStockSucursal(idProducto, cantidad);

        return {
            id: ventaId,
            ...datosVenta
        };
    }
}

module.exports = new VentaService();
```

**Principios:**
- ✅ Contiene TODA la lógica de negocio
- ✅ Coordina múltiples Repositories si es necesario
- ✅ Lanza excepciones con mensajes claros
- ❌ NO accede directamente a la base de datos
- ❌ NO maneja HTTP (status codes, res, req)

---

### 💾 Capa 4: Repository (Repositorio - Acceso a Datos)

**Ubicación:** `backend/repositories/`

**Responsabilidad:** Acceso directo a la base de datos SQL Server.

**Archivos:**
- `producto.repository.js`
- `usuario.repository.js`
- `stock.repository.js`
- `venta.repository.js`
- `cierreCaja.repository.js`

**Funciones:**
- ✅ Ejecutar consultas SQL (SELECT, INSERT, UPDATE, DELETE)
- ✅ Mapear resultados de BD a objetos JavaScript
- ✅ Parametrización de consultas (prevención de SQL injection)
- ✅ Aislamiento del motor de base de datos

**Ejemplo:**
```javascript
// producto.repository.js
const { getConnection, sql } = require('../config/database');

class ProductoRepository {
    async findById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM PRODUCTOS WHERE ID = @id');
        
        return result.recordset[0];
    }

    async create(producto) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, producto.nombre)
            .input('descripcion', sql.VarChar, producto.descripcion || null)
            .input('precio', sql.Decimal, producto.precio)
            .input('categoria', sql.VarChar, producto.categoria || null)
            .query(`
                INSERT INTO PRODUCTOS (NOMBRE, DESCRIPCION, PRECIO, CATEGORIA)
                VALUES (@nombre, @descripcion, @precio, @categoria);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        return result.recordset[0].id;
    }

    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM PRODUCTOS WHERE ID = @id');
    }
}

module.exports = new ProductoRepository();
```

**Principios:**
- ✅ SOLO contiene consultas SQL
- ✅ Devuelve datos puros (sin formatear para HTTP)
- ❌ NO contiene validaciones de negocio
- ❌ NO lanza errores de negocio (solo errores de BD)
- ✅ Usa queries parametrizadas (seguridad)

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear un Producto

```
┌─────────────────────────────────────────────────────────────────┐
│ CLIENTE (Angular)                                               │
│ POST /api/productos                                             │
│ { nombre: "Laptop", precio: 50000 }                            │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 1. ROUTER (productos.routes.js)                                │
│ - Verifica autenticación (verificarToken)                      │
│ - Verifica permisos (esAdmin)                                  │
│ - Enruta a: productosController.crear                          │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. CONTROLLER (productos.controller.js)                        │
│ - Extrae datos: req.body                                       │
│ - Llama: productoService.crear(req.body)                       │
│ - Formatea respuesta: res.status(201).json({...})             │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. SERVICE (producto.service.js)                               │
│ - Valida: nombre y precio requeridos                           │
│ - Valida: precio > 0                                           │
│ - Llama: productoRepository.create(datosProducto)              │
│ - Llama: stockRepository.create(nuevoId)                       │
│ - Devuelve: { id, nombre, precio }                            │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. REPOSITORY (producto.repository.js)                         │
│ - Ejecuta: INSERT INTO PRODUCTOS (...)                         │
│ - Devuelve: ID del nuevo registro                              │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
                [SQL Server]
                     ↑
                     └──────────────────────────────┐
                                                    ↓
                                  Respuesta JSON al Cliente
```

---

## ✅ Ventajas de esta Arquitectura

### 1. **Separación de Responsabilidades (Single Responsibility Principle)**
Cada capa tiene un propósito único y bien definido:
- Router → Ruteo HTTP
- Controller → Manejo HTTP
- Service → Lógica de negocio
- Repository → Acceso a datos

### 2. **Mantenibilidad**
- Cambios en la lógica de negocio solo afectan a Services
- Cambios en la base de datos solo afectan a Repositories
- Cambios en los endpoints solo afectan a Routers

### 3. **Testabilidad**
Cada capa puede testearse de forma independiente:
- **Repository:** Mockear la base de datos
- **Service:** Mockear Repositories
- **Controller:** Mockear Services
- **Router:** Tests de integración

### 4. **Reutilización de Código**
Los Services pueden ser llamados desde:
- Múltiples Controllers
- Otros Services
- Tareas programadas (cron jobs)
- Scripts de consola

### 5. **Escalabilidad**
Fácil agregar nuevas funcionalidades:
1. Crear nuevo Repository (queries SQL)
2. Crear nuevo Service (lógica)
3. Crear nuevo Controller (HTTP)
4. Crear nuevas Rutas

### 6. **Flexibilidad**
- **Cambiar de BD:** Solo modificar Repositories
- **Cambiar framework HTTP:** Solo modificar Controllers
- **Agregar validaciones:** Solo modificar Services
- **Cambiar endpoints:** Solo modificar Routers

---

## 📊 Comparación: Antes vs Después

### ❌ Arquitectura Anterior (2 Capas)

```javascript
// productos.controller.js (TODO mezclado)
exports.crear = async (req, res) => {
    const { nombre, precio } = req.body;
    
    // ❌ Validación en Controller
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    
    // ❌ Acceso directo a BD desde Controller
    const pool = await getConnection();
    const result = await pool.request()
        .input('nombre', sql.VarChar, nombre)
        .input('precio', sql.Decimal, precio)
        .query('INSERT INTO PRODUCTOS (NOMBRE, PRECIO) VALUES (@nombre, @precio)');
    
    res.status(201).json({ id: result.recordset[0].id });
};
```

**Problemas:**
- ❌ Lógica de negocio mezclada con HTTP
- ❌ No reutilizable (ligado a req/res)
- ❌ Difícil de testear
- ❌ Difícil de mantener

### ✅ Arquitectura Actual (4 Capas)

```javascript
// productos.controller.js (Solo HTTP)
exports.crear = async (req, res) => {
    try {
        const nuevoProducto = await productoService.crear(req.body);
        res.status(201).json({ success: true, data: nuevoProducto });
    } catch (error) {
        const statusCode = error.message.includes('requeridos') ? 400 : 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};

// producto.service.js (Lógica de negocio)
async crear(datosProducto) {
    if (!datosProducto.nombre || !datosProducto.precio) {
        throw new Error('Nombre y precio son requeridos');
    }
    if (datosProducto.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
    }
    const nuevoId = await productoRepository.create(datosProducto);
    await stockRepository.create(nuevoId);
    return { id: nuevoId, ...datosProducto };
}

// producto.repository.js (Solo SQL)
async create(producto) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('nombre', sql.VarChar, producto.nombre)
        .input('precio', sql.Decimal, producto.precio)
        .query('INSERT INTO PRODUCTOS (...) VALUES (...)');
    return result.recordset[0].id;
}
```

**Beneficios:**
- ✅ Código limpio y separado
- ✅ Reutilizable y testeable
- ✅ Fácil de mantener
- ✅ Escalable

---

## 🎯 Mejores Prácticas

### 1. Controllers
```javascript
// ✅ BIEN: Delegar al Service
exports.crear = async (req, res) => {
    try {
        const resultado = await productoService.crear(req.body);
        res.status(201).json({ success: true, data: resultado });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ❌ MAL: Lógica en Controller
exports.crear = async (req, res) => {
    if (!req.body.nombre) { // ❌ Validación aquí
        return res.status(400).json({ error: 'Nombre requerido' });
    }
    const pool = await getConnection(); // ❌ BD aquí
    // ...
};
```

### 2. Services
```javascript
// ✅ BIEN: Validar y coordinar
async crear(datos) {
    this.validar(datos);
    const id = await productoRepository.create(datos);
    await stockRepository.create(id);
    return { id, ...datos };
}

// ❌ MAL: Acceso directo a BD
async crear(datos) {
    const pool = await getConnection(); // ❌ No debe acceder a BD
    // ...
}
```

### 3. Repositories
```javascript
// ✅ BIEN: Solo SQL
async create(datos) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('nombre', sql.VarChar, datos.nombre)
        .query('INSERT INTO ...');
    return result.recordset[0].id;
}

// ❌ MAL: Validaciones aquí
async create(datos) {
    if (!datos.nombre) { // ❌ No debe validar
        throw new Error('Nombre requerido');
    }
    // ...
}
```

---

## 📚 Recursos Adicionales

- **Documentación Backend:** `backend/README.md`
- **Documentación Frontend:** `frontend/README.md`
- **Guía Rápida:** `GUIA_RAPIDA.md`

## 👥 Autor

Grupo 3 - IFTS11

---

**Última actualización:** 2024
