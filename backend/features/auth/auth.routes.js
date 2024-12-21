const express = require('express');
const { login, logout, verifyToken } = require('./auth.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', logout);

// Ruta para obtener el estado de autenticación
router.get('/status', protect, verifyToken); // Usa el middleware y el controlador correcto

module.exports = router;
