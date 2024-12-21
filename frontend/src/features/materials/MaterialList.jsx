import React, { useState, useEffect } from 'react';
import materialService from './materialService';
import MaterialForm from './MaterialForm';

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]); // Lista filtrada
  const [error, setError] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null); // Para edición
  const [isAdding, setIsAdding] = useState(false);
  const [searchText, setSearchText] = useState(''); // Texto del buscador

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await materialService.getMaterials();
        setMaterials(response);
        setFilteredMaterials(response); // Inicialmente, todos los materiales están en la lista filtrada
      } catch (err) {
        setError('Error al cargar los materiales');
      }
    };

    fetchMaterials();
  }, []);

  // Filtrar materiales cuando el texto de búsqueda cambia
  useEffect(() => {
    const filtered = materials.filter((material) =>
      material.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMaterials(filtered);
  }, [searchText, materials]);

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
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar material por nombre"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
      </div>
      <button className="btnclasico" onClick={() => setIsAdding(true)}>
        Agregar Material
      </button>
      {error && <p className="error-message">{error}</p>}
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
          {filteredMaterials.map((material) => (
            <tr key={material._id}>
              <td>{material.name}</td>
              <td>{material.description}</td>
              <td>{material.quantity}</td>
              <td>
                <button
                  className="btnedit mr-1"
                  onClick={() => setSelectedMaterial(material)}
                >
                  Editar
                </button>
                <button
                  className="btndelite"
                  onClick={() => handleDelete(material._id)}
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

export default MaterialList;
