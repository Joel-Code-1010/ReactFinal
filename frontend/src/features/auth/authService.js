import api from '../../api/api';

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Retorna el mensaje y el token si es necesario
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Error al iniciar sesión' };
  }
};

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data; // Retorna el mensaje de éxito
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Error al cerrar sesión' };
  }
};

// Función para verificar el estado de autenticación
export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/auth/status');
    return response.data.user; // Retorna la información del usuario autenticado
  } catch (error) {
    throw error.response ? error.response.data : { message: 'No autenticado' };
  }
};
