const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas solo para administradores
router.get('/', verifyAdmin, usuariosController.obtenerTodos);
router.get('/:id', verifyAdmin, usuariosController.obtenerPorId);
router.post('/', verifyAdmin, usuariosController.crear);
router.put('/:id', verifyAdmin, usuariosController.actualizar);
router.delete('/:id', verifyAdmin, usuariosController.eliminar);

// Cambiar contraseña (admin o el mismo usuario)
router.put('/:id/cambiar-contraseña', usuariosController.cambiarContraseña);

module.exports = router;
