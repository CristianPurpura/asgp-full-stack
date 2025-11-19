const express = require('express');
const router = express.Router();
const cierreCajaController = require('../controllers/cierreCaja.controller');
const { verifyToken, verifyAdmin, verifyEmpleado, verifyOnlyEmpleado } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Operaciones solo para empleados (admin no puede abrir/cerrar)
router.get('/actual', verifyOnlyEmpleado, cierreCajaController.obtenerCajaActual);
router.post('/abrir', verifyOnlyEmpleado, cierreCajaController.abrirCaja);
router.post('/cerrar', verifyOnlyEmpleado, cierreCajaController.cerrarCaja);

// Consultas históricas: admin puede ver, empleado ve el suyo
router.get('/', verifyEmpleado, cierreCajaController.obtenerTodos);
router.get('/empleado/:id_empleado', verifyEmpleado, cierreCajaController.obtenerPorEmpleado);
router.get('/:id', verifyEmpleado, cierreCajaController.obtenerPorId);

module.exports = router;
