const usuarioRepository = require('../repositories/usuario.repository');

class UsuarioService {
    async obtenerTodos() {
        return await usuarioRepository.findAll();
    }

    async obtenerPorId(id) {
        const usuario = await usuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return usuario;
    }

    async obtenerPorMail(mail) {
        return await usuarioRepository.findByMail(mail);
    }

    async crear(datosUsuario) {
        // Validaciones de negocio
        if (!datosUsuario.nombre_completo || !datosUsuario.mail || !datosUsuario.contraseña || !datosUsuario.rol) {
            throw new Error('Todos los campos son requeridos');
        }

        if (!['ADMIN', 'EMPLEADO'].includes(datosUsuario.rol)) {
            throw new Error('Rol inválido. Debe ser ADMIN o EMPLEADO');
        }

        // Verificar si el email ya existe
        const mailExiste = await usuarioRepository.mailExists(datosUsuario.mail);
        if (mailExiste) {
            throw new Error('El email ya está registrado');
        }

        // Crear usuario
        const nuevoId = await usuarioRepository.create(datosUsuario);

        return {
            id: nuevoId,
            nombre_completo: datosUsuario.nombre_completo,
            mail: datosUsuario.mail,
            rol: datosUsuario.rol
        };
    }

    async actualizar(id, datosUsuario) {
        // Verificar que existe
        const existe = await usuarioRepository.exists(id);
        if (!existe) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar si el email ya está en uso por otro usuario
        if (datosUsuario.mail) {
            const mailExiste = await usuarioRepository.mailExists(datosUsuario.mail, id);
            if (mailExiste) {
                throw new Error('El email ya está en uso');
            }
        }

        // Validar rol
        if (datosUsuario.rol && !['ADMIN', 'EMPLEADO'].includes(datosUsuario.rol)) {
            throw new Error('Rol inválido');
        }

        await usuarioRepository.update(id, datosUsuario);
        return true;
    }

    async eliminar(id, usuarioActualId) {
        // No permitir eliminar el propio usuario
        if (parseInt(id) === usuarioActualId) {
            throw new Error('No puedes eliminar tu propio usuario');
        }

        // Verificar que existe
        const existe = await usuarioRepository.exists(id);
        if (!existe) {
            throw new Error('Usuario no encontrado');
        }

        try {
            await usuarioRepository.delete(id);
            return true;
        } catch (error) {
            throw new Error('No se puede eliminar el usuario porque tiene registros asociados');
        }
    }

    async cambiarContraseña(id, contraseñaActual, contraseñaNueva, esAdmin, usuarioActualId) {
        // Verificar permisos
        if (parseInt(id) !== usuarioActualId && !esAdmin) {
            throw new Error('No tienes permisos para cambiar esta contraseña');
        }

        // Verificar contraseña actual si no es admin
        if (!esAdmin) {
            const usuario = await usuarioRepository.findByMail(usuarioActualId);
            if (!usuario || usuario.CONTRASEÑA !== contraseñaActual) {
                throw new Error('Contraseña actual incorrecta');
            }
        }

        await usuarioRepository.updatePassword(id, contraseñaNueva);
        return true;
    }
}

module.exports = new UsuarioService();
