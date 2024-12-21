const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            'Por favor, ingrese un email válido en el formato nombre@gmail.com',
        ],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [5, 'La contraseña debe tener al menos 5 caracteres'],
    },
    role: {
        type: String,
        enum: ['Administrador', 'Tecnico'],
        required: [true, 'El rol es requerido'],
        default: 'Tecnico',
    },
    status: {
        type: Boolean,
        default: true,
    },

}, {
    timestamps: true,
});

// Encrypt the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to verify the password
userSchema.methods.verifyPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
