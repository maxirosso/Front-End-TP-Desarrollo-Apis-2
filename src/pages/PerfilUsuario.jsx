import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
// import LoadingSpinner from '../componentes/LoadingSpinner/LoadingSpinner';
import './PerfilUsuario.css';
import defaultUserImg from '../assets/user-not-photo.jpg';
import { useAuth } from '../contextos/ContextoAuth';

const PerfilUsuario = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    usuarioActual,
    usingBackend,
    usersAPI,
    obtenerResenasPorUsuario,
    eliminarResena,
    toggleLikeResena,
    error,
    setError,
  } = useResenas();
  const { usuario } = useAuth();
  
  const [usuarioViendo, setUsuarioViendo] = useState(null);
  const [resenasUsuario, setResenasUsuario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    sort: 'recent',
    limit: '20',
    offset: '0'
  });

  // Cargar datos del usuario y sus reseñas
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      setCargando(true);
      setError(null);
      
      try {
        // Cargar datos del usuario
        if (usingBackend) {
          try {
            const userData = await usersAPI.getById(userId);
            setUsuarioViendo(userData);
            console.log('Datos del usuario cargados desde backend:', userData);
          } catch (userError) {
            console.error('Error cargando usuario:', userError);
            // Fallback a usuario autenticado si es el mismo
            if (usuario && (usuario.user_id === parseInt(userId) || usuario.id === parseInt(userId))) {
              setUsuarioViendo(usuario);
            } else {
              // Mock user como fallback
              const mockUser = {
                id: parseInt(userId),
                name: `Usuario ${userId}`,
                email: `usuario${userId}@example.com`,
                profile_image: `https://via.placeholder.com/100x100/2C3E50/ECF0F1?text=U${userId}`,
                bio: 'Amante del cine',
                created_at: new Date().toISOString()
              };
              setUsuarioViendo(mockUser);
            }
          }
        } else {
          // Mock data
          const mockUser = {
            id: parseInt(userId),
            name: `Usuario ${userId}`,
            email: `usuario${userId}@example.com`,
            profile_image: `https://via.placeholder.com/100x100/2C3E50/ECF0F1?text=U${userId}`,
            bio: 'Amante del cine',
            created_at: new Date().toISOString()
          };
          setUsuarioViendo(mockUser);
        }

        // Cargar reseñas del usuario
        console.log('Cargando reseñas para usuario:', userId);
        const resenas = await obtenerResenasPorUsuario(userId, filtros);
        console.log('Reseñas obtenidas:', resenas);
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
  }, [userId, usingBackend, usersAPI, obtenerResenasPorUsuario, filtros, setError, usuario]);

  // ✅ NUEVO: Escuchar evento de reseñas actualizadas para recargar automáticamente
  useEffect(() => {
    const manejarResenasActualizadas = async (event) => {
      try {
        const resenas = await obtenerResenasPorUsuario(userId, filtros);
        setResenasUsuario(resenas);
      } catch (err) {
        console.error('Error recargando reseñas del usuario:', err);
      }
    };

    window.addEventListener('resenasActualizadas', manejarResenasActualizadas);

    return () => {
      window.removeEventListener('resenasActualizadas', manejarResenasActualizadas);
    };
  }, [userId, obtenerResenasPorUsuario, filtros]);

  const manejarEliminarResena = async (id) => {
    try {
      await eliminarResena(id);
      setResenasUsuario(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error eliminando reseña:', err);
    }
  };

  const manejarEditarResena = (resena) => {
    navigate(`/crear-resena/${resena.id}?editar=true`);
  };

  const manejarToggleLike = (id) => {
    setResenasUsuario(prev => prev.map(resena => {
      if (resena.id === id) {
        const currentLikes = parseInt(resena.likes_count || resena.likes || 0);
        const isCurrentlyLiked = resena.yaLeDiLike;

        return {
          ...resena,
          yaLeDiLike: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          likes_count: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
        };
      }
      return resena;
    }));

    // También actualizar en el contexto global
    toggleLikeResena(id);
  };

  const manejarCambiarOrdenamiento = (nuevoOrden) => {
    setFiltros(prev => ({ ...prev, sort: nuevoOrden, offset: '0' }));
  };

  if (cargando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Cargando perfil de usuario...
      </div>
    );
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

  if (!usuarioViendo) {
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
      <div className="perfil-usuario">
        <div className="perfil-header">
          <div className="perfil-info">
            <img
              className="perfil-imagen"
              src={usuarioViendo.image_url || usuarioViendo.profile_image || defaultUserImg}
              alt={`Foto de ${usuarioViendo.full_name || usuarioViendo.name || "Usuario"}`}
              onError={e => {
                e.target.onerror = null;
                e.target.src = defaultUserImg;
              }}
            />
            <div className="perfil-detalles">
              <h1 className="perfil-nombre">
                {usuarioViendo.full_name || usuarioViendo.name || `Usuario ${userId}`}
                {usuarioViendo.role && (
                  <span className={`badge-${usuarioViendo.role}`}>{usuarioViendo.role.charAt(0).toUpperCase() + usuarioViendo.role.slice(1)}</span>
                )}
                <span className={`badge-estado ${usuarioViendo.is_active !== false ? "activo" : "inactivo"}`}>
                  {usuarioViendo.is_active !== false ? "Activo" : "Inactivo"}
                </span>
              </h1>
              <div className="perfil-email">{usuarioViendo.email}</div>
            </div>
          </div>
        </div>
       
      </div>

      {/* Estadísticas */}
      {/* <div className="perfil-estadisticas">
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
        </div> 
    </div>*/}

      {/* Controles de reseñas */}
      <div className="resenas-controles">
        <h2>Reseñas de {usuarioViendo.name || `Usuario ${userId}`}</h2>

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
            <p>{usuarioViendo.name || `Usuario ${userId}`} no ha escrito ninguna reseña todavía.</p>
            {(usuarioActual === parseInt(userId) || usuario?.user_id === parseInt(userId) || usuario?.id === parseInt(userId)) && (
              <Link to="/crear-resena" className="btn-crear-primera">
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
                onAbrirComentarios={() => { }} // Implementar si es necesario
                usuarioActual={usuarioActual} // Obtener del contexto de auth
                mostrarAutor={false} // No mostrar autor en perfil del usuario
              />
            ))}
          </div>
        )}
      </div>

      {/* Indicador de conexión */}
      {
        !usingBackend && (
          <div className="modo-offline">
            <p>📱 Modo offline - Usando datos locales</p>
          </div>
        )
      }
    </div >
  );
};

export default PerfilUsuario;
