const cierreCajaService = require('../services/cierreCaja.service');

exports.obtenerTodos = async (req, res) => {
    try {
        const cierres = await cierreCajaService.obtenerTodos();
        res.json({
            success: true,
            data: cierres
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
        const cierre = await cierreCajaService.obtenerPorId(req.params.id);
        res.json({
            success: true,
            data: cierre
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.obtenerCajaActual = async (req, res) => {
    try {
        const cajaActual = await cierreCajaService.obtenerCajaActual(req.user.id);
        
        if (!cajaActual) {
            return res.json({
                success: true,
                data: null,
                message: 'No tienes una caja abierta'
            });
        }
        
        res.json({
            success: true,
            data: cajaActual
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.obtenerPorEmpleado = async (req, res) => {
    try {
        const historial = await cierreCajaService.obtenerHistorialPorEmpleado(req.params.id);
        res.json({
            success: true,
            data: historial
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.abrirCaja = async (req, res) => {
    try {
        const nuevaCaja = await cierreCajaService.abrirCaja(req.user.id);
        res.status(201).json({
            success: true,
            message: 'Caja abierta exitosamente',
            data: nuevaCaja
        });
    } catch (error) {
        const statusCode = error.message.includes('ya tienes') ? 400 : 
                          error.message.includes('no encontrado') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.cerrarCaja = async (req, res) => {
    try {
        const { monto_final, montoFinal } = req.body;
        // Aceptar 0 usando nullish coalescing (evita que 0 sea tratado como falsy)
        const montoRaw = (monto_final ?? montoFinal);

        // Normalizar a número si viene como string
        const monto = (montoRaw !== undefined && montoRaw !== null)
            ? Number(montoRaw)
            : undefined;

        const resultado = await cierreCajaService.cerrarCaja(req.user.id, monto);
        res.json({
            success: true,
            message: 'Caja cerrada exitosamente',
            data: resultado
        });
    } catch (error) {
        const statusCode = error.message.includes('requerido') || 
                          error.message.includes('negativo') || 
                          error.message.includes('No tienes') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
