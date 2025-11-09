import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './BarraNavegacion.css';

const BarraNavegacion = () => {
  // const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, estaAutenticado, logout, getFullName, getUserInitials, formatRole } = useAuth();

  // const manejarBusqueda = (evento) => {
  //   setTerminoBusqueda(evento.target.value);
  // };

  // const enviarBusqueda = (evento) => {
  //   evento.preventDefault();
  //   if (terminoBusqueda.trim()) {
  //     // Navegar a la página de resultados con el término de búsqueda
  //     navigate(`/?busqueda=${encodeURIComponent(terminoBusqueda.trim())}`);
  //   }
  // };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // No mostrar la barra de navegación en la página de login
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="barra-navegacion">
      <div className="contenedor-navegacion">
        {/* Logo y nombre */}
        <Link to="/" className="logo-contenedor">
          <div className="logo-triangulos">
            <div className="triangulo triangulo-rojo"></div>
            <div className="triangulo triangulo-cyan"></div>
          </div>
          <h1 className="nombre-aplicacion">cineTrack</h1>
        </Link>

        {/* Menú de navegación */}
        {estaAutenticado() && (
          <>
            <ul className="menu-navegacion">
              <li><Link to="/usuario" className="enlace-navegacion">USUARIO</Link></li>
              <li><Link to="/peliculas" className="enlace-navegacion">FILMS</Link></li>
            </ul>

            {/* Botón de crear reseña */}
            <Link to="/crear" className="boton-crear-resena-nav">
              ✏️ ESCRIBIR RESEÑA
            </Link>

            {/* Menú de usuario autenticado */}
            <div className="usuario-menu-container">
              <button
                className="usuario-avatar-btn"
                onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
                title={getFullName()}
              >
                <div className="usuario-avatar">
                  {usuario?.image_url ? (
                    <img src={usuario.image_url} alt={getFullName()} />
                  ) : (
                    <span className="usuario-iniciales">{getUserInitials()}</span>
                  )}
                </div>
                <div className="usuario-info">
                  <span className="usuario-nombre">{getFullName()}</span>
                  <span className={`usuario-rol badge ${usuario?.role}`}>
                    {formatRole()}
                  </span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>

              {mostrarMenuUsuario && (
                <>
                  <div
                    className="overlay-menu"
                    onClick={() => setMostrarMenuUsuario(false)}
                  ></div>
                  <div className="dropdown-menu-usuario">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {usuario?.image_url ? (
                          <img src={usuario.image_url} alt={getFullName()} />
                        ) : (
                          <span className="dropdown-iniciales">{getUserInitials()}</span>
                        )}
                      </div>
                      <div className="dropdown-info">
                        <strong>{getFullName()}</strong>
                        <small>{usuario?.email}</small>
                        <span className={`badge-rol badge-${usuario?.role}`}>
                          {formatRole()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                  
                    
                    <div className="dropdown-divider"></div>
                    
                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        setMostrarMenuUsuario(false);
                        handleLogout();
                      }}
                    >
                      <span className="dropdown-icon">🚪</span>
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Si no está autenticado, mostrar botón de login */}
        {!estaAutenticado() && (
          <Link to="/login" className="boton-login-nav">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BarraNavegacion;
