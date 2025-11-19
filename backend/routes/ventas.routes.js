const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventas.controller');
const { verifyToken, verifyAdmin, verifyEmpleado, verifyOnlyEmpleado } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Consultas: accesibles para empleados y admin (ambos pueden ver)
router.get('/', verifyEmpleado, ventasController.obtenerTodas);
router.get('/estadisticas', verifyEmpleado, ventasController.obtenerEstadisticas);
router.get('/fecha', verifyEmpleado, ventasController.obtenerPorFecha);
router.get('/usuario/:id_usuario', verifyEmpleado, ventasController.obtenerPorUsuario);
router.get('/:id', verifyEmpleado, ventasController.obtenerPorId);

// Crear venta (solo empleados, admin no puede)
router.post('/', verifyOnlyEmpleado, ventasController.crear);

module.exports = router;
