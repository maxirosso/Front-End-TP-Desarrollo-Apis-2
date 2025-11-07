import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useResenas } from "../contextos/ContextoResenas";
import LoadingSpinner from "../componentes/LoadingSpinner/LoadingSpinner";
import "./Peliculas.css";

const Peliculas = () => {
  const { moviesAPI, usingBackend } = useResenas();
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPeliculas = async () => {
      setCargando(true);
      setError(null);

      try {
        if (!usingBackend) {
          throw new Error("Backend no disponible");
        }

        const moviesList = await moviesAPI.getAll();
        setPeliculas(moviesList || []);
      } catch (err) {
        console.error("Error cargando películas:", err);
        setError("Error al cargar las películas");
        setPeliculas([]); // nada de datos fake
      } finally {
        setCargando(false);
      }
    };

    cargarPeliculas();
  }, [moviesAPI, usingBackend]);

  useEffect(() => {
    console.log("Películas desde backend:", peliculas);
  }, [peliculas]);

  if (cargando) {
    return <LoadingSpinner mensaje="Cargando películas..." />;
  }

  if (error) {
    return (
      <div className="pagina-peliculas">
        <div className="contenido-peliculas">
          <div className="error-peliculas">
            <h2>Error al cargar películas</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-peliculas">
      <div className="contenido-peliculas">
        <div className="header-peliculas">
          <h1>Películas</h1>
          <p>
            Descubre, explora y comparte tu opinión sobre el mejor contenido
            cinematográfico
          </p>
          {!usingBackend && (
            <div className="aviso-offline">
              Modo demostración - Datos de ejemplo
            </div>
          )}
        </div>

        <div className="grid-peliculas">
          {peliculas.map((pelicula) => (
            <div key={pelicula.id} className="tarjeta-pelicula">
              <div className="contenedor-poster">
                <img
                  src={
                    pelicula.poster_url ||
                    `https://via.placeholder.com/300x450/1a1f2e/6366f1?text=${encodeURIComponent(
                      pelicula.title
                    )}`
                  }
                  alt={`Póster de ${pelicula.title}`}
                  className="poster-pelicula"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x450/1a1f2e/6366f1?text=${encodeURIComponent(
                      pelicula.title
                    )}`;
                  }}
                />
              </div>
              <div className="info-pelicula">
                <h3 className="titulo-pelicula">{pelicula.title}</h3>
                <div className="meta-pelicula">
                  <span className="ano-pelicula">{pelicula.year}</span>
                  {pelicula.genre && (
                    <span className="genero-pelicula">{pelicula.genre}</span>
                  )}
                  {pelicula.director && (
                    <span className="director-pelicula">
                      {pelicula.director}
                    </span>
                  )}
                </div>
                {pelicula.description && (
                  <p className="descripcion-pelicula">{pelicula.description}</p>
                )}
                <div className="acciones-pelicula" style={{ top: 0, right: 0 }}>
                  <Link
                    to={`/movie/${pelicula.id}/reviews`}
                    className="btn-ver-resenas"
                  >
                    Ver Reseñas
                  </Link>
                  <Link
                    to={`/crear?movieId=${
                      pelicula.id
                    }&titulo=${encodeURIComponent(pelicula.title)}&year=${
                      pelicula.year
                    }&genre=${encodeURIComponent(
                      pelicula.genre || ""
                    )}&director=${encodeURIComponent(
                      pelicula.director || ""
                    )}&poster=${encodeURIComponent(
                      pelicula.poster_url || ""
                    )}&description=${encodeURIComponent(
                      pelicula.description || ""
                    )}`}
                    className="btn-escribir-resena"
                  >
                    Escribir Reseña
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {peliculas.length === 0 && !cargando && (
          <div className="sin-peliculas">
            <h3>No hay películas disponibles</h3>
            <p>
              El catálogo está vacío en este momento. Por favor, inténtalo más
              tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Peliculas;
