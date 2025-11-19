const { getConnection, sql } = require('../config/database');

class StockRepository {
    async findAll() {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT 
                    S.ID,
                    S.ID_PRODUCTO,
                    P.NOMBRE,
                    P.DESCRIPCION,
                    P.CATEGORIA,
                    P.PRECIO,
                    S.CANTIDAD_DEPOSITO,
                    S.CANTIDAD_SUCURSAL,
                    (S.CANTIDAD_DEPOSITO + S.CANTIDAD_SUCURSAL) AS CANTIDAD_TOTAL
                FROM STOCK S
                INNER JOIN PRODUCTOS P ON S.ID_PRODUCTO = P.ID
                ORDER BY P.NOMBRE
            `);
        return result.recordset;
    }

    async findByProducto(idProducto) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_producto', sql.Int, idProducto)
            .query(`
                SELECT 
                    S.ID,
                    S.ID_PRODUCTO,
                    P.NOMBRE,
                    P.DESCRIPCION,
                    P.CATEGORIA,
                    P.PRECIO,
                    S.CANTIDAD_DEPOSITO,
                    S.CANTIDAD_SUCURSAL,
                    (S.CANTIDAD_DEPOSITO + S.CANTIDAD_SUCURSAL) AS CANTIDAD_TOTAL
                FROM STOCK S
                INNER JOIN PRODUCTOS P ON S.ID_PRODUCTO = P.ID
                WHERE S.ID_PRODUCTO = @id_producto
            `);
        return result.recordset[0];
    }

    async findStockBajo(limite) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('limite', sql.Int, limite)
            .query(`
                SELECT 
                    S.ID,
                    S.ID_PRODUCTO,
                    P.NOMBRE,
                    P.CATEGORIA,
                    S.CANTIDAD_DEPOSITO,
                    S.CANTIDAD_SUCURSAL,
                    (S.CANTIDAD_DEPOSITO + S.CANTIDAD_SUCURSAL) AS CANTIDAD_TOTAL
                FROM STOCK S
                INNER JOIN PRODUCTOS P ON S.ID_PRODUCTO = P.ID
                WHERE S.CANTIDAD_SUCURSAL < @limite
                ORDER BY S.CANTIDAD_SUCURSAL ASC
            `);
        return result.recordset;
    }

    async create(idProducto) {
        const pool = await getConnection();
        await pool.request()
            .input('id_producto', sql.Int, idProducto)
            .query(`
                INSERT INTO STOCK (ID_PRODUCTO, CANTIDAD_DEPOSITO, CANTIDAD_SUCURSAL) 
                VALUES (@id_producto, 0, 0)
            `);
        return true;
    }

    async update(idProducto, cantidadDeposito, cantidadSucursal) {
        const pool = await getConnection();
        await pool.request()
            .input('id_producto', sql.Int, idProducto)
            .input('cantidad_deposito', sql.Int, cantidadDeposito)
            .input('cantidad_sucursal', sql.Int, cantidadSucursal)
            .query(`
                UPDATE STOCK 
                SET CANTIDAD_DEPOSITO = @cantidad_deposito, 
                    CANTIDAD_SUCURSAL = @cantidad_sucursal 
                WHERE ID_PRODUCTO = @id_producto
            `);
        return true;
    }

    async transferir(idProducto, cantidad) {
        const pool = await getConnection();
        await pool.request()
            .input('id_producto', sql.Int, idProducto)
            .input('cantidad', sql.Int, cantidad)
            .query(`
                UPDATE STOCK 
                SET CANTIDAD_DEPOSITO = CANTIDAD_DEPOSITO - @cantidad,
                    CANTIDAD_SUCURSAL = CANTIDAD_SUCURSAL + @cantidad
                WHERE ID_PRODUCTO = @id_producto
            `);
        return true;
    }

    async decrementarSucursal(idProducto, cantidad) {
        const pool = await getConnection();
        await pool.request()
            .input('id_producto', sql.Int, idProducto)
            .input('cantidad', sql.Int, cantidad)
            .query(`
                UPDATE STOCK 
                SET CANTIDAD_SUCURSAL = CANTIDAD_SUCURSAL - @cantidad 
                WHERE ID_PRODUCTO = @id_producto
            `);
        return true;
    }

    async getCantidadSucursal(idProducto) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_producto', sql.Int, idProducto)
            .query('SELECT CANTIDAD_SUCURSAL FROM STOCK WHERE ID_PRODUCTO = @id_producto');
        return result.recordset[0]?.CANTIDAD_SUCURSAL || 0;
    }

    async getCantidadDeposito(idProducto) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_producto', sql.Int, idProducto)
            .query('SELECT CANTIDAD_DEPOSITO FROM STOCK WHERE ID_PRODUCTO = @id_producto');
        return result.recordset[0]?.CANTIDAD_DEPOSITO || 0;
    }

    async exists(idProducto) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_producto', sql.Int, idProducto)
            .query('SELECT ID FROM STOCK WHERE ID_PRODUCTO = @id_producto');
        return result.recordset.length > 0;
    }
}

module.exports = new StockRepository();
