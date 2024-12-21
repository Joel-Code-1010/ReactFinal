const mongoose = require('mongoose');

// Definición del esquema de asignaciones
const assignmentSchema = new mongoose.Schema({
    name: {
        type: String, // Nombre descriptivo de la asignación
        required: true, // Este campo es obligatorio
        trim: true // Elimina espacios en blanco al inicio y final del texto
    },
    technicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relación con el modelo de usuarios para identificar al técnico asignado
        required: true // Este campo es obligatorio
    },
    materials: [
        {
            materialId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Material', // Relación con el modelo de materiales para identificar el material asignado
                required: true // Este campo es obligatorio
            },
            quantity: {
                type: Number, // Cantidad de material asignado
                required: true, // Este campo es obligatorio
                min: [1, 'La cantidad debe ser al menos 1'] // Validación para asegurar cantidades positivas
            },
            usedQuantity: {
                type: Number, // Cantidad de material utilizado
                default: 0, // Inicialmente 0 hasta que el técnico lo actualice
                min: [0, 'La cantidad utilizada no puede ser negativa'] // Validación para evitar valores inválidos
            }
        }
    ],
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relación con el modelo de usuarios para identificar al administrador que asignó los materiales
        required: true // Este campo es obligatorio
    },
    dateAssigned: {
        type: Date, // Fecha en la que se realizó la asignación
        default: Date.now // Valor predeterminado: fecha y hora actuales
    },
    status: {
        type: String, // Estado de la asignación
        enum: ['Pendiente', 'Completada'], // Valores permitidos para el estado
        default: 'Pendiente' // Valor predeterminado
    }
}, {
    timestamps: true // Agrega automáticamente los campos createdAt y updatedAt al documento
});

// Crear el modelo Assignment basado en el esquema definido
const Assignment = mongoose.model('Assignment', assignmentSchema);

// Exportar el modelo para usarlo en otras partes del proyecto
module.exports = Assignment;
