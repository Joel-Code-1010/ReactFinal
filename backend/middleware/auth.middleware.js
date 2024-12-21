const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, token no encontrado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
        res.status(401).json({ message });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado, usuario no autenticado' });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(401).json({ message: 'No tienes permisos para acceder a esta ruta' });
        }
        next();
    };
};

module.exports = { protect, authorize };
