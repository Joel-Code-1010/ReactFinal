const express = require('express');
const {
    createAssignment,
    getAllAssignments,
    getTodayAssignmentsByTechnician,
    getHistoryAssignmentsByTechnician,
    updateUsedQuantity,
    completeAssignment
} = require('./assignment.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

// Ruta para crear una nueva asignación (solo administradores)
router.post('/create', protect, authorize('Administrador'), createAssignment);

// Ruta para obtener todas las asignaciones de técnicos activos (solo administradores)
router.get('/all', protect, authorize('Administrador'), getAllAssignments);

// Ruta para obtener las asignaciones del día actual de un técnico
router.get('/technician/today', protect, authorize('Tecnico'), getTodayAssignmentsByTechnician);

// Ruta para obtener el historial de asignaciones de un técnico
router.get('/technician/history', protect, authorize('Tecnico'), getHistoryAssignmentsByTechnician);

// Ruta para actualizar la cantidad utilizada de un material en una asignación (solo técnicos)
router.put('/:assignmentId/material/:materialId', protect, authorize('Tecnico'), updateUsedQuantity);

// Ruta para completar una asignación (solo técnicos)
router.put('/:assignmentId/complete', protect, authorize('Tecnico'), completeAssignment);

module.exports = router;
