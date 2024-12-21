import { createContext, useState, useContext, useEffect } from 'react';
import { checkAuthStatus, logoutUser } from '../features/auth/authService';

const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const [loading, setLoading] = useState(true); // Estado para controlar la carga inicial

  // Verificar el estado de autenticación al cargar la aplicación
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        setUser(userData); // Actualizar el estado con los datos del usuario
      } catch {
        setUser(null); // Si falla, no hay usuario autenticado
      } finally {
        setLoading(false); // Finaliza la carga inicial
      }
    };

    verifyAuth();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null); // Elimina el usuario del estado
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children} {/* Renderiza los hijos solo después de cargar */}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuthContext = () => {
  return useContext(AuthContext);
};
