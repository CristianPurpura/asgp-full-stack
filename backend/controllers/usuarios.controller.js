const usuarioService = require('../services/usuario.service');

exports.obtenerTodos = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerTodos();
        res.json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const usuario = await usuarioService.obtenerPorId(req.params.id);
        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        const statusCode = error.message === 'Usuario no encontrado' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.crear = async (req, res) => {
    try {
        const nuevoUsuario = await usuarioService.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: nuevoUsuario
        });
    } catch (error) {
        const statusCode = error.message.includes('requeridos') || 
                          error.message.includes('ya está registrado') || 
                          error.message.includes('inválido') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.actualizar = async (req, res) => {
    try {
        await usuarioService.actualizar(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente'
        });
    } catch (error) {
        const statusCode = error.message === 'Usuario no encontrado' ? 404 : 
                          error.message.includes('en uso') || error.message.includes('inválido') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.eliminar = async (req, res) => {
    try {
        await usuarioService.eliminar(req.params.id, req.user.id);
        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        const statusCode = error.message === 'Usuario no encontrado' ? 404 : 
                          error.message.includes('propio usuario') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.cambiarContraseña = async (req, res) => {
    try {
        const { contraseñaActual, contraseñaNueva } = req.body;
        const esAdmin = req.user.rol === 'ADMIN';
        
        await usuarioService.cambiarContraseña(
            req.params.id, 
            contraseñaActual, 
            contraseñaNueva, 
            esAdmin, 
            req.user.id
        );
        
        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        const statusCode = error.message.includes('permisos') || 
                          error.message.includes('incorrecta') ? 403 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
