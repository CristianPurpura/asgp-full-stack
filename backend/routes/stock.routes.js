const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const { verifyToken, verifyAdmin, verifyEmpleado } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas accesibles por todos los usuarios autenticados
router.get('/', stockController.obtenerTodo);
router.get('/bajo', stockController.obtenerStockBajo);
router.get('/producto/:id_producto', stockController.obtenerPorProducto);

// Rutas solo para administradores
router.put('/producto/:id_producto', verifyAdmin, stockController.actualizar);
router.post('/transferir', verifyAdmin, stockController.transferir);

module.exports = router;
