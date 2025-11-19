const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getConnection, closeConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const stockRoutes = require('./routes/stock.routes');
const ventasRoutes = require('./routes/ventas.routes');
const cierreCajaRoutes = require('./routes/cierreCaja.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/cierre-caja', cierreCajaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API ASGP - Sistema de Administración y Gestión de Productos',
        version: '1.0.0',
        status: 'online'
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada' 
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        await getConnection();
        
        app.listen(PORT, () => {
            console.log(`\nServidor corriendo en http://localhost:${PORT}`);
            console.log(`Base de datos: ${process.env.DB_DATABASE}`);
            console.log(`Entorno: ${process.env.NODE_ENV}\n`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\nCerrando servidor...');
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nCerrando servidor...');
    await closeConnection();
    process.exit(0);
});

startServer();
