import api from '../../api/api';

// Obtener todos los reportes generales del sistema
const getAllSystemUsageReports = async () => {
  const response = await api.get('/reports/system-usage/all');
  return response.data;
};

// Eliminar un reporte general del sistema
const deleteSystemUsageReport = async (reportId) => {
  await api.delete(`/reports/system-usage/${reportId}`);
};

// Obtener todos los reportes de desempeño técnico
const getAllTechnicianPerformanceReports = async () => {
  const response = await api.get('/reports/technician-performance');
  return response.data;
};

// Eliminar un reporte de desempeño técnico
const deleteTechnicianPerformanceReport = async (reportId) => {
  await api.delete(`/reports/technician-performance/${reportId}`);
};

const reportService = {
  getAllSystemUsageReports,
  deleteSystemUsageReport,
  getAllTechnicianPerformanceReports,
  deleteTechnicianPerformanceReport,
};

export default reportService;
