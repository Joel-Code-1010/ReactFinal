import React, { useState } from 'react';

const UserForm = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Tecnico');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, email, password, role };
    onSave(newUser); // Llama la función para guardar el nuevo usuario
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Agregar Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Rol:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Administrador">Administrador</option>
              <option value="Tecnico">Técnico</option>
            </select>
          </label>
          <div className="form-actions">
            <button type="submit" className="save-button">Guardar</button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
