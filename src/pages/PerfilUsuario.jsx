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
    // usersAPI,
    obtenerResenasPorUsuario,
    eliminarResena,
    toggleLikeResena,
    error,
    // setError,
    // setUsuarioActual  // ✅ Agregar setUsuarioActual del contexto
  } = useResenas();
    const { usuario } = useAuth();
  

  // const [usuario, setUsuario] = useState(null);
  const [resenasUsuario, setResenasUsuario] = useState([]);
  // const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    sort: 'recent',
    limit: '20',
    offset: '0'
  });

  // ✅ FIX: Sincronizar usuario actual del contexto con userId de la URL
  // useEffect(() => {
  //   debugger;
  //   if (userId && parseInt(userId) !== usuarioActual) {
  //     setUsuarioActual(parseInt(userId));
  //   }
  // }, [userId, usuarioActual, setUsuarioActual]);

  // useEffect(() => {
  //   const cargarDatosUsuario = async () => {
  //     setCargando(true);
  //     setError(null);
  //     debugger;
  //     try {
  //       // Cargar datos del usuario
  //       debugger;
  //       if (usingBackend) {
  //         try {
  //           debugger;
  //           const userData = await usersAPI.getById(userId);
  //           setUsuario(userData);

  //           console.log('Datos del usuario cargados desde backend:', userData);
  //         } catch (userError) {
  //           // Fallback a datos mock si el usuario no existe en backend
  //           const mockUser = {
  //             id: parseInt(userId),
  //             name: userId === '1' ? 'Admin' :
  //               userId === '2' ? 'Juan Pérez' :
  //                 userId === '3' ? 'María García' :
  //                   userId === '4' ? 'Carlos López' :
  //                     userId === '5' ? 'Ana Martín' :
  //                       userId === '6' ? 'Luis Rodríguez' : `Usuario ${userId}`,
  //             email: userId === '1' ? 'admin@moviereviews.com' :
  //               userId === '2' ? 'juan@example.com' :
  //                 userId === '3' ? 'maria@example.com' :
  //                   userId === '4' ? 'carlos@example.com' :
  //                     userId === '5' ? 'ana@example.com' :
  //                       userId === '6' ? 'luis@example.com' : `usuario${userId}@example.com`,
  //             profile_image: `https://via.placeholder.com/100x100/2C3E50/ECF0F1?text=U${userId}`,
  //             bio: userId === '1' ? 'Administrador del sistema de reseñas' :
  //               userId === '2' ? 'Amante del cine y crítico ocasional' :
  //                 userId === '3' ? 'Especialista en ciencia ficción' :
  //                   userId === '4' ? 'Crítico profesional de cine' :
  //                     userId === '5' ? 'Fan de películas de acción' :
  //                       userId === '6' ? 'Cinéfilo y coleccionista' : 'Amante del cine',
  //             created_at: '2025-09-01T10:00:00Z'
  //           };
  //           setUsuario(mockUser);
  //         }
  //       } else {
  //         // Mock data para usuarios
  //         const mockUser = {
  //           id: parseInt(userId),
  //           name: userId === '1' ? 'Admin' :
  //             userId === '2' ? 'Juan Pérez' :
  //               userId === '3' ? 'María García' :
  //                 userId === '4' ? 'Carlos López' :
  //                   userId === '5' ? 'Ana Martín' :
  //                     userId === '6' ? 'Luis Rodríguez' : `Usuario ${userId}`,
  //           email: userId === '1' ? 'admin@moviereviews.com' :
  //             userId === '2' ? 'juan@example.com' :
  //               userId === '3' ? 'maria@example.com' :
  //                 userId === '4' ? 'carlos@example.com' :
  //                   userId === '5' ? 'ana@example.com' :
  //                     userId === '6' ? 'luis@example.com' : `usuario${userId}@example.com`,
  //           profile_image: `https://via.placeholder.com/100x100/2C3E50/ECF0F1?text=U${userId}`,
  //           bio: userId === '1' ? 'Administrador del sistema de reseñas' :
  //             userId === '2' ? 'Amante del cine y crítico ocasional' :
  //               userId === '3' ? 'Especialista en ciencia ficción' :
  //                 userId === '4' ? 'Crítico profesional de cine' :
  //                   userId === '5' ? 'Fan de películas de acción' :
  //                     userId === '6' ? 'Cinéfilo y coleccionista' : 'Amante del cine',
  //           created_at: '2025-09-01T10:00:00Z'
  //         };
  //         setUsuario(mockUser);
  //       }

  //       // Cargar reseñas del usuario
  //       const resenas = await obtenerResenasPorUsuario(userId, filtros);
  //       setResenasUsuario(resenas);

  //     } catch (err) {
  //       console.error('Error cargando perfil de usuario:', err);
  //       setError(`Error cargando perfil: ${err.message}`);
  //     } finally {
  //       setCargando(false);
  //     }
  //   };

  //   if (userId) {
  //     cargarDatosUsuario();
  //   }
  // }, [userId, usingBackend, usersAPI, obtenerResenasPorUsuario, filtros, setError]);

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

  // if (cargando) {
  //   return <LoadingSpinner mensaje="Cargando perfil de usuario..." />;
  // }

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
      <div className="perfil-usuario">
        <div className="perfil-header">
          <div className="perfil-info">
            <img
              className="perfil-imagen"
              src={usuario.image_url /* || defaultUserImg */}
              alt={`Foto de ${usuario.full_name || usuario.name || "Usuario"}`}
              onError={e => {
                e.target.onerror = null;
                e.target.src = defaultUserImg;
              }}
            />
            <div className="perfil-detalles">
              <h1 className="perfil-nombre">
                {usuario.full_name || `${usuario.name} ${usuario.last_name || ""}`}
                {usuario.role && (
                  <span className={`badge-${usuario.role}`}>{usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1)}</span>
                )}
                <span className={`badge-estado ${usuario.is_active ? "activo" : "inactivo"}`}>  {usuario.is_active ? "Activo" : "Inactivo"} </span>
              </h1>
              <div className="perfil-email">{usuario.email}</div>
             {/*  <div className="perfil-fecha">
                Última actualización: {usuario.updated_at ? new Date(usuario.updated_at).toLocaleDateString("es-ES") : ""}
              </div> */}
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
