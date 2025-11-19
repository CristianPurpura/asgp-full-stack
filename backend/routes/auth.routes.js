const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas
router.post('/register', verifyToken, verifyAdmin, authController.register);
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;
