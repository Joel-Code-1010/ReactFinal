import React, { useState, useEffect } from 'react';
import userService from './userService'; // Servicio para interactuar con la API

const UsersList = () => {
  const [users, setUsers] = useState([]); // Estado para almacenar usuarios
  const [error, setError] = useState('');

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers(); // Llamada al servicio
        setUsers(response); // Guardar usuarios en el estado
      } catch (err) {
        setError('Error al cargar los usuarios');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId); // Llamada al servicio para eliminar
      setUsers(users.filter((user) => user.id !== userId)); // Actualizar estado
    } catch (err) {
      setError('Error al eliminar el usuario');
    }
  };

  return (
    <div>
      <h1>Gestión de Usuario</h1>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id || user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>
              <td>
                <button className="table-button edit">Editar</button>
                <button
                  className="table-button delete"
                  onClick={() => handleDelete(user.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
