import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import ModalComentarios from '../componentes/ModalComentarios/ModalComentarios';
import './PeliculaDetalle.css';

const PeliculaDetalle = () => {
  const { titulo } = useParams();
  const navigate = useNavigate();
  const {
    usuarioActual,
    resenas,
    eliminarResena,
    toggleLikeResena,
    agregarComentario,
    obtenerResenasPorPelicula
  } = useResenas();

  const [resenasPelicula, setResenasPelicula] = useState([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarResenasPelicula = async () => {
      if (titulo) {
        setCargando(true);
        // Scroll al top cuando se navega a una nueva película
        window.scrollTo(0, 0);
        try {
          const tituloDecodificado = decodeURIComponent(titulo);
          console.log('Buscando reseñas para película:', tituloDecodificado);
          
          const resenasPelicula = await obtenerResenasPorPelicula(tituloDecodificado);
          console.log('Reseñas encontradas:', resenasPelicula);
          setResenasPelicula(resenasPelicula || []);
        } catch (error) {
          console.error('Error cargando reseñas de la película:', error);
          setResenasPelicula([]);
        } finally {
          setCargando(false);
        }
      }
    };

    cargarResenasPelicula();
  }, [titulo, obtenerResenasPorPelicula]);

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

  // Calcular estadísticas de la película
  const primeraResena = resenasPelicula[0];
  const estadisticas = resenasPelicula.length > 0 ? {
    calificacionPromedio: (
      resenasPelicula.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0) / resenasPelicula.length
    ).toFixed(1),
    totalResenas: resenasPelicula.length,
    totalLikes: resenasPelicula.reduce((sum, r) => sum + (parseInt(r.likes_count || r.likes) || 0), 0),
    posterUrl: primeraResena?.movie_poster || primeraResena?.poster_url || primeraResena?.imagenUrl,
    tituloMovie: primeraResena?.movie_title || primeraResena?.titulo || decodeURIComponent(titulo),
    año: primeraResena?.year || primeraResena?.año,
    genero: primeraResena?.movie_genre || primeraResena?.genero || primeraResena?.genre
  } : null;

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

  if (resenasPelicula.length === 0) {
    return (
      <div className="pagina-pelicula-detalle">
        <div className="estado-sin-resenas">
          <div className="icono-pelicula">🎬</div>
          <h2>No hay reseñas para "{decodeURIComponent(titulo)}"</h2>
          <p>Sé el primero en escribir una reseña para esta película</p>
          <Link to="/crear" className="boton-primera-resena">
            Escribir primera reseña
          </Link>
          <Link to="/" className="boton-volver">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-pelicula-detalle">
      {/* Encabezado de la película */}
      <div className="encabezado-pelicula">
        <div className="info-pelicula">
          <div className="imagen-pelicula-grande">
            <img 
              src={estadisticas?.posterUrl || 'https://via.placeholder.com/300x450/2C3E50/ECF0F1?text=Sin+Poster'} 
              alt={`Póster de ${estadisticas?.tituloMovie || decodeURIComponent(titulo)}`}
              className="poster-pelicula"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450/2C3E50/ECF0F1?text=Sin+Poster';
              }}
            />
          </div>
          
          <div className="detalles-pelicula">
            <div className="navegacion-breadcrumb">
              <Link to="/" className="enlace-breadcrumb">Inicio</Link>
              <span className="separador-breadcrumb">›</span>
              <span className="pagina-actual">Películas</span>
              <span className="separador-breadcrumb">›</span>
              <span className="pagina-actual">{estadisticas?.tituloMovie || decodeURIComponent(titulo)}</span>
            </div>
            
            <h1 className="titulo-pelicula">{estadisticas?.tituloMovie || decodeURIComponent(titulo)}</h1>
            <div className="metadatos-pelicula">
              {estadisticas?.año && <span className="año-pelicula">{estadisticas.año}</span>}
              {estadisticas?.genero && (
                <>
                  {estadisticas?.año && <span className="separador-metadatos">•</span>}
                  <span className="genero-pelicula">{estadisticas.genero}</span>
                </>
              )}
            </div>
            
            <div className="estadisticas-pelicula">
              <div className="estadistica">
                <span className="valor-estadistica">{estadisticas?.calificacionPromedio || '0.0'}</span>
                <div className="estrellas-promedio">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`estrella-promedio ${i < Math.round(parseFloat(estadisticas?.calificacionPromedio || 0)) ? 'activa' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="etiqueta-estadistica">Promedio</span>
              </div>
              
              <div className="estadistica">
                <span className="valor-estadistica">{estadisticas?.totalResenas || 0}</span>
                <span className="etiqueta-estadistica">Reseñas</span>
              </div>
              
              <div className="estadistica">
                <span className="valor-estadistica">{estadisticas?.totalLikes || 0}</span>
                <span className="etiqueta-estadistica">Likes</span>
              </div>
            </div>

            <div className="acciones-pelicula">
              <Link to="/crear-resena" className="boton-escribir-resena">
                ✏️ Escribir reseña
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="seccion-resenas-pelicula">
        <h2 className="titulo-seccion-resenas">
          Todas las reseñas ({estadisticas?.totalResenas || 0})
        </h2>
        
        <div className="lista-resenas-pelicula">
          {resenasPelicula.map(resena => (
            <TarjetaResena 
              key={resena.id} 
              pelicula={resena}
              onEliminar={manejarEliminarResena}
              onEditar={manejarEditarResena}
              onToggleLike={manejarToggleLike}
              onAbrirComentarios={manejarAbrirComentarios}
              usuarioActual={usuarioActual}
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
