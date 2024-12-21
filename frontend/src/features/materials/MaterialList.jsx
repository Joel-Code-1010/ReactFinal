import React, { useState, useEffect } from 'react';
import materialService from './materialService';
import MaterialForm from './MaterialForm';

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null); // Para edición
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await materialService.getMaterials();
        setMaterials(response);
      } catch (err) {
        setError('Error al cargar los materiales');
      }
    };

    fetchMaterials();
  }, []);

  const handleDelete = async (materialId) => {
    try {
      await materialService.deleteMaterial(materialId);
      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => material._id !== materialId)
      );
    } catch (err) {
      setError('Error al eliminar el material');
    }
  };

  const handleSave = async (materialData) => {
    try {
      if (selectedMaterial) {
        // Actualizar material
        const updatedMaterial = await materialService.updateMaterial(
          selectedMaterial._id,
          materialData
        );
        setMaterials((prevMaterials) =>
          prevMaterials.map((material) =>
            material._id === updatedMaterial._id ? updatedMaterial : material
          )
        );
      } else {
        // Crear material
        const newMaterial = await materialService.createMaterial(materialData);
        setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
      }
      setIsAdding(false);
      setSelectedMaterial(null);
    } catch (err) {
      setError('Error al guardar el material');
    }
  };

  return (
    <div>
      <h1>Gestión de Materiales</h1>
      <button onClick={() => setIsAdding(true)}>Agregar Material</button>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material._id}>
              <td>{material.name}</td>
              <td>{material.description}</td>
              <td>{material.quantity}</td>
              <td>
                <button onClick={() => setSelectedMaterial(material)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(material._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(isAdding || selectedMaterial) && (
        <MaterialForm
          material={selectedMaterial}
          onSave={handleSave}
          onCancel={() => {
            setIsAdding(false);
            setSelectedMaterial(null);
          }}
        />
      )}
    </div>
  );
};

export default MaterialList;
