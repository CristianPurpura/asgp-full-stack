const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const usuario = await authService.registrarUsuario(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: usuario
        });
    } catch (error) {
        const statusCode = error.message.includes('ya está registrado') || error.message.includes('requeridos') ? 400 : 500;
        res.status(statusCode).json({ 
            success: false,
            message: error.message 
        });
    }
};

const login = async (req, res) => {
    try {
        const { mail, contraseña, password } = req.body;
        const pass = contraseña || password;

        // Logging básico sin exponer la contraseña
        console.log(`[LOGIN] intento mail=${mail || 'N/D'} keys=${Object.keys(req.body).join(',')}`);

        if (!mail || !pass) {
            throw new Error('Email y contraseña son requeridos');
        }

        const resultado = await authService.login(mail, pass);
        res.json({ 
            success: true,
            message: 'Login exitoso', 
            data: resultado 
        });
    } catch (error) {
        const statusCode = error.message === 'Credenciales inválidas' ? 401 : 
                          error.message.includes('requeridos') ? 400 : 500;
        res.status(statusCode).json({ 
            success: false,
            message: error.message 
        });
    }
};

const verifyToken = async (req, res) => {
    res.json({
        success: true,
        message: 'Token válido',
        data: req.user
    });
};

module.exports = {
    login,
    register,
    verifyToken
};
