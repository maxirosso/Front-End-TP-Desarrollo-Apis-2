import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import FiltrosResenas from '../componentes/FiltrosResenas/FiltrosResenas';
import BarraOrdenamiento from '../componentes/BarraOrdenamiento/BarraOrdenamiento';
import ModalComentarios from '../componentes/ModalComentarios/ModalComentarios';
import './Inicio.css';

const Inicio = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    resenas,
    cargando,
    filtrosActivos,
    ordenamientoActual,
    usuarioActual,
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

  // Manejar búsqueda desde URL
  useEffect(() => {
    const terminoBusqueda = searchParams.get('busqueda');
    if (terminoBusqueda) {
      setFiltrosActivos(prev => ({
        ...prev,
        pelicula: terminoBusqueda
      }));
    }
  }, [searchParams, setFiltrosActivos]);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    const aplicarFiltrosYOrdenamiento = async () => {
      try {
        // Verificar si algún filtro requiere backend
        // const requiereBackend = usingBackend && (
        //   filtrosActivos.genero || 
        //   filtrosActivos.calificacion || 
        //   filtrosActivos.tags?.length > 0 ||
        //   filtrosActivos.fechaPublicacion
        // );
        
        let resenasProcesadas;
        // if (requiereBackend) {
          // Usar función asíncrona del contexto
          debugger
          resenasProcesadas = await aplicarFiltros(filtrosActivos);
        // } else {
        //   // Usar datos locales
        //   resenasProcesadas = [...resenas];
          
        //   // Aplicar filtros simples localmente
        //   if (filtrosActivos.pelicula) {
        //     resenasProcesadas = resenasProcesadas.filter(resena => {
        //       const titulo = resena.movie_title || resena.titulo || resena.title || '';
        //       return titulo.toLowerCase().includes(filtrosActivos.pelicula.toLowerCase());
        //     });
        //   }
          
        //   if (filtrosActivos.usuario) {
        //     resenasProcesadas = resenasProcesadas.filter(resena => {
        //       const usuario = resena.user_name || resena.usuario || '';
        //       return usuario && usuario.toLowerCase().startsWith(filtrosActivos.usuario.toLowerCase());
        //     });
        //   }

        //   if (filtrosActivos.calificacion) {
        //     const calExacta = parseInt(filtrosActivos.calificacion);
        //     resenasProcesadas = resenasProcesadas.filter(resena => {
        //       const calificacion = resena.calificacion || resena.rating || 0;
        //       return Number(calificacion) === calExacta;
        //     });
        //   }

        //   if (filtrosActivos.genero) {
        //     resenasProcesadas = resenasProcesadas.filter(resena => {
        //       const genero = resena.movie_genre || resena.genero || resena.genre || '';
        //       return genero === filtrosActivos.genero;
        //     });
        //   }

        //   if (filtrosActivos.tags && filtrosActivos.tags.length > 0) {
        //     resenasProcesadas = resenasProcesadas.filter(resena =>
        //       resena.tags && filtrosActivos.tags.some(tag => resena.tags.includes(tag))
        //     );
        //   }

        //   if (filtrosActivos.soloMeGusta) {
        //     resenasProcesadas = resenasProcesadas.filter(resena => resena.megusta);
        //   }

        //   if (!filtrosActivos.contieneEspoilers) {
        //     resenasProcesadas = resenasProcesadas.filter(resena => 
        //       !resena.has_spoilers && !resena.contieneEspoilers
        //     );
        //   }

        //   // Filtro por fecha de publicación
        //   if (filtrosActivos.fechaPublicacion) {
        //     const now = new Date();
        //     let startDate;
            
        //     switch (filtrosActivos.fechaPublicacion) {
        //       case 'hoy':
        //         startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        //         break;
        //       case 'esta-semana':
        //         startDate = new Date(now);
        //         startDate.setDate(now.getDate() - 7);
        //         break;
        //       case 'este-mes':
        //         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        //         break;
        //       case 'este-año':
        //         startDate = new Date(now.getFullYear(), 0, 1);
        //         break;
        //       default:
        //         startDate = null;
        //     }
            
        //     if (startDate) {
        //       resenasProcesadas = resenasProcesadas.filter(resena => {
        //         const fechaResena = new Date(resena.created_at || resena.fechaResena);
        //         return fechaResena >= startDate;
        //       });
        //     }
        //   }
        // }
        
        // Siempre aplicar ordenamiento al final
        const resenasOrdenadas = aplicarOrdenamiento(resenasProcesadas, ordenamientoActual);
        setResenasFiltradas(resenasOrdenadas);
      } catch (error) {
        console.error('Error aplicando filtros:', error);
        // Fallback: usar las reseñas originales ordenadas
        const resenasOrdenadas = aplicarOrdenamiento(resenas, ordenamientoActual);
        setResenasFiltradas(resenasOrdenadas);
      }
    };

    aplicarFiltrosYOrdenamiento();
  }, [resenas, filtrosActivos, ordenamientoActual, aplicarFiltros, aplicarOrdenamiento, usingBackend]);

  // ✅ NUEVO: Escuchar eventos de actualización de reseñas
  // useEffect(() => {
  //   const handleResenasUpdate = (event) => {
  //     console.log('🔔 Inicio: Recibido evento de reseñas actualizadas:', event.detail);
  //     // Los contadores se actualizarán automáticamente porque resenas cambiará
  //   };

  //   const handleForceRerender = (event) => {
  //     console.log('🔄 Inicio: Forzando re-render por:', event.detail.reason);
  //     // Forzar actualización del estado local si es necesario
  //     window.location.reload(); // Como último recurso para asegurar actualización
  //   };

  //   window.addEventListener('resenasActualizadas', handleResenasUpdate);
  //   window.addEventListener('forceRerender', handleForceRerender);
    
  //   return () => {
  //     window.removeEventListener('resenasActualizadas', handleResenasUpdate);
  //     window.removeEventListener('forceRerender', handleForceRerender);
  //   };
  // }, []);

  // ✅ NUEVO: Escuchar evento de reseñas actualizadas para recargar automáticamente  
  // useEffect(() => {
  //   const manejarResenasActualizadas = () => {
  //     console.log('🔔 Inicio: Reseñas actualizadas detectadas');
  //     // No necesitamos hacer nada especial aquí porque el contexto ya actualiza `resenas`
  //     // y el useEffect anterior se ejecutará automáticamente
  //   };

  //   window.addEventListener('resenasActualizadas', manejarResenasActualizadas);
    
  //   return () => {
  //     window.removeEventListener('resenasActualizadas', manejarResenasActualizadas);
  //   };
  // }, []);

  // Funciones de manejo de eventos
  const manejarEliminarResena = (id) => {
    eliminarResena(id);
  };

  const manejarEditarResena = (resena) => {
    // Navegar a la página de edición con la ruta correcta
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

      
      {/* Controles principales */}
      <div className="controles-principales">
        <h2 className="titulo-seccion">
          {filtrosActivos.pelicula ? 
            `Resultados para: "${filtrosActivos.pelicula}"` : 
            'Las Últimas Reseñas'
          }
        </h2>
        
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
                  usuarioActual={usuarioActual}
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
