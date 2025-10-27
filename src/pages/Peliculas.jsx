import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import LoadingSpinner from '../componentes/LoadingSpinner/LoadingSpinner';
import './Peliculas.css';

// Datos de ejemplo para modo offline
const peliculasEjemplo = [
  {
    id: 1,
    title: "El Padrino",
    year: 1972,
    genre: "Drama",
    director: "Francis Ford Coppola",
    poster_url: "https://via.placeholder.com/300x450/1a1f2e/818cf8?text=El+Padrino",
    description: "Una saga épica sobre una familia mafiosa italiana en América"
  },
  {
    id: 2,
    title: "Blade Runner 2049", 
    year: 2017,
    genre: "Ciencia Ficción",
    director: "Denis Villeneuve",
    poster_url: "https://via.placeholder.com/300x450/1a1f2e/8b5cf6?text=Blade+Runner",
    description: "Una secuela digna del clásico cyberpunk de Ridley Scott"
  },
  {
    id: 3,
    title: "Parasite",
    year: 2019,
    genre: "Thriller",
    director: "Bong Joon-ho",
    poster_url: "https://via.placeholder.com/300x450/1a1f2e/6366f1?text=Parasite",
    description: "Una crítica social brillante envuelta en un thriller impredecible"
  },
  {
    id: 4,
    title: "Mad Max: Fury Road",
    year: 2015,
    genre: "Acción",
    director: "George Miller",
    poster_url: "https://via.placeholder.com/300x450/1a1f2e/a78bfa?text=Mad+Max",
    description: "Una obra maestra de la acción cinematográfica"
  },
  {
    id: 5,
    title: "Her",
    year: 2013,
    genre: "Romance",
    director: "Spike Jonze",
    poster_url: "https://via.placeholder.com/300x450/1a1f2e/8b5cf6?text=Her",
    description: "Una historia de amor única sobre la conexión en la era digital"
  },
  {
    id: 6,
    title: "El Caballero de la Noche",
    year: 2008,
    genre: "Acción",
    director: "Christopher Nolan",
    poster_url: "https://via.placeholder.com/300x450/1a1f2e/6366f1?text=Batman",
    description: "La mejor película de superhéroes jamás hecha"
  },
  {
    id: 7,
    title: "El Señor de los Anillos",
    year: 2001,
    genre: "Fantasía",
    director: "Peter Jackson",
    poster_url: "https://via.placeholder.com/300x450/1a1f2e/818cf8?text=LOTR",
    description: "El inicio de una épica aventura en la Tierra Media"
  },
  {
    id: 8,
    title: "Pulp Fiction",
    year: 1994,
    genre: "Drama",
    director: "Quentin Tarantino",
    poster_url: "https://via.placeholder.com/300x450/1a1f2e/a78bfa?text=Pulp+Fiction",
    description: "Una obra maestra del cine postmoderno"
  }
];

const Peliculas = () => {
  const { moviesAPI, usingBackend, /* checkBackendHealth */ } = useResenas();
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPeliculas = async () => {
      setCargando(true);
      setError(null);
      
      try {
        if (usingBackend) {
          const moviesList = await moviesAPI.getAll();
          setPeliculas(moviesList || []);
        } else {
          // Simular carga de red
          await new Promise(resolve => setTimeout(resolve, 800));
          setPeliculas(peliculasEjemplo);
        }
      } catch (error) {
        console.error('Error cargando películas:', error);
        setError('Error al cargar las películas');
        // Usar datos de ejemplo como fallback
        setPeliculas(peliculasEjemplo);
      } finally {
        setCargando(false);
      }
    };

    cargarPeliculas();
  }, [moviesAPI, usingBackend]);

  if (cargando) {
    return <LoadingSpinner mensaje="Cargando películas..." />;
  }

  if (error && peliculas.length === 0) {
    return (
      <div className="pagina-peliculas">
        <div className="contenido-peliculas">
          <div className="error-peliculas">
            <h2>Error al cargar películas</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Reintentar
            </button>
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
          <p>Descubre, explora y comparte tu opinión sobre el mejor contenido cinematográfico</p>
          {!usingBackend && (
            <div className="aviso-offline">
              Modo demostración - Datos de ejemplo
            </div>
          )}
        </div>

        <div className="grid-peliculas">
        {peliculas.map(pelicula => (
          <div key={pelicula.id} className="tarjeta-pelicula">
            <div className="contenedor-poster">
              <img 
                src={pelicula.poster_url || `https://via.placeholder.com/300x450/1a1f2e/6366f1?text=${encodeURIComponent(pelicula.title)}`}
                alt={`Póster de ${pelicula.title}`}
                className="poster-pelicula"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x450/1a1f2e/6366f1?text=${encodeURIComponent(pelicula.title)}`;
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
                  <span className="director-pelicula">{pelicula.director}</span>
                )}
              </div>
              {pelicula.description && (
                <p className="descripcion-pelicula">{pelicula.description}</p>
              )}
              <div className="acciones-pelicula" style={{top: 0, right: 0}}>
                <Link 
                  to={`/movie/${pelicula.id}/reviews`}
                  className="btn-ver-resenas"
                >
                  Ver Reseñas
                </Link>
                <Link 
                  to={`/crear?movieId=${pelicula.id}&titulo=${encodeURIComponent(pelicula.title)}&year=${pelicula.year}&genre=${encodeURIComponent(pelicula.genre || '')}&director=${encodeURIComponent(pelicula.director || '')}&poster=${encodeURIComponent(pelicula.poster_url || '')}&description=${encodeURIComponent(pelicula.description || '')}`}
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
          <p>El catálogo está vacío en este momento. Por favor, inténtalo más tarde.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Peliculas;
