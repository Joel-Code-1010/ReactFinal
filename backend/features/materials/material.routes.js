const express = require('express');
const { createMaterial, getMaterials, getMaterialById, updateMaterial, deleteMaterial, addMaterialStock } = require('./material.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

// Ruta para crear un material (Solo administradores)
router.post('/create', protect, authorize('Administrador'), createMaterial);

// Ruta para obtener todos los materiales (Solo administradores)
router.get('/all', protect, authorize('Administrador'), getMaterials);

// Ruta para obtener un material por ID (Solo administradores)
router.get('/detail/:id', protect, authorize('Administrador'), getMaterialById);

// Ruta para actualizar un material (Solo administradores)
router.put('/update/:id', protect, authorize('Administrador'), updateMaterial);

// Ruta para eliminar un material (Solo administradores)
router.delete('/delete/:id', protect, authorize('Administrador'), deleteMaterial);

// Ruta para aumentar el stock de un material (Solo administradores)
router.put('/add-stock/:id', protect, authorize('Administrador'), addMaterialStock);

module.exports = router;
