const ventaRepository = require('../repositories/venta.repository');
const stockService = require('./stock.service');
const productoRepository = require('../repositories/producto.repository');
const { getConnection } = require('../config/database');

class VentaService {
    async obtenerTodas() {
        return await ventaRepository.findAll();
    }

    async obtenerPorId(id) {
        const venta = await ventaRepository.findById(id);
        if (!venta) {
            throw new Error('Venta no encontrada');
        }
        return venta;
    }

    async obtenerPorUsuario(idUsuario) {
        return await ventaRepository.findByUsuario(idUsuario);
    }

    async obtenerPorFecha(fechaInicio, fechaFin) {
        if (!fechaInicio || !fechaFin) {
            throw new Error('Se requieren fecha de inicio y fin');
        }

        // Agregar horas para cubrir todo el día
        const fechaInicioCompleta = `${fechaInicio} 00:00:00`;
        const fechaFinCompleta = `${fechaFin} 23:59:59`;

        const ventas = await ventaRepository.findByFecha(fechaInicioCompleta, fechaFinCompleta);
        
        return ventas;
    }

    async obtenerEstadisticas() {
        const estadisticasGenerales = await ventaRepository.getEstadisticasGenerales();
        const topProductos = await ventaRepository.getTopProductos(5);

        return {
            estadisticas_generales: estadisticasGenerales,
            top_productos: topProductos
        };
    }

    async registrarVenta(idUsuario, idProducto, cantidad, precioUnitario, numeroVenta = null) {
        // Validaciones de negocio
        if (!idProducto || !cantidad || !precioUnitario) {
            throw new Error('ID de producto, cantidad y precio son requeridos');
        }

        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        if (precioUnitario <= 0) {
            throw new Error('El precio unitario debe ser mayor a 0');
        }

        // Verificar que el producto existe
        const productoExiste = await productoRepository.exists(idProducto);
        if (!productoExiste) {
            throw new Error('Producto no encontrado');
        }

        // Calcular total
        const total = cantidad * precioUnitario;

        // Iniciar transacción para garantizar consistencia
        const pool = await getConnection();
        const transaction = pool.transaction();
        
        try {
            await transaction.begin();

            // Verificar y descontar stock (esto lanza error si no hay suficiente)
            await stockService.verificarDisponibilidadSucursal(idProducto, cantidad);

            // Registrar venta
            const datosVenta = {
                id_usuario: idUsuario,
                id_producto: idProducto,
                cantidad,
                precio_unitario: precioUnitario,
                total,
                numero_venta: numeroVenta
            };

            const ventaId = await ventaRepository.create(datosVenta);

            // Descontar stock
            await stockService.descontarStockSucursal(idProducto, cantidad);

            await transaction.commit();

            return {
                id: ventaId,
                ...datosVenta
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new VentaService();
