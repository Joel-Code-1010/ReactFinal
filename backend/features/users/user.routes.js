const express = require('express');
const { getUsers, getUserById, searchUserByName, createUser, updateUser, changePassword, deleteUser } = require('./user.controller');
const {protect, authorize} = require('../../middleware/auth.middleware')

const router = express.Router();

// Ruta para obtener todos los usuarios activos (Solo accesible para administradores)
router.get('/all', protect, authorize('Administrador'), getUsers);

// Ruta para obtener un usuario por su ID
router.get('/detail/:id', protect, authorize('Administrador','Tecnico'), getUserById);

// Ruta para buscar usuarios por nombre
router.get('/search', protect, authorize('Administrador'), searchUserByName);

// Ruta para crear un nuevo usuario (Solo administradores)
router.post('/create', protect, authorize('Administrador'), createUser);

// Ruta para actualizar los datos de un usuario
router.put('/update/:id', protect, authorize('Administrador'), updateUser);

// Ruta para cambiar la contraseña de un usuario (Acceso personal o administrador)
router.put('/change-password/:id', protect, authorize('Administrador','Tecnico'), changePassword);

// Ruta para eliminar un usuario lógicamente (Solo administradores)
router.delete('/delete/:id', protect, authorize('Administrador'), deleteUser);

module.exports = router;
