const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const { verifyToken, verifyAdmin, verifyEmpleado } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas accesibles por todos los usuarios autenticados
router.get('/', productosController.obtenerTodos);
router.get('/categoria/:categoria', productosController.obtenerPorCategoria);
router.get('/:id', productosController.obtenerPorId);

// Rutas solo para administradores
router.post('/', verifyAdmin, productosController.crear);
router.put('/:id', verifyAdmin, productosController.actualizar);
router.delete('/:id', verifyAdmin, productosController.eliminar);

module.exports = router;
