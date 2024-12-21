const jwt = require('jsonwebtoken');
const User = require('../users/user.model') // Importar el modelo de usuarios para verificar credenciales

// Controlador para iniciar sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email, status: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });
        }

        // Verificar la contraseña
        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: user._id, rol: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token válido por 1 día
        );

        // Enviar el token como cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

const verifyToken = (req, res) => {
    try {
        // Si el middleware de `protect` pasa, significa que el token es válido
        res.status(200).json({ user: req.user });
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o no autorizado' });
    }
};
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
};


module.exports = { login, logout, verifyToken };

// Controlador para cerrar sesión (opcional)

