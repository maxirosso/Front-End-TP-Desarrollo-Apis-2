import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import FiltrosResenas from '../componentes/FiltrosResenas/FiltrosResenas';
import BarraOrdenamiento from '../componentes/BarraOrdenamiento/BarraOrdenamiento';
import ModalComentarios from '../componentes/ModalComentarios/ModalComentarios';
import './Inicio.css';

const Inicio = () => {
  const {
    resenas,
    cargando,
    filtrosActivos,
    ordenamientoActual,
    setFiltrosActivos,
    setOrdenamientoActual,
    eliminarResena,
    toggleLikeResena,
    agregarComentario,
    aplicarFiltros,
    aplicarOrdenamiento,
    usingBackend
  } = useResenas();

  const [resenasFiltradas, setResenasFiltradas] = useState([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    const aplicarFiltrosYOrdenamiento = async () => {
      try {
        // Verificar si algún filtro requiere backend
        const requiereBackend = filtrosActivos.genero || 
                               (usingBackend && (filtrosActivos.calificacion || filtrosActivos.usuario || filtrosActivos.pelicula));
        
        let resenasProcesadas;
        if (requiereBackend) {
          // Usar función asíncrona del contexto
          resenasProcesadas = await aplicarFiltros(filtrosActivos);
        } else {
          // Usar función síncrona local
          resenasProcesadas = aplicarOrdenamiento(resenas, ordenamientoActual);
          resenasProcesadas = resenasProcesadas.filter(resena => {
            // Aplicar filtros simples localmente
            if (filtrosActivos.pelicula) {
              const titulo = resena.movie_title || resena.titulo || resena.title || '';
              if (!titulo.toLowerCase().startsWith(filtrosActivos.pelicula.toLowerCase())) {
                return false;
              }
            }
            if (filtrosActivos.usuario) {
              const usuario = resena.user_name || resena.usuario || '';
              if (!usuario || !usuario.toLowerCase().startsWith(filtrosActivos.usuario.toLowerCase())) {
                return false;
              }
            }
            return true;
          });
        }
        
        const resenasOrdenadas = aplicarOrdenamiento(resenasProcesadas, ordenamientoActual);
        setResenasFiltradas(resenasOrdenadas);
      } catch (error) {
        console.error('Error aplicando filtros:', error);
        // Fallback: usar las reseñas originales
        const resenasOrdenadas = aplicarOrdenamiento(resenas, ordenamientoActual);
        setResenasFiltradas(resenasOrdenadas);
      }
    };

    aplicarFiltrosYOrdenamiento();
  }, [resenas, filtrosActivos, ordenamientoActual, aplicarFiltros, aplicarOrdenamiento, usingBackend]);

  // Funciones de manejo de eventos
  const manejarEliminarResena = (id) => {
    eliminarResena(id);
  };

  const manejarEditarResena = (resena) => {
    // Navegar a la página de edición
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

  const manejarAplicarFiltros = (filtros) => {
    setFiltrosActivos(filtros);
  };

  const manejarLimpiarFiltros = () => {
    setFiltrosActivos({});
  };

  const manejarCambiarOrdenamiento = (ordenamiento) => {
    setOrdenamientoActual(ordenamiento);
  };

  const manejarAgregarComentario = (idResena, comentario) => {
    agregarComentario(idResena, comentario);
  };

  if (cargando) {
    return (
      <div className="contenedor-cargando">
        <div className="spinner-carga">
          <div className="punto-carga"></div>
          <div className="punto-carga"></div>
          <div className="punto-carga"></div>
        </div>
        <p>Cargando las reseñas más copadas...</p>
      </div>
    );
  }

  return (
    <div className="pagina-inicio">
      {/* Hero Section */}
      <div className="seccion-hero">
        <div className="contenido-hero">
          <h1 className="titulo-hero">Descubrí, Reseñá, Compartí</h1>
          <p className="subtitulo-hero">
            Sumate a la comunidad cinéfila más copada. Compartí tus opiniones y descubrí pelis geniales.
          </p>
          <div className="botones-hero">
            <Link to="/crear" className="boton-principal-hero">
              ✏️ Escribir mi Reseña
            </Link>
            <Link to="/peliculas" className="boton-secundario-hero">
              🎬 Ver todas las Pelis
            </Link>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="seccion-estadisticas">
        <div className="estadistica">
          <span className="numero-estadistica">{resenas.length}</span>
          <span className="etiqueta-estadistica">Reseñas en total</span>
        </div>
        <div className="estadistica">
          <span className="numero-estadistica">
            {/* {new Set(resenas.map(r => r.titulo)).size} */}
            {new Set(resenas.map(r => r.movie_title || r.titulo)).size}
          </span>
          <span className="etiqueta-estadistica">Pelis reseñadas</span>
        </div>
        <div className="estadistica">
          <span className="numero-estadistica">
            {new Set(resenas.map(r => r.user_name || r.usuario)).size}
            {/* {new Set(resenas.map(r => r.usuario)).size} */}
          </span>
          <span className="etiqueta-estadistica">Usuarios copados</span>
        </div>
        <div className="estadistica">
          <span className="numero-estadistica">
            {resenas.reduce((total, r) => total + parseInt(r.likes_count || r.likes || 0), 0)}
          </span>
          <span className="etiqueta-estadistica">Me gusta total</span>
        </div>
      </div>

      {/* Controles principales */}
      <div className="controles-principales">
        <h2 className="titulo-seccion">Las Últimas Reseñas</h2>
        
        {/* Filtros */}
        <FiltrosResenas
          onAplicarFiltros={manejarAplicarFiltros}
          filtrosActivos={filtrosActivos}
          onLimpiarFiltros={manejarLimpiarFiltros}
        />

        {/* Barra de ordenamiento */}
        <BarraOrdenamiento
          onCambiarOrdenamiento={manejarCambiarOrdenamiento}
          ordenamientoActual={ordenamientoActual}
          totalResenas={resenasFiltradas.length}
        />
      </div>

      {/* Lista de reseñas */}
      <div className="contenedor-resenas">
        {resenasFiltradas.length === 0 ? (
          <div className="estado-vacio">
            <div className="icono-vacio">🎬</div>
            <h3>No encontramos ninguna reseña</h3>
            <p>Probá ajustando los filtros, escribí palabras más generales o sé el primero en crear una reseña copada</p>
            <div className="sugerencias-filtro">
              <small>💡 Tip: Probá buscar por palabras como "padrino", "historia", "blade", etc.</small>
            </div>
            <Link to="/crear" className="boton-crear-primera">
              Escribir la primera reseña
            </Link>
          </div>
        ) : (
          <div className="lista-resenas">
            {resenasFiltradas
              .filter(resena => resena && resena.id) // Filtrar reseñas válidas
              .map(resena => (
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
        )}
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

export default Inicio;
