import api from '../../api/api';

const getMaterials = async () => {
  const response = await api.get('/materials/all');
  return response.data;
};

const createMaterial = async (materialData) => {
  const response = await api.post('/materials/create', materialData);
  return response.data;
};

const updateMaterial = async (materialId, materialData) => {
  const response = await api.put(`/materials/update/${materialId}`, materialData);
  return response.data;
};

const deleteMaterial = async (materialId) => {
  await api.delete(`/materials/delete/${materialId}`);
};

const materialService = {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};

export default materialService;
