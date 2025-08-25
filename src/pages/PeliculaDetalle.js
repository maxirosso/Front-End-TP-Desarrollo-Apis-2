import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import ModalComentarios from '../componentes/ModalComentarios/ModalComentarios';
import './PeliculaDetalle.css';

const PeliculaDetalle = () => {
  const { titulo } = useParams();
  const {
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
    if (titulo) {
      setCargando(true);
      const resenas = obtenerResenasPorPelicula(decodeURIComponent(titulo));
      setResenasPelicula(resenas);
      setCargando(false);
    }
  }, [titulo, resenas, obtenerResenasPorPelicula]);

  const manejarEliminarResena = (id) => {
    eliminarResena(id);
  };

  const manejarEditarResena = (resena) => {
    window.location.href = `/editar/${resena.id}`;
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
  const estadisticas = resenasPelicula.length > 0 ? {
    calificacionPromedio: (resenasPelicula.reduce((sum, r) => sum + r.calificacion, 0) / resenasPelicula.length).toFixed(1),
    totalResenas: resenasPelicula.length,
    totalLikes: resenasPelicula.reduce((sum, r) => sum + r.likes, 0),
    año: resenasPelicula[0]?.año,
    genero: resenasPelicula[0]?.genero
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
              src={resenasPelicula[0]?.imagenUrl} 
              alt={`Póster de ${decodeURIComponent(titulo)}`}
              className="poster-pelicula"
            />
          </div>
          
          <div className="detalles-pelicula">
            <div className="navegacion-breadcrumb">
              <Link to="/" className="enlace-breadcrumb">Inicio</Link>
              <span className="separador-breadcrumb">›</span>
              <span className="pagina-actual">Películas</span>
              <span className="separador-breadcrumb">›</span>
              <span className="pagina-actual">{decodeURIComponent(titulo)}</span>
            </div>
            
            <h1 className="titulo-pelicula">{decodeURIComponent(titulo)}</h1>
            <div className="metadatos-pelicula">
              <span className="año-pelicula">{estadisticas.año}</span>
              {estadisticas.genero && (
                <>
                  <span className="separador-metadatos">•</span>
                  <span className="genero-pelicula">{estadisticas.genero}</span>
                </>
              )}
            </div>
            
            <div className="estadisticas-pelicula">
              <div className="estadistica">
                <span className="valor-estadistica">{estadisticas.calificacionPromedio}</span>
                <div className="estrellas-promedio">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`estrella-promedio ${i < Math.round(estadisticas.calificacionPromedio) ? 'activa' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="etiqueta-estadistica">Promedio</span>
              </div>
              
              <div className="estadistica">
                <span className="valor-estadistica">{estadisticas.totalResenas}</span>
                <span className="etiqueta-estadistica">Reseñas</span>
              </div>
              
              <div className="estadistica">
                <span className="valor-estadistica">{estadisticas.totalLikes}</span>
                <span className="etiqueta-estadistica">Likes</span>
              </div>
            </div>

            <div className="acciones-pelicula">
              <Link to="/crear" className="boton-escribir-resena">
                ✏️ Escribir reseña
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="seccion-resenas-pelicula">
        <h2 className="titulo-seccion-resenas">
          Todas las reseñas ({estadisticas.totalResenas})
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
              usuarioActual="usuario_actual"
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
