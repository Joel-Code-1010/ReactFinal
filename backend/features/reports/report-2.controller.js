const TechnicianPerformanceReport = require('./report-2.model'); // Importar el modelo del reporte de desempeño técnico
const Assignment = require('../assignments/assignment.model'); // Importar modelo de asignaciones
const User = require('../users/user.model'); // Importar modelo de usuarios

// Controlador para generar el reporte de desempeño técnico
const generateTechnicianPerformanceReport = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        // Obtener todos los técnicos activos
        const technicians = await User.find({ role: 'Tecnico', status: true });
        const technicianStatistics = [];

        let topTechnician = { technicianId: null, completedAssignments: 0 };
        let topMaterialConsumer = { technicianId: null, totalMaterialsUsed: 0 };

        for (const technician of technicians) {
            // Obtener las asignaciones asignadas y completadas por el técnico
            const assignedTasks = await Assignment.countDocuments({ technicianId: technician._id });
            const completedTasks = await Assignment.countDocuments({
                technicianId: technician._id,
                status: 'Completada',
            });

            // Calcular los materiales utilizados por el técnico
            const materialsUsed = {};
            const assignments = await Assignment.find({
                technicianId: technician._id,
                status: 'Completada',
            });

            assignments.forEach(assignment => {
                assignment.materials.forEach(material => {
                    if (!materialsUsed[material.materialId]) {
                        materialsUsed[material.materialId] = 0;
                    }
                    materialsUsed[material.materialId] += material.usedQuantity;
                });
            });

            // Sumar el total de materiales utilizados
            const totalMaterialsUsed = Object.values(materialsUsed).reduce((acc, curr) => acc + curr, 0);

            // Actualizar los técnicos destacados
            if (completedTasks > topTechnician.completedAssignments) {
                topTechnician = {
                    technicianId: technician._id,
                    completedAssignments: completedTasks,
                };
            }

            if (totalMaterialsUsed > topMaterialConsumer.totalMaterialsUsed) {
                topMaterialConsumer = {
                    technicianId: technician._id,
                    totalMaterialsUsed,
                };
            }

            // Agregar las estadísticas del técnico al arreglo
            technicianStatistics.push({
                technicianId: technician._id,
                assignedTasks,
                completedTasks,
                materialsUsed: Object.entries(materialsUsed).map(([materialId, quantityUsed]) => ({
                    materialId,
                    quantityUsed,
                })),
            });
        }

        // Crear el reporte
        const report = new TechnicianPerformanceReport({
            date: new Date(),
            name: `Reporte de Desempeño Técnico ${today}`,
            topTechnician,
            topMaterialConsumer,
            technicianStatistics,
        });

        await report.save(); // Guardar el reporte en la base de datos
        res.status(201).json({ message: 'Reporte generado exitosamente', report });
    } catch (error) {
        console.error('Error al generar el reporte de desempeño técnico:', error);
        res.status(500).json({ message: 'Error al generar el reporte', error });
    }
};

// Controlador para obtener todos los reportes de desempeño técnico
const getAllTechnicianPerformanceReports = async (req, res) => {
    try {
        // Obtener todos los reportes y ordenarlos por fecha descendente
        const reports = await TechnicianPerformanceReport.find().sort({ date: -1 });
        res.status(200).json({ message: 'Reportes obtenidos exitosamente', reports });
    } catch (error) {
        console.error('Error al obtener los reportes de desempeño técnico:', error);
        res.status(500).json({ message: 'Error al obtener los reportes', error });
    }
};

const deleteTechnicianPerformanceReport = async (req, res) => {
    try {
        // Obtener el ID del reporte a eliminar
        const { id } = req.params;

        // Eliminar el reporte
        await TechnicianPerformanceReport.findByIdAndDelete(id);
        res.status(200).json({ message: 'Reporte eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el reporte de desempeño técnico:', error);
        res.status(500).json({ message: 'Error al eliminar el reporte', error });
    }
};

module.exports = {
    generateTechnicianPerformanceReport,
    getAllTechnicianPerformanceReports,
    deleteTechnicianPerformanceReport,
};
