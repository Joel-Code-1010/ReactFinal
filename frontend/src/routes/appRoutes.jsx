import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import DashboardAdmin from '../pages/dashboardAdmin';
import DashboardTecnico from '../pages/dashboardTecnico';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Cargando...</p>; // Mostrar un indicador mientras se verifica el estado

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute roles={['Administrador']}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-tecnico"
          element={
            <ProtectedRoute roles={['Tecnico']}>
              <DashboardTecnico />
            </ProtectedRoute>
          }
        />

        {/* Redirección a Login como predeterminado */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
