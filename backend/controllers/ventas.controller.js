const ventaService = require('../services/venta.service');

exports.obtenerTodas = async (req, res) => {
    try {
        const ventas = await ventaService.obtenerTodas();
        res.json({
            success: true,
            data: ventas
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
        const venta = await ventaService.obtenerPorId(req.params.id);
        res.json({
            success: true,
            data: venta
        });
    } catch (error) {
        const statusCode = error.message === 'Venta no encontrada' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.obtenerPorUsuario = async (req, res) => {
    try {
        const idUsuario = req.params.id_usuario;
        console.log('Obteniendo ventas para usuario:', idUsuario);
        const ventas = await ventaService.obtenerPorUsuario(idUsuario);
        console.log('Ventas encontradas:', ventas.length, ventas);
        res.json({
            success: true,
            data: ventas
        });
    } catch (error) {
        console.error('Error al obtener ventas por usuario:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.obtenerPorFecha = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const ventas = await ventaService.obtenerPorFecha(fecha_inicio, fecha_fin);
        res.json({
            success: true,
            data: ventas
        });
    } catch (error) {
        const statusCode = error.message.includes('requieren') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.obtenerEstadisticas = async (req, res) => {
    try {
        const estadisticas = await ventaService.obtenerEstadisticas();
        res.json({
            success: true,
            data: estadisticas
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
        const { id_producto, cantidad, precio_unitario, numero_venta } = req.body;
        console.log('Creando venta:', { 
            userId: req.user.id, 
            id_producto, 
            cantidad, 
            precio_unitario, 
            numero_venta 
        });
        const nuevaVenta = await ventaService.registrarVenta(
            req.user.id, 
            id_producto, 
            cantidad, 
            precio_unitario,
            numero_venta || null
        );
        console.log('Venta creada:', nuevaVenta);
        res.status(201).json({
            success: true,
            message: 'Venta registrada exitosamente',
            data: nuevaVenta
        });
    } catch (error) {
        console.error('Error al crear venta:', error);
        const statusCode = error.message.includes('requeridos') || 
                          error.message.includes('mayor a 0') || 
                          error.message.includes('insuficiente') ? 400 : 
                          error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
