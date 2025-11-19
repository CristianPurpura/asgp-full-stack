const stockRepository = require('../repositories/stock.repository');
const productoRepository = require('../repositories/producto.repository');

class StockService {
    async obtenerTodo() {
        return await stockRepository.findAll();
    }

    async obtenerPorProducto(idProducto) {
        const stock = await stockRepository.findByProducto(idProducto);
        if (!stock) {
            throw new Error('Stock no encontrado para este producto');
        }
        return stock;
    }

    async obtenerStockBajo(limite = 10) {
        return await stockRepository.findStockBajo(limite);
    }

    async actualizar(idProducto, cantidadDeposito, cantidadSucursal) {
        // Validaciones de negocio
        if (cantidadDeposito < 0 || cantidadSucursal < 0) {
            throw new Error('Las cantidades no pueden ser negativas');
        }

        // Verificar que existe el stock
        const existe = await stockRepository.exists(idProducto);
        if (!existe) {
            throw new Error('Stock no encontrado para este producto');
        }

        await stockRepository.update(idProducto, cantidadDeposito, cantidadSucursal);
        return true;
    }

    async transferirAStock(idProducto, cantidad) {
        // Validaciones de negocio
        if (!idProducto || !cantidad || cantidad <= 0) {
            throw new Error('ID de producto y cantidad válida son requeridos');
        }

        // Verificar que el producto existe
        const productoExiste = await productoRepository.exists(idProducto);
        if (!productoExiste) {
            throw new Error('Producto no encontrado');
        }

        // Verificar stock disponible en depósito
        const cantidadDeposito = await stockRepository.getCantidadDeposito(idProducto);
        if (cantidadDeposito < cantidad) {
            throw new Error(`Stock insuficiente en depósito. Disponible: ${cantidadDeposito}`);
        }

        // Realizar la transferencia
        await stockRepository.transferir(idProducto, cantidad);
        return true;
    }

    async verificarDisponibilidadSucursal(idProducto, cantidadRequerida) {
        const cantidadDisponible = await stockRepository.getCantidadSucursal(idProducto);
        
        if (cantidadDisponible < cantidadRequerida) {
            throw new Error(`Stock insuficiente en sucursal. Disponible: ${cantidadDisponible}`);
        }

        return true;
    }

    async descontarStockSucursal(idProducto, cantidad) {
        // Verificar disponibilidad antes de descontar
        await this.verificarDisponibilidadSucursal(idProducto, cantidad);
        
        await stockRepository.decrementarSucursal(idProducto, cantidad);
        return true;
    }
}

module.exports = new StockService();
