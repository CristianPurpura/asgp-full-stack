const { getConnection, sql } = require('../config/database');

class CierreCajaRepository {
    async findAll() {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT 
                    CC.ID,
                    CC.ID_EMPLEADO,
                    U.NOMBRE_COMPLETO AS NOMBRE_EMPLEADO,
                    CC.FECHA_APERTURA,
                    CC.FECHA_CIERRE,
                    CC.MONTO_FINAL
                FROM CIERRE_CAJA CC
                INNER JOIN USUARIOS U ON CC.ID_EMPLEADO = U.ID
                ORDER BY CC.FECHA_APERTURA DESC
            `);
        return result.recordset;
    }

    async findById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    CC.ID,
                    CC.ID_EMPLEADO,
                    U.NOMBRE_COMPLETO AS NOMBRE_EMPLEADO,
                    CC.FECHA_APERTURA,
                    CC.FECHA_CIERRE,
                    CC.MONTO_FINAL
                FROM CIERRE_CAJA CC
                INNER JOIN USUARIOS U ON CC.ID_EMPLEADO = U.ID
                WHERE CC.ID = @id
            `);
        return result.recordset[0];
    }

    async findCajaAbiertaByEmpleado(idEmpleado) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_empleado', sql.Int, idEmpleado)
            .query(`
                SELECT 
                    CC.ID,
                    CC.ID_EMPLEADO,
                    U.NOMBRE_COMPLETO AS NOMBRE_EMPLEADO,
                    CC.FECHA_APERTURA,
                    CC.FECHA_CIERRE,
                    CC.MONTO_FINAL
                FROM CIERRE_CAJA CC
                INNER JOIN USUARIOS U ON CC.ID_EMPLEADO = U.ID
                WHERE CC.ID_EMPLEADO = @id_empleado AND CC.FECHA_CIERRE IS NULL
            `);
        return result.recordset[0];
    }

    async findByEmpleado(idEmpleado) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_empleado', sql.Int, idEmpleado)
            .query(`
                SELECT 
                    CC.ID,
                    CC.FECHA_APERTURA,
                    CC.FECHA_CIERRE,
                    CC.MONTO_FINAL,
                    DATEDIFF(HOUR, CC.FECHA_APERTURA, ISNULL(CC.FECHA_CIERRE, GETDATE())) AS HORAS_TRABAJADAS
                FROM CIERRE_CAJA CC
                WHERE CC.ID_EMPLEADO = @id_empleado
                ORDER BY CC.FECHA_APERTURA DESC
            `);
        return result.recordset;
    }

    async create(idEmpleado) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_empleado', sql.Int, idEmpleado)
            .query(`
                INSERT INTO CIERRE_CAJA (ID_EMPLEADO, FECHA_APERTURA) 
                VALUES (@id_empleado, GETDATE());
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    }

    async cerrar(id, montoFinal) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('monto_final', sql.Decimal(10, 2), montoFinal)
            .query(`
                UPDATE CIERRE_CAJA 
                SET FECHA_CIERRE = GETDATE(), 
                    MONTO_FINAL = @monto_final 
                WHERE ID = @id
            `);
        return true;
    }

    async getVentasByCaja(fechaApertura, idEmpleado) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('fecha_apertura', sql.DateTime, fechaApertura)
            .input('id_empleado', sql.Int, idEmpleado)
            .query(`
                SELECT 
                    COUNT(*) AS total_transacciones,
                    SUM(TOTAL) AS total_vendido
                FROM VENTAS 
                WHERE ID_USUARIO = @id_empleado 
                AND FECHA >= @fecha_apertura
            `);
        return result.recordset[0];
    }

    async tieneCajaAbierta(idEmpleado) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_empleado', sql.Int, idEmpleado)
            .query(`
                SELECT ID FROM CIERRE_CAJA 
                WHERE ID_EMPLEADO = @id_empleado AND FECHA_CIERRE IS NULL
            `);
        return result.recordset.length > 0;
    }
}

module.exports = new CierreCajaRepository();
