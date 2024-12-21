const mongoose = require('mongoose');

const systemUsageReportSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true, // Fecha del reporte
    },
    name: {
        type: String,
        required: true, // Nombre del reporte para identificarlo
        trim: true, // Elimina espacios en blanco innecesarios
    },
    totalUsers: {
        type: Number,
        required: true, // Número total de usuarios registrados
    },
    activeTechnicians: {
        type: Number,
        required: true, // Técnicos activos que enviaron reportes hoy
    },
    totalAssignments: {
        type: Number,
        required: true, // Total de trabajos asignados
    },
    completedAssignments: {
        type: Number,
        required: true, // Total de trabajos completados
    },
    completionRate: {
        type: Number,
        required: true, // Porcentaje de cumplimiento (completados / asignados)
    },
    materialUsage: [
        {
            materialId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Material', // Relación con el modelo de materiales
                required: true,
            },
            totalUsed: {
                type: Number,
                required: true, // Cantidad total utilizada de este material
            },
        },
    ],
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

const SystemUsageReport = mongoose.model('SystemUsageReport', systemUsageReportSchema);

module.exports = SystemUsageReport;
