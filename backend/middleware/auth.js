const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const getCognitoConfig = () => {
    const region = process.env.COGNITO_REGION;
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!region || !userPoolId) return null;
    const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
    const client = jwksClient({ jwksUri: `${issuer}/.well-known/jwks.json`, cache: true, cacheMaxEntries: 5, cacheMaxAge: 60 * 60 * 1000 });
    return { issuer, client };
};

const decodePayload = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
        return payload;
    } catch { return null; }
};

const verifyCognitoToken = async (token) => {
    const cfg = getCognitoConfig();
    if (!cfg) return null;
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString('utf8'));
    const kid = header.kid;
    const key = await cfg.client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const payload = jwt.verify(token, signingKey, { algorithms: ['RS256'], issuer: cfg.issuer });
    return payload;
};

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token no proporcionado' 
        });
    }

    (async () => {
        try {
            // Detectar si es token de Cognito por el issuer
            const payloadPreview = decodePayload(token);
            const cfg = getCognitoConfig();
            if (cfg && payloadPreview?.iss?.startsWith(cfg.issuer)) {
                const payload = await verifyCognitoToken(token);
                req.user = {
                    email: payload.email,
                    rol: payload['custom:rol'] || 'EMPLEADO',
                    sub: payload.sub,
                    provider: 'cognito'
                };
                return next();
            }
            // Fallback: verificar JWT local
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token inválido o expirado' 
            });
        }
    })();
};

// Middleware para verificar que el usuario sea ADMIN
const verifyAdmin = (req, res, next) => {
    if (req.user.rol !== 'ADMIN') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado. Se requieren permisos de administrador' 
        });
    }
    next();
};

// Middleware para verificar que el usuario sea ADMIN o EMPLEADO
const verifyEmpleado = (req, res, next) => {
    if (req.user.rol !== 'ADMIN' && req.user.rol !== 'EMPLEADO') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado' 
        });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyEmpleado,
    // Solo EMPLEADO (excluye ADMIN)
    verifyOnlyEmpleado: (req, res, next) => {
        if (req.user.rol !== 'EMPLEADO') {
            return res.status(403).json({ 
                success: false, 
                message: 'Acceso exclusivo para empleados' 
            });
        }
        next();
    }
};
