import axios from 'axios';

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5100/api', // URL base del backend
  withCredentials: true, // Habilitar el envío de cookies en las solicitudes
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores como token expirado o no autorizado
    if (error.response && error.response.status === 401) {
      console.error('No autorizado o sesión expirada');
      // Opcional: redirigir al login si es necesario
    }
    return Promise.reject(error);
  }
);

export default api;
