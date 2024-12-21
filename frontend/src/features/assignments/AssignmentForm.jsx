import React, { useState, useEffect } from 'react';
import materialService from '../materials/materialService';
import userService from '../users/userService';

const AssignmentForm = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [materials, setMaterials] = useState([{ materialId: '', quantity: 1 }]);
  const [dateAssigned, setDateAssigned] = useState('');
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    // Fetch available materials and technicians
    const fetchData = async () => {
      try {
        const materialsResponse = await materialService.getMaterials();
        const usersResponse = await userService.getUsers();
        setAvailableMaterials(materialsResponse);
        setTechnicians(usersResponse.filter((user) => user.role === 'Tecnico')); // Filtrar solo técnicos
      } catch (err) {
        console.error('Error al cargar materiales o técnicos:', err);
      }
    };

    fetchData();
  }, []);

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
  };

  const addMaterial = () => {
    setMaterials([...materials, { materialId: '', quantity: 1 }]);
  };

  const removeMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, technicianId, materials, dateAssigned });
  };

  return (
    <div className="assignment-form">
      <h2>Crear Nueva Asignación</h2>
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
          Técnico:
          <select
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            required
          >
            <option value="">Seleccionar Técnico</option>
            {technicians.map((tech) => (
              <option key={tech._id} value={tech._id}>
                {tech.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Fecha Asignada:
          <input
            type="date"
            value={dateAssigned}
            onChange={(e) => setDateAssigned(e.target.value)}
            required
          />
        </label>
        <div>
          <h3>Materiales</h3>
          {materials.map((material, index) => (
            <div key={index} className="material-input">
              <select
                value={material.materialId}
                onChange={(e) => handleMaterialChange(index, 'materialId', e.target.value)}
                required
              >
                <option value="">Seleccionar Material</option>
                {availableMaterials.map((mat) => (
                  <option key={mat._id} value={mat._id}>
                    {mat.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Cantidad"
                value={material.quantity}
                onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                required
                min="1"
              />
              <button type="button" onClick={() => removeMaterial(index)}>
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={addMaterial}>
            Añadir Material
          </button>
        </div>
        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
