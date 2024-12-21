const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del material es obligatorio'],
        unique: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad del material es obligatoria'],
        min: [0, 'La cantidad no puede ser negativa']
    },
    description: {
        type: String,
        trim: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relación con el modelo de usuarios
        required: [true, 'El ID del administrador es obligatorio']
    }
}, {
    timestamps: true // Agrega campos createdAt y updatedAt automáticamente
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
