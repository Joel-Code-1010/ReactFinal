import React, { useState, useEffect } from 'react';
import reportService from './reportService';

const ReportsList = () => {
  const [systemReports, setSystemReports] = useState([]);
  const [technicianReports, setTechnicianReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const systemReportsData = await reportService.getAllSystemUsageReports();
        const technicianReportsData = await reportService.getAllTechnicianPerformanceReports();
        setSystemReports(systemReportsData);
        setTechnicianReports(technicianReportsData);
      } catch (err) {
        setError('Error al cargar los reportes');
      }
    };

    fetchReports();
  }, []);

  const handleDeleteSystemReport = async (reportId) => {
    try {
      await reportService.deleteSystemUsageReport(reportId);
      setSystemReports((prevReports) =>
        prevReports.filter((report) => report._id !== reportId)
      );
    } catch (err) {
      setError('Error al eliminar el reporte del sistema');
    }
  };

  const handleDeleteTechnicianReport = async (reportId) => {
    try {
      await reportService.deleteTechnicianPerformanceReport(reportId);
      setTechnicianReports((prevReports) =>
        prevReports.filter((report) => report._id !== reportId)
      );
    } catch (err) {
      setError('Error al eliminar el reporte de técnico');
    }
  };

  return (
    <div>
      <h1>Historial de Reportes</h1>
      {error && <p className="error-message">{error}</p>}

      <h2>Reportes Generales del Sistema</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total Usuarios</th>
            <th>Técnicos Activos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {systemReports.map((report) => (
            <tr key={report._id}>
              <td>{new Date(report.createdAt).toLocaleDateString()}</td>
              <td>{report.totalUsers}</td>
              <td>{report.activeTechnicians}</td>
              <td>
                <button
                  className="btndelite"
                  onClick={() => handleDeleteSystemReport(report._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Reportes de Desempeño Técnico</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Técnico Más Activo</th>
            <th>Materiales Usados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {technicianReports.map((report) => (
            <tr key={report._id}>
              <td>{new Date(report.createdAt).toLocaleDateString()}</td>
              <td>{report.topTechnician}</td>
              <td>{report.totalMaterialsUsed}</td>
              <td>
                <button
                  className="btndelite"
                  onClick={() => handleDeleteTechnicianReport(report._id)}
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

export default ReportsList;
