import React, { useState, useEffect } from 'react';

const MaterialForm = ({ material, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (material) {
      setName(material.name || '');
      setDescription(material.description || '');
      setQuantity(material.quantity || 0);
    }
  }, [material]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const materialData = { name, description, quantity };
    onSave(materialData);
  };

  return (
    <div>
      <h2>{material ? 'Editar Material' : 'Agregar Material'}</h2>
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
          Descripción:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Cantidad:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default MaterialForm;
