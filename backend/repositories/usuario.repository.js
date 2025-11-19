const { getConnection, sql } = require('../config/database');

class UsuarioRepository {
    async findAll() {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT 
                    ID AS ID_USUARIO,
                    NOMBRE_COMPLETO,
                    LEFT(NOMBRE_COMPLETO, CHARINDEX(' ', NOMBRE_COMPLETO + ' ') - 1) AS NOMBRE,
                    LTRIM(SUBSTRING(NOMBRE_COMPLETO, CHARINDEX(' ', NOMBRE_COMPLETO + ' '), LEN(NOMBRE_COMPLETO))) AS APELLIDO,
                    MAIL AS EMAIL,
                    ROL,
                    CAST(1 AS BIT) AS ACTIVO,
                    GETDATE() AS FECHA_CREACION
                FROM USUARIOS 
                ORDER BY ID
            `);
        return result.recordset;
    }

    async findById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT ID, NOMBRE_COMPLETO, MAIL, ROL FROM USUARIOS WHERE ID = @id');
        return result.recordset[0];
    }

    async findByMail(mail) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('mail', sql.VarChar, mail)
            .query('SELECT * FROM USUARIOS WHERE MAIL = @mail');
        return result.recordset[0];
    }

    async create(usuario) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre_completo', sql.VarChar, usuario.nombre_completo)
            .input('mail', sql.VarChar, usuario.mail)
            .input('contraseña', sql.VarChar, usuario.contraseña)
            .input('rol', sql.VarChar, usuario.rol)
            .query(`
                INSERT INTO USUARIOS (NOMBRE_COMPLETO, MAIL, CONTRASEÑA, ROL) 
                VALUES (@nombre_completo, @mail, @contraseña, @rol);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    }

    async update(id, usuario) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre_completo', sql.VarChar, usuario.nombre_completo)
            .input('mail', sql.VarChar, usuario.mail)
            .input('rol', sql.VarChar, usuario.rol)
            .query(`
                UPDATE USUARIOS 
                SET NOMBRE_COMPLETO = @nombre_completo, 
                    MAIL = @mail, 
                    ROL = @rol 
                WHERE ID = @id
            `);
        return true;
    }

    async updatePassword(id, nuevaContraseña) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('contraseña', sql.VarChar, nuevaContraseña)
            .query('UPDATE USUARIOS SET CONTRASEÑA = @contraseña WHERE ID = @id');
        return true;
    }

    async delete(id) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM USUARIOS WHERE ID = @id');
        return true;
    }

    async exists(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT ID FROM USUARIOS WHERE ID = @id');
        return result.recordset.length > 0;
    }

    async mailExists(mail, excludeId = null) {
        const pool = await getConnection();
        const request = pool.request().input('mail', sql.VarChar, mail);
        
        let query = 'SELECT ID FROM USUARIOS WHERE MAIL = @mail';
        if (excludeId) {
            request.input('excludeId', sql.Int, excludeId);
            query += ' AND ID != @excludeId';
        }
        
        const result = await request.query(query);
        return result.recordset.length > 0;
    }
}

module.exports = new UsuarioRepository();
