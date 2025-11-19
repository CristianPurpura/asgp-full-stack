const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuario.repository');

class AuthService {
    async login(mail, contraseña) {
        // Validaciones
        if (!mail || !contraseña) {
            throw new Error('Email y contraseña son requeridos');
        }

        // Buscar usuario por email
        const usuario = await usuarioRepository.findByMail(mail);

        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }

        // Verificar contraseña (comparación directa por ahora)
        // En producción, usar bcrypt.compare()
        if (contraseña !== usuario.CONTRASEÑA) {
            throw new Error('Credenciales inválidas');
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: usuario.ID,
                mail: usuario.MAIL,
                rol: usuario.ROL,
                nombre: usuario.NOMBRE_COMPLETO
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            usuario: {
                id: usuario.ID,
                nombre: usuario.NOMBRE_COMPLETO,
                mail: usuario.MAIL,
                rol: usuario.ROL
            }
        };
    }

    async registrarUsuario(datosUsuario) {
        // Validaciones
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

        // En producción, hashear la contraseña con bcrypt
        // const hashedPassword = await bcrypt.hash(datosUsuario.contraseña, 10);

        const nuevoId = await usuarioRepository.create(datosUsuario);

        return {
            id: nuevoId,
            nombre_completo: datosUsuario.nombre_completo,
            mail: datosUsuario.mail,
            rol: datosUsuario.rol
        };
    }

    verificarToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
}

module.exports = new AuthService();
