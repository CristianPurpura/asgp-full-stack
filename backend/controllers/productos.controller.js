const productoService = require('../services/producto.service');

exports.obtenerTodos = async (req, res) => {
    try {
        const productos = await productoService.obtenerTodos();
        res.json({
            success: true,
            data: productos
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

exports.obtenerPorCategoria = async (req, res) => {
    try {
        const productos = await productoService.obtenerPorCategoria(req.params.categoria);
        res.json({
            success: true,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.crear = async (req, res) => {
    try {
        const nuevoProducto = await productoService.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: nuevoProducto
        });
    } catch (error) {
        const statusCode = error.message.includes('requeridos') || error.message.includes('mayor a 0') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.actualizar = async (req, res) => {
    try {
        await productoService.actualizar(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Producto actualizado exitosamente'
        });
    } catch (error) {
        const statusCode = error.message === 'Producto no encontrado' ? 404 : 
                          error.message.includes('mayor a 0') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.eliminar = async (req, res) => {
    try {
        await productoService.eliminar(req.params.id);
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
