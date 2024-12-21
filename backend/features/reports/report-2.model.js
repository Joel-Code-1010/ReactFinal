const mongoose = require('mongoose');

const technicianPerformanceReportSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true, // Fecha del reporte
    },
    name: {
        type: String,
        required: true, // Nombre del reporte para identificarlo
        trim: true, // Elimina espacios innecesarios
    },
    topTechnician: {
        technicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Referencia al modelo de usuarios
        },
        completedAssignments: {
            type: Number, // Número de asignaciones completadas por el técnico
        },
    },
    topMaterialConsumer: {
        technicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Referencia al modelo de usuarios
        },
        totalMaterialsUsed: {
            type: Number, // Total de materiales utilizados por el técnico
        },
    },
    technicianStatistics: [
        {
            technicianId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Referencia al modelo de usuarios
                required: true,
            },
            assignedTasks: {
                type: Number, // Total de tareas asignadas al técnico
                required: true,
            },
            completedTasks: {
                type: Number, // Total de tareas completadas por el técnico
                required: true,
            },
            materialsUsed: [
                {
                    materialId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Material', // Referencia al modelo de materiales
                    },
                    quantityUsed: {
                        type: Number, // Cantidad utilizada del material
                    },
                },
            ],
        },
    ],
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

const TechnicianPerformanceReport = mongoose.model('TechnicianPerformanceReport', technicianPerformanceReportSchema);

module.exports = TechnicianPerformanceReport;
