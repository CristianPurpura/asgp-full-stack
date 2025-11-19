const stockService = require('../services/stock.service');

exports.obtenerTodo = async (req, res) => {
    try {
        const stock = await stockService.obtenerTodo();
        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.obtenerPorProducto = async (req, res) => {
    try {
        const stock = await stockService.obtenerPorProducto(req.params.id);
        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.obtenerStockBajo = async (req, res) => {
    try {
        const limite = parseInt(req.query.limite) || 10;
        const stock = await stockService.obtenerStockBajo(limite);
        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { cantidadDeposito, cantidadSucursal } = req.body;
        await stockService.actualizar(req.params.id, cantidadDeposito, cantidadSucursal);
        res.json({
            success: true,
            message: 'Stock actualizado exitosamente'
        });
    } catch (error) {
        const statusCode = error.message.includes('negativas') ? 400 : 
                          error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.transferir = async (req, res) => {
    try {
        const { cantidad } = req.body;
        await stockService.transferirAStock(req.params.id, cantidad);
        res.json({
            success: true,
            message: 'Transferencia realizada exitosamente'
        });
    } catch (error) {
        const statusCode = error.message.includes('requeridos') || 
                          error.message.includes('insuficiente') ? 400 : 
                          error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
