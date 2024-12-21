import api from '../../api/api';

// Obtener todos los usuarios
const getUsers = async () => {
  try {
    const response = await api.get('/users/all'); // Ruta correcta
    return response.data; // Devuelve los datos de los usuarios
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.response || error.message);
    throw new Error('No se pudieron cargar los usuarios.');
  }
};

// Eliminar un usuario
const deleteUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('ID de usuario no proporcionado');
    }
    await api.delete(`/users/delete/${userId}`); // Asegúrate de incluir el ID
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.response || error.message);
    throw new Error('No se pudo eliminar el usuario.');
  }
};

// Actualizar un usuario
const updateUser = async (userId, updatedData) => {
  try {
    const response = await api.put(`/users/update/${userId}`, updatedData); // Ajusta la ruta
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error.response || error.message);
    throw new Error('No se pudo actualizar el usuario.');
  }
};

// Crear un nuevo usuario
const createUser = async (newUser) => {
  try {
    const response = await api.post('/users/create', newUser); // Ajusta la ruta según el backend
    return response.data;
  } catch (error) {
    console.error('Error al crear el usuario:', error.response || error.message);
    throw new Error('No se pudo crear el usuario.');
  }
};

const userService = {
  getUsers,
  deleteUser,
  updateUser,
  createUser, // Nuevo método para crear usuarios
};

export default userService;
