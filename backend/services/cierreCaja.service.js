const cierreCajaRepository = require('../repositories/cierreCaja.repository');
const usuarioRepository = require('../repositories/usuario.repository');

class CierreCajaService {
    async obtenerTodos() {
        return await cierreCajaRepository.findAll();
    }

    async obtenerPorId(id) {
        const cierre = await cierreCajaRepository.findById(id);
        if (!cierre) {
            throw new Error('Cierre de caja no encontrado');
        }
        return cierre;
    }

    async obtenerCajaActual(idEmpleado) {
        const cajaAbierta = await cierreCajaRepository.findCajaAbiertaByEmpleado(idEmpleado);
        
        if (!cajaAbierta) {
            return null;
        }

        // Obtener ventas de esta caja
        const ventas = await cierreCajaRepository.getVentasByCaja(
            cajaAbierta.FECHA_APERTURA,
            idEmpleado
        );

        return {
            cierre: cajaAbierta,
            ventas: ventas
        };
    }

    async obtenerHistorialPorEmpleado(idEmpleado) {
        // Verificar que el empleado existe
        const empleadoExiste = await usuarioRepository.exists(idEmpleado);
        if (!empleadoExiste) {
            throw new Error('Empleado no encontrado');
        }

        return await cierreCajaRepository.findByEmpleado(idEmpleado);
    }

    async abrirCaja(idEmpleado) {
        // Validación de negocio: verificar que no tenga una caja abierta
        const tieneCajaAbierta = await cierreCajaRepository.tieneCajaAbierta(idEmpleado);
        
        if (tieneCajaAbierta) {
            throw new Error('Ya tienes una caja abierta');
        }

        // Verificar que el empleado existe
        const empleadoExiste = await usuarioRepository.exists(idEmpleado);
        if (!empleadoExiste) {
            throw new Error('Empleado no encontrado');
        }

        const nuevoCierreId = await cierreCajaRepository.create(idEmpleado);

        return {
            id: nuevoCierreId,
            id_empleado: idEmpleado
        };
    }

    async cerrarCaja(idEmpleado, montoFinal) {
        // Validaciones de negocio
        if (montoFinal === undefined || montoFinal === null) {
            throw new Error('El monto final es requerido');
        }

        if (montoFinal < 0) {
            throw new Error('El monto final no puede ser negativo');
        }

        // Buscar caja abierta del empleado
        const cajaAbierta = await cierreCajaRepository.findCajaAbiertaByEmpleado(idEmpleado);

        if (!cajaAbierta) {
            throw new Error('No tienes una caja abierta');
        }

        await cierreCajaRepository.cerrar(cajaAbierta.ID, montoFinal);

        return {
            id: cajaAbierta.ID,
            monto_final: montoFinal
        };
    }
}

module.exports = new CierreCajaService();
