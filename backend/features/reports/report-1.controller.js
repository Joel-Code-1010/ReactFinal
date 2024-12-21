const SystemUsageReport = require('./report-1.model'); // Importar el modelo del reporte general
const Assignment = require('../assignments/assignment.model'); // Importar modelo de asignaciones
const User = require('../users/user.model'); // Importar modelo de usuarios
const Material = require('../materials/material.model'); // Importar modelo de materiales

// Controlador para generar un reporte general
const generateSystemUsageReport = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        // Contar el número total de usuarios registrados en el sistema
        const totalUsers = await User.countDocuments();

        // Determinar el número de técnicos activos que enviaron reportes hoy
        const activeTechnicians = (await Assignment.distinct('technicianId', {
            status: 'Completada', // Solo considerar asignaciones completadas
            dateAssigned: { $gte: new Date(today) }, // Filtrar por la fecha actual
        })).length || 0; // Obtener la cantidad distinta de técnicos

        // Contar el número total de trabajos asignados y completados
        const totalAssignments = await Assignment.countDocuments(); // Total de asignaciones creadas
        const completedAssignments = await Assignment.countDocuments({ status: 'Completada' }); // Total completadas

        // Calcular el porcentaje de cumplimiento
        const completionRate = totalAssignments > 0 
            ? ((completedAssignments / totalAssignments) * 100).toFixed(2) // Porcentaje redondeado a 2 decimales
            : 0; // Si no hay asignaciones, el porcentaje es 0

        // Obtener el consumo total de materiales utilizando agregación
        const materialUsage = await Assignment.aggregate([
            { $unwind: "$materials" }, // Separar los materiales contenidos en arreglos
            {
                $group: {
                    _id: "$materials.materialId", // Agrupar por ID de material
                    totalUsed: { $sum: "$materials.usedQuantity" }, // Sumar cantidades utilizadas
                },
            },
        ]);

        // Crear un nuevo reporte con los datos generados
        const report = new SystemUsageReport({
            date: new Date(), // Fecha de generación del reporte
            name: `Reporte General ${today}`, // Nombre descriptivo basado en la fecha
            totalUsers, // Total de usuarios registrados
            activeTechnicians, // Técnicos activos
            totalAssignments, // Total de asignaciones
            completedAssignments, // Total de asignaciones completadas
            completionRate, // Porcentaje de cumplimiento
            materialUsage: materialUsage.map(item => ({
                materialId: item._id, // ID del material
                totalUsed: item.totalUsed, // Cantidad total utilizada
            })),
        });

        await report.save(); // Guardar el reporte en la base de datos
        res.status(201).json({ message: 'Reporte generado exitosamente', report }); // Respuesta al cliente
    } catch (error) {
        console.error('Error al generar el reporte:', error); // Log para depuración
        res.status(500).json({ message: 'Error al generar el reporte', error });
    }
};

// Controlador para obtener todos los reportes generales
const getAllSystemUsageReports = async (req, res) => {
    try {
        // Obtener todos los reportes y ordenarlos por fecha descendente
        const reports = await SystemUsageReport.find().sort({ date: -1 });
        res.status(200).json({ message: 'Reportes obtenidos exitosamente', reports }); // Enviar reportes al cliente
    } catch (error) {
        console.error('Error al obtener los reportes:', error); // Log para depuración
        res.status(500).json({ message: 'Error al obtener los reportes', error });
    }
};

const deleteSystemUsageReport = async (req, res) => {
    try {
        // Obtener el ID del reporte a eliminar
        const { id } = req.params;

        // Eliminar el reporte
        await SystemUsageReport.findByIdAndDelete(id);
        res.status(200).json({ message: 'Reporte eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el reporte de uso del sistema:', error);
        res.status(500).json({ message: 'Error al eliminar el reporte', error });
    }
};

module.exports = {
    generateSystemUsageReport,
    getAllSystemUsageReports,
    deleteSystemUsageReport,
};
