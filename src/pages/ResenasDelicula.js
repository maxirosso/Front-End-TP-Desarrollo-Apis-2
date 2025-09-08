import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import FiltrosResenas from '../componentes/FiltrosResenas/FiltrosResenas';
import BarraOrdenamiento from '../componentes/BarraOrdenamiento/BarraOrdenamiento';
import LoadingSpinner from '../componentes/LoadingSpinner/LoadingSpinner';
import './ResenasDelicula.css';

const ResenasDelicula = () => {
  const { movieId } = useParams();
  const {
    usingBackend,
    moviesAPI,
    obtenerResenasPorPelicula,
    eliminarResena,
    toggleLikeResena,
    error,
    setError
  } = useResenas();

  const [pelicula, setPelicula] = useState(null);
  const [resenasPelicula, setResenasPelicula] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [ordenamientoActual, setOrdenamientoActual] = useState('recent');

  useEffect(() => {
    const cargarDatosPelicula = async () => {
      setCargando(true);
      setError(null);

      try {
        // Cargar datos de la película
        const movieData = await moviesAPI.getById(movieId);
        setPelicula(movieData);

        // Cargar reseñas de la película
        const filtrosConOrden = {
          ...filtrosActivos,
          sort: ordenamientoActual,
          limit: '50',
          offset: '0'
        };
        
        const resenas = await obtenerResenasPorPelicula(movieId, filtrosConOrden);
        setResenasPelicula(resenas);

      } catch (err) {
        console.error('Error cargando datos de película:', err);
        setError(`Error cargando película: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };

    if (movieId) {
      cargarDatosPelicula();
    }
  }, [movieId, filtrosActivos, ordenamientoActual, usingBackend, moviesAPI, obtenerResenasPorPelicula, setError]);

  const manejarEliminarResena = async (id) => {
    try {
      await eliminarResena(id);
      setResenasPelicula(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error eliminando reseña:', err);
    }
  };

  const manejarEditarResena = (resena) => {
    window.location.href = `/editar/${resena.id}`;
  };

  const manejarToggleLike = (id) => {
    toggleLikeResena(id);
    setResenasPelicula(prev => prev.map(resena => {
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

  const manejarAplicarFiltros = (filtros) => {
    setFiltrosActivos(filtros);
  };

  const manejarLimpiarFiltros = () => {
    setFiltrosActivos({});
  };

  const manejarCambiarOrdenamiento = (ordenamiento) => {
    setOrdenamientoActual(ordenamiento);
  };

  const calcularEstadisticas = () => {
    if (resenasPelicula.length === 0) {
      return {
        promedioRating: 0,
        totalResenas: 0,
        distribucionRatings: [0, 0, 0, 0, 0]
      };
    }

    const totalResenas = resenasPelicula.length;
    const promedioRating = resenasPelicula.reduce((sum, r) => sum + (r.rating || 0), 0) / totalResenas;
    const distribucionRatings = [0, 0, 0, 0, 0];
    
    resenasPelicula.forEach(resena => {
      if (resena.rating >= 1 && resena.rating <= 5) {
        distribucionRatings[resena.rating - 1]++;
      }
    });

    return { promedioRating, totalResenas, distribucionRatings };
  };

  if (cargando) {
    return <LoadingSpinner mensaje="Cargando reseñas de la película..." />;
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

  if (!pelicula) {
    return (
      <div className="pelicula-no-encontrada">
        <h2>Película no encontrada</h2>
        <p>La película que buscas no existe o ha sido eliminada.</p>
        <Link to="/" className="btn-volver">Volver al inicio</Link>
      </div>
    );
  }

  const estadisticas = calcularEstadisticas();

  return (
    <div className="resenas-pelicula">
      <div className="pelicula-header">
        <div className="pelicula-info">
          <img 
            src={pelicula.poster_url || `https://via.placeholder.com/300x450/34495e/ecf0f1?text=${encodeURIComponent(pelicula.title)}`}
            alt={`Póster de ${pelicula.title}`}
            className="pelicula-poster"
          />
          <div className="pelicula-detalles">
            <h1 className="pelicula-titulo">{pelicula.title}</h1>
            <div className="pelicula-meta">
              <span className="pelicula-ano">{pelicula.year}</span>
              {pelicula.genre && (
                <span className="pelicula-genero">{pelicula.genre}</span>
              )}
              {pelicula.director && (
                <span className="pelicula-director">Dir. {pelicula.director}</span>
              )}
            </div>
            {pelicula.description && (
              <p className="pelicula-descripcion">{pelicula.description}</p>
            )}
            
            <div className="estadisticas-resenas">
              <div className="rating-principal">
                <span className="rating-numero">{estadisticas.promedioRating.toFixed(1)}</span>
                <div className="estrellas">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star}
                      className={`estrella ${star <= Math.round(estadisticas.promedioRating) ? 'activa' : ''}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="total-resenas">({estadisticas.totalResenas} reseñas)</span>
              </div>
              
              <div className="distribucion-ratings">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="rating-bar">
                    <span className="rating-label">{rating}★</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: estadisticas.totalResenas > 0 
                            ? `${(estadisticas.distribucionRatings[rating - 1] / estadisticas.totalResenas) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                    <span className="rating-count">{estadisticas.distribucionRatings[rating - 1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="acciones-pelicula">
          <Link 
            to={`/crear?movieId=${movieId}`} 
            className="btn-crear-resena"
          >
            ✏️ Escribir reseña
          </Link>
        </div>
      </div>

      {/* Controles de filtros y ordenamiento */}
      <div className="controles-resenas">
        <h2>Reseñas de {pelicula.title}</h2>
        
        <FiltrosResenas
          onAplicarFiltros={manejarAplicarFiltros}
          filtrosActivos={filtrosActivos}
          onLimpiarFiltros={manejarLimpiarFiltros}
          ocultarFiltroPelicula={true} // Ocultar filtro de película ya que estamos en una película específica
        />

        <BarraOrdenamiento
          onCambiarOrdenamiento={manejarCambiarOrdenamiento}
          ordenamientoActual={ordenamientoActual}
          totalResenas={resenasPelicula.length}
        />
      </div>

      {/* Lista de reseñas */}
      <div className="lista-resenas-pelicula">
        {resenasPelicula.length === 0 ? (
          <div className="sin-resenas">
            <div className="icono-vacio">📝</div>
            <h3>No hay reseñas para esta película</h3>
            <p>Sé el primero en compartir tu opinión sobre "{pelicula.title}"</p>
            <Link 
              to={`/crear?movieId=${movieId}`} 
              className="btn-crear-primera"
            >
              Escribir primera reseña
            </Link>
          </div>
        ) : (
          <div className="resenas-grid">
            {resenasPelicula.map(resena => (
              <TarjetaResena 
                key={resena.id} 
                pelicula={resena}
                onEliminar={manejarEliminarResena}
                onEditar={manejarEditarResena}
                onToggleLike={manejarToggleLike}
                onAbrirComentarios={() => {}} // Implementar si es necesario
                usuarioActual="usuario_actual" // Obtener del contexto de auth
                mostrarPelicula={false} // No mostrar info de película en esta vista
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

export default ResenasDelicula;
