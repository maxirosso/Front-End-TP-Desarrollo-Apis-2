import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import LoadingSpinner from '../componentes/LoadingSpinner/LoadingSpinner';
import './PerfilUsuario.css';

const PerfilUsuario = () => {
  const { userId } = useParams();
  const {
    usingBackend,
    usersAPI,
    obtenerResenasPorUsuario,
    eliminarResena,
    toggleLikeResena,
    error,
    setError
  } = useResenas();

  const [usuario, setUsuario] = useState(null);
  const [resenasUsuario, setResenasUsuario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    sort: 'recent',
    limit: '20',
    offset: '0'
  });

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      setCargando(true);
      setError(null);

      try {
        // Cargar datos del usuario
        if (usingBackend) {
          try {
            const userData = await usersAPI.getById(userId);
            setUsuario(userData);
          } catch (userError) {
            // Fallback a datos mock si el usuario no existe en backend
            const mockUser = {
              id: parseInt(userId),
              name: userId === '1' ? 'Admin' : 
                    userId === '2' ? 'Juan Pérez' :
                    userId === '3' ? 'María García' :
                    userId === '4' ? 'Carlos López' :
                    userId === '5' ? 'Ana Martín' :
                    userId === '6' ? 'Luis Rodríguez' : `Usuario ${userId}`,
              email: userId === '1' ? 'admin@moviereviews.com' :
                     userId === '2' ? 'juan@example.com' :
                     userId === '3' ? 'maria@example.com' :
                     userId === '4' ? 'carlos@example.com' :
                     userId === '5' ? 'ana@example.com' :
                     userId === '6' ? 'luis@example.com' : `usuario${userId}@example.com`,
              profile_image: `https://via.placeholder.com/100x100/2C3E50/ECF0F1?text=U${userId}`,
              bio: userId === '1' ? 'Administrador del sistema de reseñas' :
                   userId === '2' ? 'Amante del cine y crítico ocasional' :
                   userId === '3' ? 'Especialista en ciencia ficción' :
                   userId === '4' ? 'Crítico profesional de cine' :
                   userId === '5' ? 'Fan de películas de acción' :
                   userId === '6' ? 'Cinéfilo y coleccionista' : 'Amante del cine',
              created_at: '2025-09-01T10:00:00Z'
            };
            setUsuario(mockUser);
          }
        } else {
          // Mock data para usuarios
          const mockUser = {
            id: parseInt(userId),
            name: userId === '1' ? 'Admin' : 
                  userId === '2' ? 'Juan Pérez' :
                  userId === '3' ? 'María García' :
                  userId === '4' ? 'Carlos López' :
                  userId === '5' ? 'Ana Martín' :
                  userId === '6' ? 'Luis Rodríguez' : `Usuario ${userId}`,
            email: userId === '1' ? 'admin@moviereviews.com' :
                   userId === '2' ? 'juan@example.com' :
                   userId === '3' ? 'maria@example.com' :
                   userId === '4' ? 'carlos@example.com' :
                   userId === '5' ? 'ana@example.com' :
                   userId === '6' ? 'luis@example.com' : `usuario${userId}@example.com`,
            profile_image: `https://via.placeholder.com/100x100/2C3E50/ECF0F1?text=U${userId}`,
            bio: userId === '1' ? 'Administrador del sistema de reseñas' :
                 userId === '2' ? 'Amante del cine y crítico ocasional' :
                 userId === '3' ? 'Especialista en ciencia ficción' :
                 userId === '4' ? 'Crítico profesional de cine' :
                 userId === '5' ? 'Fan de películas de acción' :
                 userId === '6' ? 'Cinéfilo y coleccionista' : 'Amante del cine',
            created_at: '2025-09-01T10:00:00Z'
          };
          setUsuario(mockUser);
        }

        // Cargar reseñas del usuario
        const resenas = await obtenerResenasPorUsuario(userId, filtros);
        setResenasUsuario(resenas);

      } catch (err) {
        console.error('Error cargando perfil de usuario:', err);
        setError(`Error cargando perfil: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };

    if (userId) {
      cargarDatosUsuario();
    }
  }, [userId, usingBackend, usersAPI, obtenerResenasPorUsuario, filtros, setError]);

  const manejarEliminarResena = async (id) => {
    try {
      await eliminarResena(id);
      setResenasUsuario(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error eliminando reseña:', err);
    }
  };

  const manejarEditarResena = (resena) => {
    window.location.href = `/editar/${resena.id}`;
  };

  const manejarToggleLike = (id) => {
    toggleLikeResena(id);
    setResenasUsuario(prev => prev.map(resena => {
      if (resena.id === id) {
        return {
          ...resena,
          yaLeDiLike: !resena.yaLeDiLike,
          likes: resena.yaLeDiLike ? resena.likes - 1 : resena.likes + 1
        };
      }
      return resena;
    }));
  };

  const manejarCambiarOrdenamiento = (nuevoOrden) => {
    setFiltros(prev => ({ ...prev, sort: nuevoOrden, offset: '0' }));
  };

  if (cargando) {
    return <LoadingSpinner mensaje="Cargando perfil de usuario..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn-volver">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="usuario-no-encontrado">
        <h2>Usuario no encontrado</h2>
        <p>El usuario que buscas no existe o ha sido eliminado.</p>
        <Link to="/" className="btn-volver">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="perfil-usuario">
      {/* Header del perfil */}
      <div className="perfil-header">
        <div className="perfil-info">
          <img 
            src={usuario.profile_image} 
            alt={`Perfil de ${usuario.name}`}
            className="perfil-imagen"
          />
          <div className="perfil-detalles">
            <h1 className="perfil-nombre">{usuario.name}</h1>
            <p className="perfil-email">{usuario.email}</p>
            {usuario.bio && <p className="perfil-bio">{usuario.bio}</p>}
            <p className="perfil-fecha">
              Miembro desde {new Date(usuario.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="perfil-estadisticas">
          <div className="estadistica">
            <span className="numero">{resenasUsuario.length}</span>
            <span className="etiqueta">RESEÑAS</span>
          </div>
          <div className="estadistica">
            <span className="numero">
              {resenasUsuario.reduce((total, r) => total + parseInt(r.likes_count || r.likes || 0), 0)}
            </span>
            <span className="etiqueta">LIKES RECIBIDOS</span>
          </div>
          <div className="estadistica">
            <span className="numero">
              {resenasUsuario.length > 0 
                ? (resenasUsuario.reduce((total, r) => total + (r.rating || r.calificacion || 0), 0) / resenasUsuario.length).toFixed(1)
                : '0'
              }
            </span>
            <span className="etiqueta">RATING PROMEDIO</span>
          </div>
        </div>
      </div>

      {/* Controles de reseñas */}
      <div className="resenas-controles">
        <h2>Reseñas de {usuario.name}</h2>
        
        <div className="ordenamiento-perfil">
          <label htmlFor="orden-select">Ordenar por:</label>
          <select 
            id="orden-select"
            value={filtros.sort} 
            onChange={(e) => manejarCambiarOrdenamiento(e.target.value)}
            className="select-ordenamiento"
          >
            <option value="recent">Más recientes</option>
            <option value="rating_desc">Mayor puntuación</option>
            <option value="rating_asc">Menor puntuación</option>
          </select>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="resenas-usuario">
        {resenasUsuario.length === 0 ? (
          <div className="sin-resenas">
            <div className="icono-vacio">📝</div>
            <h3>Sin reseñas aún</h3>
            <p>{usuario.name} no ha escrito ninguna reseña todavía.</p>
            {userId === '1' && ( // Solo mostrar botón si es el usuario actual
              <Link to="/crear" className="btn-crear-primera">
                Escribir primera reseña
              </Link>
            )}
          </div>
        ) : (
          <div className="lista-resenas-usuario">
            {resenasUsuario.map(resena => (
              <TarjetaResena 
                key={resena.id} 
                pelicula={resena}
                onEliminar={manejarEliminarResena}
                onEditar={manejarEditarResena}
                onToggleLike={manejarToggleLike}
                onAbrirComentarios={() => {}} // Implementar si es necesario
                usuarioActual="usuario_actual" // Obtener del contexto de auth
                mostrarAutor={false} // No mostrar autor en perfil del usuario
              />
            ))}
          </div>
        )}
      </div>

      {/* Indicador de conexión */}
      {!usingBackend && (
        <div className="modo-offline">
          <p>📱 Modo offline - Usando datos locales</p>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;
