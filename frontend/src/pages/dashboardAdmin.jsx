import React, { useState } from 'react';
import Usuarios from '../features/users/UsersList';
import Materiales from '../features/materials/MaterialList';
import Asignaciones from '../features/assignments/AssignmentsList';
import Reportes from '../features/reports/ReportsList';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashAdmin.css';


const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState('Usuarios'); // Estado para la vista dinámica
  const { logout } = useAuthContext(); // Función de logout desde el contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Renderiza la vista dinámica según la sección seleccionada
  const renderSection = () => {
    switch (activeSection) {
      case 'Usuarios':
        return <Usuarios />;
      case 'Materiales':
        return <Materiales />;
      case 'Asignaciones':
        return <Asignaciones />;
      case 'Reportes':
        return <Reportes />;
      default:
        return <Usuarios />;
    }
  };

  return (
    <div>
      <nav className="navbar">
        <button onClick={() => setActiveSection('Usuarios')}>Usuarios</button>
        <button onClick={() => setActiveSection('Materiales')}>Materiales</button>
        <button onClick={() => setActiveSection('Asignaciones')}>Asignaciones</button>
        <button onClick={() => setActiveSection('Reportes')}>Reportes</button>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </nav>
      <main>{renderSection()}</main>
    </div>
  );
};

export default DashboardAdmin;
