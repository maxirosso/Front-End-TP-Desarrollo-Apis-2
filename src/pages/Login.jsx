import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contextos/ContextoAuth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, estaAutenticado, cargando, error, setError } = useAuth();

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (estaAutenticado()) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [estaAutenticado, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al cambiar los campos
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!credentials.username || !credentials.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await login(credentials);

      // Redirigir a la página de origen o al inicio
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  // Usuarios de prueba para mostrar en la UI (basados en la información proporcionada)
  const usuariosPrueba = [
    { username: 'claqueta_critica', rol: 'Admin - Gestión completa (usuarios, películas, comentarios)' },
    { username: 'filmfan_madriz', rol: 'Admin - Gestión de usuarios y películas' },
    { username: 'terror_nocturno', rol: 'Admin - Gestión de usuarios y películas' },
    { username: 'scifilms_explorer', rol: 'Moderador - Gestión de comentarios' },
    { username: 'indie_soul', rol: 'Moderador - Gestión de comentarios' },
    { username: 'noir_detective', rol: 'Moderador - Gestión de comentarios' },
    { username: 'docu_traveler', rol: 'Usuario estándar' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎬 MovieReviews</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="tu_usuario"
              autoComplete="username"
              required
              disabled={isLoading || cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={isLoading || cargando}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || cargando}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-login"
            disabled={isLoading || cargando}
          >
            {isLoading || cargando ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>

        {/* Información de usuarios de prueba */}
        <div className="usuarios-prueba">
          <h3>📝 Usuarios de prueba disponibles:</h3>
          <p className="password-info">🔑 <strong>Contraseña para todos:</strong> MiPassword123!</p>
          <div className="usuarios-lista">
            {usuariosPrueba.map((usuario, index) => (
              <div key={index} className="usuario-prueba-item">
                <span className="usuario-email">{usuario.username}</span>
                <span className="usuario-rol">{usuario.rol}</span>
              </div>
            ))}
          </div>
          <p className="nota-prueba">
            <strong>Nota:</strong> Hay más de 50 usuarios disponibles. Consulta usuarios.json para la lista completa.
          </p>
        </div>
      </div>

      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
    </div>
  );
};

export default Login;
