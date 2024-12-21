import api from '../../api/api';

// Obtener todos los usuarios
const getUsers = async () => {
  const response = await api.get('/users/all'); // Ruta correcta
  return response.data; // Devuelve los datos de los usuarios
};

// Eliminar un usuario
const deleteUser = async (userId) => {
  await api.delete(`/users/delete/${userId}`); // Ajusta según la ruta de eliminación
};

const userService = {
  getUsers,
  deleteUser,
};

export default userService;
