import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { loginUser } from './authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuthContext(); // Acceso al contexto de autenticación
  const navigate = useNavigate(); // Navegación programática

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores anteriores

    try {
      const response = await loginUser(email, password); // Llama al backend
      const decodedToken = jwtDecode(response.token); // Decodifica el token

      setUser(decodedToken); // Actualiza el contexto con los datos del usuario

      // Redirige según el rol del usuario
      if (decodedToken.rol === 'Administrador') {
        navigate('/dashboard-admin');
      } else if (decodedToken.rol === 'Tecnico') {
        navigate('/dashboard-tecnico');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
