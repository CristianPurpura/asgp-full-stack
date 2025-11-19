const { getConnection, sql } = require('../config/database');

let numeroVentaColumnEnsured = false;

async function ensureNumeroVentaColumn() {
    if (numeroVentaColumnEnsured) return;
    const pool = await getConnection();
    await pool.request().query(`
        IF COL_LENGTH('VENTAS', 'NUMERO_VENTA') IS NULL
        BEGIN
            ALTER TABLE VENTAS ADD NUMERO_VENTA NVARCHAR(50) NULL;
        END
    `);
    numeroVentaColumnEnsured = true;
}

class VentaRepository {
    async findAll() {
        await ensureNumeroVentaColumn();
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT 
                    V.ID,
                    V.ID_USUARIO,
                    U.NOMBRE_COMPLETO AS NOMBRE_USUARIO,
                    V.ID_PRODUCTO,
                    P.NOMBRE AS NOMBRE_PRODUCTO,
                    P.CATEGORIA,
                    V.CANTIDAD,
                    V.PRECIO_UNITARIO,
                    V.TOTAL,
                    V.FECHA,
                    V.NUMERO_VENTA
                FROM VENTAS V
                INNER JOIN USUARIOS U ON V.ID_USUARIO = U.ID
                INNER JOIN PRODUCTOS P ON V.ID_PRODUCTO = P.ID
                ORDER BY V.FECHA DESC
            `);
        return result.recordset;
    }

    async findById(id) {
        await ensureNumeroVentaColumn();
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    V.ID,
                    V.ID_USUARIO,
                    U.NOMBRE_COMPLETO AS NOMBRE_USUARIO,
                    V.ID_PRODUCTO,
                    P.NOMBRE AS NOMBRE_PRODUCTO,
                    P.CATEGORIA,
                    V.CANTIDAD,
                    V.PRECIO_UNITARIO,
                    V.TOTAL,
                    V.FECHA,
                    V.NUMERO_VENTA
                FROM VENTAS V
                INNER JOIN USUARIOS U ON V.ID_USUARIO = U.ID
                INNER JOIN PRODUCTOS P ON V.ID_PRODUCTO = P.ID
                WHERE V.ID = @id
            `);
        return result.recordset[0];
    }

    async findByUsuario(idUsuario) {
        await ensureNumeroVentaColumn();
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_usuario', sql.Int, idUsuario)
            .query(`
                SELECT 
                    V.ID,
                    V.ID_PRODUCTO,
                    P.NOMBRE AS NOMBRE_PRODUCTO,
                    V.CANTIDAD,
                    V.PRECIO_UNITARIO,
                    V.TOTAL,
                    V.FECHA,
                    V.NUMERO_VENTA
                FROM VENTAS V
                INNER JOIN PRODUCTOS P ON V.ID_PRODUCTO = P.ID
                WHERE V.ID_USUARIO = @id_usuario
                ORDER BY V.FECHA DESC
            `);
        return result.recordset;
    }

    async findByFecha(fechaInicio, fechaFin) {
        await ensureNumeroVentaColumn();
        const pool = await getConnection();
        const result = await pool.request()
            .input('fecha_inicio', sql.DateTime, fechaInicio)
            .input('fecha_fin', sql.DateTime, fechaFin)
            .query(`
                SELECT 
                    V.ID,
                    V.ID_USUARIO,
                    U.NOMBRE_COMPLETO AS NOMBRE_USUARIO,
                    V.ID_PRODUCTO,
                    P.NOMBRE AS NOMBRE_PRODUCTO,
                    P.CATEGORIA,
                    V.CANTIDAD,
                    V.PRECIO_UNITARIO,
                    V.TOTAL,
                    V.FECHA,
                    V.NUMERO_VENTA
                FROM VENTAS V
                INNER JOIN USUARIOS U ON V.ID_USUARIO = U.ID
                INNER JOIN PRODUCTOS P ON V.ID_PRODUCTO = P.ID
                WHERE V.FECHA BETWEEN @fecha_inicio AND @fecha_fin
                ORDER BY V.FECHA DESC
            `);
        return result.recordset;
    }

    async create(venta) {
        await ensureNumeroVentaColumn();
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_usuario', sql.Int, venta.id_usuario)
            .input('id_producto', sql.Int, venta.id_producto)
            .input('cantidad', sql.Int, venta.cantidad)
            .input('precio_unitario', sql.Decimal(10, 2), venta.precio_unitario)
            .input('total', sql.Decimal(10, 2), venta.total)
            .input('numero_venta', sql.NVarChar(50), venta.numero_venta || null)
            .query(`
                INSERT INTO VENTAS (ID_USUARIO, ID_PRODUCTO, CANTIDAD, PRECIO_UNITARIO, TOTAL, FECHA, NUMERO_VENTA) 
                VALUES (@id_usuario, @id_producto, @cantidad, @precio_unitario, @total, GETDATE(), @numero_venta);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    }

    async getEstadisticasGenerales() {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT 
                    COUNT(*) AS total_transacciones,
                    SUM(TOTAL) AS total_vendido,
                    AVG(TOTAL) AS promedio_venta,
                    SUM(CANTIDAD) AS total_productos_vendidos
                FROM VENTAS
            `);
        return result.recordset[0];
    }

    async getTopProductos(limite = 5) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('limite', sql.Int, limite)
            .query(`
                SELECT TOP (@limite)
                    P.NOMBRE,
                    P.CATEGORIA,
                    SUM(V.CANTIDAD) AS total_vendido,
                    SUM(V.TOTAL) AS total_ingresos
                FROM VENTAS V
                INNER JOIN PRODUCTOS P ON V.ID_PRODUCTO = P.ID
                GROUP BY P.NOMBRE, P.CATEGORIA
                ORDER BY SUM(V.TOTAL) DESC
            `);
        return result.recordset;
    }
}

module.exports = new VentaRepository();
