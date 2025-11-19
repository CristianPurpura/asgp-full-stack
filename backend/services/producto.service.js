const productoRepository = require('../repositories/producto.repository');
const stockRepository = require('../repositories/stock.repository');

class ProductoService {
    async obtenerTodos() {
        return await productoRepository.findAll();
    }

    async obtenerPorId(id) {
        const producto = await productoRepository.findById(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return producto;
    }

    async obtenerPorCategoria(categoria) {
        return await productoRepository.findByCategoria(categoria);
    }

    async crear(datosProducto) {
        // Validaciones de negocio
        if (!datosProducto.nombre || !datosProducto.precio) {
            throw new Error('Nombre y precio son requeridos');
        }

        if (datosProducto.precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }

        // Crear producto
        const nuevoId = await productoRepository.create(datosProducto);

        // Crear entrada de stock automáticamente
        await stockRepository.create(nuevoId);

        return {
            id: nuevoId,
            ...datosProducto
        };
    }

    async actualizar(id, datosProducto) {
        // Verificar que existe
        const existe = await productoRepository.exists(id);
        if (!existe) {
            throw new Error('Producto no encontrado');
        }

        // Validaciones de negocio
        if (datosProducto.precio && datosProducto.precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }

        await productoRepository.update(id, datosProducto);
        return true;
    }

    async eliminar(id) {
        // Verificar que existe
        const existe = await productoRepository.exists(id);
        if (!existe) {
            throw new Error('Producto no encontrado');
        }

        try {
            await productoRepository.delete(id);
            return true;
        } catch (error) {
            throw new Error('No se puede eliminar el producto porque tiene registros asociados');
        }
    }
}

module.exports = new ProductoService();
