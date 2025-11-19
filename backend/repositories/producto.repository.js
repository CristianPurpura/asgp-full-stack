const { getConnection, sql } = require('../config/database');

class ProductoRepository {
    async findAll() {
        const pool = await getConnection();
        const result = await pool.request()
            .query('SELECT * FROM PRODUCTOS ORDER BY ID DESC');
        return result.recordset;
    }

    async findById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM PRODUCTOS WHERE ID = @id');
        return result.recordset[0];
    }

    async findByCategoria(categoria) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('categoria', sql.VarChar, categoria)
            .query('SELECT * FROM PRODUCTOS WHERE CATEGORIA = @categoria ORDER BY NOMBRE');
        return result.recordset;
    }

    async create(producto) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, producto.nombre)
            .input('descripcion', sql.VarChar, producto.descripcion || null)
            .input('categoria', sql.VarChar, producto.categoria || null)
            .input('precio', sql.Decimal(10, 2), producto.precio)
            .query(`
                INSERT INTO PRODUCTOS (NOMBRE, DESCRIPCION, CATEGORIA, PRECIO) 
                VALUES (@nombre, @descripcion, @categoria, @precio);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    }

    async update(id, producto) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, producto.nombre)
            .input('descripcion', sql.VarChar, producto.descripcion)
            .input('categoria', sql.VarChar, producto.categoria)
            .input('precio', sql.Decimal(10, 2), producto.precio)
            .query(`
                UPDATE PRODUCTOS 
                SET NOMBRE = @nombre, 
                    DESCRIPCION = @descripcion, 
                    CATEGORIA = @categoria, 
                    PRECIO = @precio 
                WHERE ID = @id
            `);
        return true;
    }

    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM PRODUCTOS WHERE ID = @id');
        return true;
    }

    async exists(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT ID FROM PRODUCTOS WHERE ID = @id');
        return result.recordset.length > 0;
    }
}

module.exports = new ProductoRepository();
