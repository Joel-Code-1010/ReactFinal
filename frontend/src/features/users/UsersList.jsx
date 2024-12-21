import React, { useState, useEffect } from 'react';
import userService from './userService'; // Servicio para interactuar con la API
import UserForm from './UserForm'; // Componente para el formulario

const UsersList = () => {
  const [users, setUsers] = useState([]); // Estado para almacenar usuarios
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null); // Estado para rastrear el usuario que se está editando
  const [isAdding, setIsAdding] = useState(false); // Estado para controlar la vista de agregar usuario

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
      await userService.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      setError('Error al eliminar el usuario');
    }
  };

  const handleEditChange = (e, field, userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, [field]: e.target.value } : user
      )
    );
  };

  const saveEdit = async (userId) => {
    const userToSave = users.find((user) => user._id === userId);
    try {
      await userService.updateUser(userId, userToSave); // Actualiza el usuario en el backend
      setEditingUserId(null); // Termina la edición
    } catch (err) {
      setError('Error al guardar los cambios');
    }
  };

  const handleSaveNewUser = async (newUser) => {
    try {
      const createdUser = await userService.createUser(newUser); // Llamada al servicio para crear usuario
      setUsers((prevUsers) => [...prevUsers, createdUser]); // Agrega el nuevo usuario a la lista
      setIsAdding(false); // Cierra el formulario
    } catch (err) {
      setError('Error al crear el usuario');
    }
  };

  return (
    <div>
      <h1>Gestión de Usuario</h1>
      <button onClick={() => setIsAdding(true)} className="add-button">Agregar Nuevo Usuario</button>
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
            <tr key={user._id}>
              <td>
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => handleEditChange(e, 'name', user._id)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user._id ? (
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleEditChange(e, 'email', user._id)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user._id ? (
                  <select
                    value={user.role}
                    onChange={(e) => handleEditChange(e, 'role', user._id)}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Tecnico">Técnico</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUserId === user._id ? (
                  <>
                    <button
                      className="table-button save"
                      onClick={() => saveEdit(user._id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="table-button cancel"
                      onClick={() => setEditingUserId(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="table-button edit"
                      onClick={() => setEditingUserId(user._id)}
                    >
                      Editar
                    </button>
                    <button
                      className="table-button delete"
                      onClick={() => handleDelete(user._id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAdding && (
        <UserForm
          onSave={handleSaveNewUser}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
