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
      <form className='formulario' onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input className='search-input'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        
        <label>
          Descripción:
          <input className='search-input'
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        
        <label className='mr-1 '>
          Cantidad:
          <input className='search-input'
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>
        <div>
            <button className='btnedit mr-1 mt-1' type="submit">Guardar</button>
        <button className='btndelite' type="button" onClick={onCancel}>
          Cancelar
        </button>
        </div>
        
      </form>
    </div>
  );
};

export default MaterialForm;
