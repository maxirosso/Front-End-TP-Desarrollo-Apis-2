import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import ModalComentarios from '../componentes/ModalComentarios/ModalComentarios';
import './PeliculaDetalle.css';

const PeliculaDetalle = () => {
  const { titulo, movieId } = useParams();
  const navigate = useNavigate();
  const {
    usuarioActual,
    resenas,
    eliminarResena,
    toggleLikeResena,
    agregarComentario,
    obtenerResenasPorPelicula,
    moviesAPI
  } = useResenas();

  const [pelicula, setPelicula] = useState(null);
  const [resenasPelicula, setResenasPelicula] = useState([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarResenasPelicula = async () => {
      if (titulo || movieId) {
        setCargando(true);
        // Scroll al top cuando se navega a una nueva película
        window.scrollTo(0, 0);
        try {
          let peliculaData = null;
          let resenas = [];

          if (movieId) {
            // Si tenemos movieId, usar la API de películas
            peliculaData = await moviesAPI.getById(movieId);
            resenas = await obtenerResenasPorPelicula(movieId, {
              sort: 'recent',
              limit: '50',
              offset: '0'
            });
          } else if (titulo) {
            // Si solo tenemos título, buscar por título (fallback)
            const tituloDecodificado = decodeURIComponent(titulo);
            
            resenas = await obtenerResenasPorPelicula(tituloDecodificado);
            
            // Construir objeto película desde la primera reseña
            if (resenas && resenas.length > 0) {
              const primeraResena = resenas[0];
              peliculaData = {
                id: primeraResena.movie_id,
                title: primeraResena.movie_title || primeraResena.titulo || tituloDecodificado,
                year: primeraResena.year || primeraResena.año,
                genre: primeraResena.movie_genre || primeraResena.genero || primeraResena.genre,
                poster_url: primeraResena.movie_poster || primeraResena.poster_url || primeraResena.imagenUrl,
                director: primeraResena.director || '',
                description: primeraResena.description || ''
              };
            }
          }
          
          setPelicula(peliculaData);
          setResenasPelicula(resenas || []);
        } catch (error) {
          console.error('Error cargando reseñas de la película:', error);
          setResenasPelicula([]);
          setPelicula(null);
        } finally {
          setCargando(false);
        }
      }
    };

    cargarResenasPelicula();
  }, [titulo, movieId, obtenerResenasPorPelicula, moviesAPI]);

  const manejarEliminarResena = (id) => {
    eliminarResena(id);
  };

  const manejarEditarResena = (resena) => {
    navigate(`/crear-resena/${resena.id}?editar=true`);
  };

  const manejarToggleLike = (id) => {
    toggleLikeResena(id);
  };

  const manejarAbrirComentarios = (id) => {
    const resena = resenas.find(r => r.id === id);
    setResenaSeleccionada(resena);
    setMostrarComentarios(true);
  };

  const manejarAgregarComentario = (idResena, comentario) => {
    agregarComentario(idResena, comentario);
  };

  const calcularEstadisticas = () => {
    if (resenasPelicula.length === 0) {
      return {
        promedioRating: 0,
        totalResenas: 0,
        totalConRating: 0,
        distribucionRatings: [0, 0, 0, 0, 0, 0],
      };
    }

    const ratingsValidos = resenasPelicula
      .map((r) => Number(r.rating))
      .filter((v) => !isNaN(v) && v >= 0 && v <= 5);

    const totalConRating = ratingsValidos.length;

    if (totalConRating === 0) {
      return {
        promedioRating: 0,
        totalResenas: resenasPelicula.length,
        totalConRating: 0,
        distribucionRatings: [0, 0, 0, 0, 0, 0],
      };
    }

    const suma = ratingsValidos.reduce((sum, v) => sum + v, 0);
    const promedioRating = suma / totalConRating;

    const distribucionRatings = [0, 0, 0, 0, 0, 0];
    ratingsValidos.forEach((v) => {
      distribucionRatings[v] += 1;
    });

    return {
      promedioRating,
      totalResenas: resenasPelicula.length,
      totalConRating,
      distribucionRatings,
    };
  };

  const estadisticas = calcularEstadisticas();

  const tituloDisplay = pelicula?.title || (titulo ? decodeURIComponent(titulo) : 'Película');
  const añoDisplay = pelicula?.year;
  const generoDisplay = pelicula?.genre;
  const directorDisplay = pelicula?.director;
  const descripcionDisplay = pelicula?.description;
  const posterUrl = pelicula?.poster_url || `https://via.placeholder.com/300x450/2C3E50/ECF0F1?text=${encodeURIComponent(tituloDisplay)}`;

  if (cargando) {
    return (
      <div className="contenedor-cargando">
        <div className="spinner-carga">
          <div className="punto-carga"></div>
          <div className="punto-carga"></div>
          <div className="punto-carga"></div>
        </div>
        <p>Cargando reseñas de la película...</p>
      </div>
    );
  }

  if (resenasPelicula.length === 0 && !cargando) {
    return (
      <div className="resenas-pelicula">
        <div className="sin-resenas">
          <div className="icono-vacio">📝</div>
          <h3>No hay reseñas para esta película</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="resenas-pelicula">
      <div className="pelicula-header">
        <div className="pelicula-info">
          <img
            src={posterUrl}
            alt={`Póster de ${tituloDisplay}`}
            className="pelicula-poster"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/300x450/34495e/ecf0f1?text=${encodeURIComponent(tituloDisplay)}`;
            }}
          />
          <div className="pelicula-detalles">
            <h1 className="pelicula-titulo">{tituloDisplay}</h1>
            <div className="pelicula-meta">
              {añoDisplay && <span className="pelicula-ano">{añoDisplay}</span>}
              {generoDisplay && <span className="pelicula-genero">{generoDisplay}</span>}
              {directorDisplay && <span className="pelicula-director">Dir. {directorDisplay}</span>}
            </div>
            {descripcionDisplay && (
              <p className="pelicula-descripcion">{descripcionDisplay}</p>
            )}

            <div className="estadisticas-resenas">
              <div className="rating-principal">
                <span className="rating-numero">
                  {estadisticas.promedioRating.toFixed(1)}
                </span>
                <div className="estrellas">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`estrella ${star <= Math.round(estadisticas.promedioRating) ? 'activa' : ''}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="total-resenas">
                  ({estadisticas.totalResenas} reseñas)
                </span>
              </div>

              <div className="distribucion-ratings">
                {[5, 4, 3, 2, 1, 0].map((rating) => {
                  const count = estadisticas.distribucionRatings[rating] || 0;
                  const base = estadisticas.totalConRating > 0 ? estadisticas.totalConRating : 1;

                  return (
                    <div key={rating} className="rating-bar">
                      <span className="rating-label">{rating}★</span>
                      <div className="bar-container">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(count / base) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="rating-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="acciones-pelicula">
          <Link 
            to={`/crear?movieId=${pelicula?.id || movieId || ''}&titulo=${encodeURIComponent(tituloDisplay)}&year=${añoDisplay || ''}&genre=${encodeURIComponent(generoDisplay || '')}&director=${encodeURIComponent(directorDisplay || '')}&poster=${encodeURIComponent(posterUrl)}&description=${encodeURIComponent(descripcionDisplay || '')}`}
            className="btn-crear-resena"
          >
            ✏️ Escribir reseña
          </Link>
        </div>
      </div>

      {/* Controles de reseñas */}
      <div className="controles-resenas">
        <h2>Reseñas de {tituloDisplay}</h2>
      </div>

      {/* Lista de reseñas */}
      <div className="lista-resenas-pelicula">
        <div className="resenas-grid">
          {resenasPelicula.map((resena) => (
            <TarjetaResena
              key={resena.id}
              pelicula={resena}
              onEliminar={manejarEliminarResena}
              onEditar={manejarEditarResena}
              onToggleLike={manejarToggleLike}
              onAbrirComentarios={manejarAbrirComentarios}
              usuarioActual={usuarioActual}
              mostrarPelicula={false}
            />
          ))}
        </div>
      </div>

      {/* Modal de comentarios */}
      {mostrarComentarios && resenaSeleccionada && (
        <ModalComentarios
          resena={resenaSeleccionada}
          onCerrar={() => {
            setMostrarComentarios(false);
            setResenaSeleccionada(null);
          }}
          onAgregarComentario={manejarAgregarComentario}
        />
      )}
    </div>
  );
};

export default PeliculaDetalle;
