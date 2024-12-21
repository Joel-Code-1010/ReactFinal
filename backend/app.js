const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db.config');

dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Cambia esto según la URL de tu frontend
    credentials: true
}));

// Rutas
app.use('/api/users/', require('./features/users/user.routes'));
app.use('/api/auth/', require('./features/auth/auth.routes'));
app.use('/api/materials/', require('./features/materials/material.routes'));
app.use('/api/assignments/', require('./features/assignments/assignment.routes'));
app.use('/api/reports/', require('./features/reports/report.routes'))

module.exports = app;
