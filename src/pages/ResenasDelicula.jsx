import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useResenas } from "../contextos/ContextoResenas";
import TarjetaResena from "../componentes/TarjetaResena/TarjetaResena";
import FiltrosResenas from "../componentes/FiltrosResenas/FiltrosResenas";
import BarraOrdenamiento from "../componentes/BarraOrdenamiento/BarraOrdenamiento";
import LoadingSpinner from "../componentes/LoadingSpinner/LoadingSpinner";
import "./ResenasDelicula.css";

const ResenasDelicula = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const {
    usuarioActual,
    usingBackend,
    moviesAPI,
    obtenerResenasPorPelicula,
    eliminarResena,
    toggleLikeResena,
    error,
    setError,
  } = useResenas();

  const [pelicula, setPelicula] = useState(null);
  const [resenasPelicula, setResenasPelicula] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [ordenamientoActual, setOrdenamientoActual] = useState("recent");

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
          limit: "50",
          offset: "0",
        };

        const resenas = await obtenerResenasPorPelicula(
          movieId,
          filtrosConOrden
        );
        setResenasPelicula(resenas);
      } catch (err) {
        console.error("Error cargando datos de película:", err);
        setError(`Error cargando película: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };

    if (movieId) {
      cargarDatosPelicula();
    }
  }, [
    movieId,
    filtrosActivos,
    ordenamientoActual,
    usingBackend,
    moviesAPI,
    obtenerResenasPorPelicula,
    setError,
  ]);

  const manejarEliminarResena = async (id) => {
    try {
      await eliminarResena(id);
      setResenasPelicula((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error eliminando reseña:", err);
    }
  };

  const manejarEditarResena = (resena) => {
    navigate(`/crear-resena/${resena.id}?editar=true`);
  };

  const manejarToggleLike = (id) => {
    toggleLikeResena(id);
    setResenasPelicula((prev) =>
      prev.map((resena) => {
        if (resena.id === id) {
          return {
            ...resena,
            yaLeDiLike: !resena.yaLeDiLike,
            likes: resena.yaLeDiLike ? resena.likes - 1 : resena.likes + 1,
          };
        }
        return resena;
      })
    );
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

  if (cargando) {
    return <LoadingSpinner mensaje="Cargando reseñas de la película..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn-volver">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!pelicula) {
    return (
      <div className="pelicula-no-encontrada">
        <h2>Película no encontrada</h2>
        <p>La película que buscas no existe o ha sido eliminada.</p>
        <Link to="/" className="btn-volver">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const estadisticas = calcularEstadisticas();

  return (
    <div className="resenas-pelicula">
      <div className="pelicula-header">
        <div className="pelicula-info">
          <img
            src={
              pelicula.poster_url ||
              `https://via.placeholder.com/300x450/34495e/ecf0f1?text=${encodeURIComponent(
                pelicula.title
              )}`
            }
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
                <span className="pelicula-director">
                  Dir. {pelicula.director}
                </span>
              )}
            </div>
            {pelicula.description && (
              <p className="pelicula-descripcion">{pelicula.description}</p>
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
                      className={`estrella ${star <= Math.round(estadisticas.promedioRating)
                          ? "activa"
                          : ""
                        }`}
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
                {/* Barras 5★..0★ usando índices 5..0 */}
                {[5, 4, 3, 2, 1, 0].map((rating) => {
                  const count = estadisticas.distribucionRatings[rating] || 0;
                  const base =
                    estadisticas.totalConRating > 0
                      ? estadisticas.totalConRating
                      : 1;

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
          <Link to={`/crear?movieId=${movieId}&titulo=${encodeURIComponent(pelicula.title)}&year=${pelicula.year
            }&genre=${encodeURIComponent(
              pelicula.genre || ""
            )}&director=${encodeURIComponent(
              pelicula.director || ""
            )}&poster=${encodeURIComponent(
              pelicula.poster_url || ""
            )}&description=${encodeURIComponent(
              pelicula.description || ""
            )}`} className="btn-crear-resena">
            ✏️ Escribir reseña
          </Link>
        </div>
      </div>

      {/* Controles de filtros y ordenamiento */}
      <div className="controles-resenas">
        <h2>Reseñas de {pelicula.title}</h2>
      </div>

      {/* Lista de reseñas */}
      <div className="lista-resenas-pelicula">
        {resenasPelicula.length === 0 ? (
          <div className="sin-resenas">
            <div className="icono-vacio">📝</div>
            <h3>No hay reseñas para esta película</h3>
          </div>
        ) : (
          <div className="resenas-grid">
            {resenasPelicula.map((resena) => (
              <TarjetaResena
                key={resena.id}
                pelicula={resena}
                onEliminar={manejarEliminarResena}
                onEditar={manejarEditarResena}
                onToggleLike={manejarToggleLike}
                onAbrirComentarios={() => { }} // Implementar si es necesario
                usuarioActual={usuarioActual} // Obtener del contexto de auth
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
