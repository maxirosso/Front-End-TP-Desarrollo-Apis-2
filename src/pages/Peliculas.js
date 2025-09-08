import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import LoadingSpinner from '../componentes/LoadingSpinner/LoadingSpinner';
import './Peliculas.css';

const Peliculas = () => {
  const { moviesAPI, usingBackend } = useResenas();
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPeliculas = async () => {
      setCargando(true);
      try {
        const moviesList = await moviesAPI.getAll();
        setPeliculas(moviesList);
      } catch (error) {
        console.error('Error cargando películas:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarPeliculas();
  }, [moviesAPI]);

  if (cargando) {
    return <LoadingSpinner mensaje="Cargando películas..." />;
  }

  return (
    <div className="pagina-peliculas">
      <div className="header-peliculas">
        <h1>🎬 Catálogo de Películas</h1>
        <p>Explora nuestro catálogo y lee las reseñas de cada película</p>
      </div>

      <div className="grid-peliculas">
        {peliculas.map(pelicula => (
          <div key={pelicula.id} className="tarjeta-pelicula">
            <img 
              src={pelicula.poster_url || `https://via.placeholder.com/300x450/34495e/ecf0f1?text=${encodeURIComponent(pelicula.title)}`}
              alt={`Póster de ${pelicula.title}`}
              className="poster-pelicula"
            />
            <div className="info-pelicula">
              <h3 className="titulo-pelicula">{pelicula.title}</h3>
              <div className="meta-pelicula">
                <span className="ano-pelicula">{pelicula.year}</span>
                {pelicula.genre && (
                  <span className="genero-pelicula">{pelicula.genre}</span>
                )}
              </div>
              {pelicula.description && (
                <p className="descripcion-pelicula">{pelicula.description}</p>
              )}
              <div className="acciones-pelicula">
                <Link 
                  to={`/movie/${pelicula.id}/reviews`}
                  className="btn-ver-resenas"
                >
                  📖 Ver Reseñas
                </Link>
                <Link 
                  to={`/crear?movieId=${pelicula.id}`}
                  className="btn-escribir-resena"
                >
                  ✏️ Escribir Reseña
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!usingBackend && (
        <div className="modo-offline">
          <p>📱 Modo offline - Mostrando películas de ejemplo</p>
        </div>
      )}
    </div>
  );
};

export default Peliculas;
