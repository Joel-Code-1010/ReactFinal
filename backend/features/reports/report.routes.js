const express = require('express');
const { generateSystemUsageReport, getAllSystemUsageReports, deleteSystemUsageReport } = require('./report-1.controller'); // Controladores del reporte general
const { generateTechnicianPerformanceReport, getAllTechnicianPerformanceReports, deleteTechnicianPerformanceReport } = require('./report-2.controller'); // Controlador del reporte técnico
const { protect, authorize } = require('../../middleware/auth.middleware'); // Middleware de protección y autorización

const router = express.Router();

// Ruta para generar el reporte estadístico de uso del sistema (solo para administradores)
router.post('/system-usage', protect, authorize('Administrador'), generateSystemUsageReport);

// Ruta para obtener todos los reportes generales (solo para administradores)
router.get('/system-usage/all', protect, authorize('Administrador'), getAllSystemUsageReports);

// Ruta para eliminar un reporte de uso del sistema (solo para administradores)
router.delete('/system-usage/:id', protect, authorize('Administrador'), deleteSystemUsageReport);



// Ruta para generar el reporte de desempeño de técnicos (solo para administradores)
router.post('/technician-performance', protect, authorize('Administrador'), generateTechnicianPerformanceReport);

router.get('/technician-performance/all', protect, authorize('Administrador'), getAllTechnicianPerformanceReports);

router.delete('/technician-performance/:id', protect, authorize('Administrador'), deleteTechnicianPerformanceReport);

module.exports = router;
