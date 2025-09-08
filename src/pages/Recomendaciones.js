import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import LoadingSpinner from '../componentes/LoadingSpinner/LoadingSpinner';
import './Recomendaciones.css';

const Recomendaciones = () => {
  const { resenas, moviesAPI, cargando } = useResenas();
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [peliculasPopulares, setPeliculasPopulares] = useState([]);
  const [resenasDestacadas, setResenasDestacadas] = useState([]);

  useEffect(() => {
    const generarRecomendaciones = async () => {
      try {
        // Obtener todas las películas
        const todasLasPeliculas = await moviesAPI.getAll();
        
        // Calcular popularidad por número de reseñas
        const popularidad = {};
        resenas.forEach(resena => {
          const movieId = resena.movie_id || resena.id;
          popularidad[movieId] = (popularidad[movieId] || 0) + 1;
        });

        // Ordenar películas por popularidad
        const peliculasConPopularidad = todasLasPeliculas.map(pelicula => ({
          ...pelicula,
          numeroResenas: popularidad[pelicula.id] || 0,
          ratingPromedio: calcularRatingPromedio(pelicula.id)
        }));

        // Top películas por número de reseñas
        const masPopulares = peliculasConPopularidad
          .sort((a, b) => b.numeroResenas - a.numeroResenas)
          .slice(0, 4);

        // Mejores reseñas (rating alto + recientes)
        const mejoresResenas = [...resenas]
          .filter(resena => resena.rating >= 4)
          .sort((a, b) => {
            // Ordenar por rating primero, luego por fecha
            if (b.rating !== a.rating) return b.rating - a.rating;
            return new Date(b.created_at || b.fechaResena) - new Date(a.created_at || a.fechaResena);
          })
          .slice(0, 3);

        // Recomendaciones basadas en género y rating alto
        const recomendacionesPorGenero = generarRecomendacionesPorGenero(peliculasConPopularidad);

        setPeliculasPopulares(masPopulares);
        setResenasDestacadas(mejoresResenas);
        setRecomendaciones(recomendacionesPorGenero);
      } catch (error) {
        console.error('Error generando recomendaciones:', error);
      }
    };

    if (!cargando) {
      generarRecomendaciones();
    }
  }, [resenas, cargando, moviesAPI]);

  const calcularRatingPromedio = (movieId) => {
    const resenasDeEstaPelicula = resenas.filter(r => (r.movie_id || r.id) === movieId);
    if (resenasDeEstaPelicula.length === 0) return 0;
    
    const suma = resenasDeEstaPelicula.reduce((total, resena) => total + resena.rating, 0);
    return (suma / resenasDeEstaPelicula.length).toFixed(1);
  };

  const generarRecomendacionesPorGenero = (peliculas) => {
    const generos = ['drama', 'accion', 'ciencia-ficcion', 'thriller', 'romance'];
    const recomendaciones = [];

    generos.forEach(genero => {
      const peliculasDelGenero = peliculas
        .filter(p => p.genre === genero && p.ratingPromedio >= 3.5)
        .slice(0, 2);
      
      if (peliculasDelGenero.length > 0) {
        recomendaciones.push({
          genero: genero,
          peliculas: peliculasDelGenero
        });
      }
    });

    return recomendaciones;
  };

  const obtenerIconoGenero = (genero) => {
    const iconos = {
      'drama': '🎭',
      'accion': '💥',
      'ciencia-ficcion': '🚀',
      'thriller': '🔍',
      'romance': '💕',
      'comedia': '😄'
    };
    return iconos[genero] || '🎬';
  };

  const obtenerTituloGenero = (genero) => {
    const titulos = {
      'drama': 'Drama',
      'accion': 'Acción',
      'ciencia-ficcion': 'Ciencia Ficción',
      'thriller': 'Thriller',
      'romance': 'Romance',
      'comedia': 'Comedia'
    };
    return titulos[genero] || genero;
  };

  if (cargando) {
    return <LoadingSpinner mensaje="Generando recomendaciones..." />;
  }

  return (
    <div className="pagina-recomendaciones">
      {/* Header */}
      <div className="header-recomendaciones">
        <h1>🎯 ¿Qué Veo Hoy?</h1>
        <p>Descubre películas basadas en las mejores reseñas de nuestra comunidad</p>
      </div>

      {/* Películas Más Populares */}
      <section className="seccion-recomendaciones">
        <h2>🔥 Más Populares</h2>
        <p className="descripcion-seccion">Las películas con más reseñas de nuestra comunidad</p>
        
        <div className="grid-peliculas-populares">
          {peliculasPopulares.map(pelicula => (
            <div key={pelicula.id} className="tarjeta-pelicula-popular">
              <img 
                src={pelicula.poster_url || `https://via.placeholder.com/200x300/34495e/ecf0f1?text=${encodeURIComponent(pelicula.title)}`}
                alt={`Póster de ${pelicula.title}`}
                className="poster-popular"
              />
              <div className="info-popular">
                <h3>{pelicula.title}</h3>
                <div className="stats-popular">
                  <span className="rating">⭐ {pelicula.ratingPromedio}</span>
                  <span className="resenas">{pelicula.numeroResenas} reseñas</span>
                </div>
                <div className="acciones-popular">
                  <Link to={`/movie/${pelicula.id}/reviews`} className="btn-ver">
                    Ver Reseñas
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reseñas Destacadas */}
      <section className="seccion-recomendaciones">
        <h2>⭐ Reseñas Destacadas</h2>
        <p className="descripcion-seccion">Las mejores reseñas recientes de nuestra comunidad</p>
        
        <div className="lista-resenas-destacadas">
          {resenasDestacadas.map(resena => (
            <TarjetaResena 
              key={resena.id}
              pelicula={resena}
              onEliminar={() => {}}
              onEditar={() => {}}
              onToggleLike={() => {}}
              onAbrirComentarios={() => {}}
              usuarioActual="usuario_actual"
              compacta={true}
            />
          ))}
        </div>
      </section>

      {/* Recomendaciones por Género */}
      <section className="seccion-recomendaciones">
        <h2>🎬 Recomendaciones por Género</h2>
        <p className="descripcion-seccion">Películas bien valoradas organizadas por género</p>
        
        {recomendaciones.map(categoria => (
          <div key={categoria.genero} className="categoria-genero">
            <h3 className="titulo-genero">
              {obtenerIconoGenero(categoria.genero)} {obtenerTituloGenero(categoria.genero)}
            </h3>
            <div className="peliculas-genero">
              {categoria.peliculas.map(pelicula => (
                <div key={pelicula.id} className="mini-tarjeta-pelicula">
                  <img 
                    src={pelicula.poster_url || `https://via.placeholder.com/150x225/34495e/ecf0f1?text=${encodeURIComponent(pelicula.title)}`}
                    alt={`Póster de ${pelicula.title}`}
                    className="mini-poster"
                  />
                  <div className="mini-info">
                    <h4>{pelicula.title}</h4>
                    <span className="mini-rating">⭐ {pelicula.ratingPromedio}</span>
                    <Link to={`/movie/${pelicula.id}/reviews`} className="btn-mini">
                      Ver Reseñas
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="seccion-cta">
        <div className="cta-content">
          <h2>¿No encuentras lo que buscas?</h2>
          <p>Explora todo nuestro catálogo o contribuye con tus propias reseñas</p>
          <div className="cta-botones">
            <Link to="/peliculas" className="btn-cta primario">
              📚 Ver Todas las Películas
            </Link>
            <Link to="/crear" className="btn-cta secundario">
              ✏️ Escribir Reseña
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recomendaciones;
