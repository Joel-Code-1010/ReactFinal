import api from '../../api/api';

// Obtener todas las asignaciones
const getAllAssignments = async () => {
  try {
    const response = await api.get('/assignments/all');
    return response.data; // Devuelve las asignaciones obtenidas
  } catch (error) {
    console.error('Error al obtener las asignaciones:', error.response || error.message);
    throw new Error('No se pudieron cargar las asignaciones.');
  }
};

// Crear una nueva asignación
const createAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/assignments/create', assignmentData);
    return response.data; // Devuelve la asignación creada
  } catch (error) {
    console.error('Error al crear la asignación:', error.response || error.message);
    throw new Error('No se pudo crear la asignación.');
  }
};

const assignmentService = {
  getAllAssignments,
  createAssignment,
};

export default assignmentService;
