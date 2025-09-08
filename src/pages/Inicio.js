import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import TarjetaResena from '../componentes/TarjetaResena/TarjetaResena';
import FiltrosResenas from '../componentes/FiltrosResenas/FiltrosResenas';
import BarraOrdenamiento from '../componentes/BarraOrdenamiento/BarraOrdenamiento';
import ModalComentarios from '../componentes/ModalComentarios/ModalComentarios';
import './Inicio.css';
import { getReviews } from '../apis/reviews';

export const loader = async ({request}) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  // Ejemplo: obtener el filtro 'genero'
  const genero = searchParams.get('genero');
  const fechaPublicacion = searchParams.get('fechaPublicacion');
  const calificacion = searchParams.get('calificacion');
  const tags = searchParams.getAll('tags');
  const usuario = searchParams.get('usuario');
  const pelicula = searchParams.get('pelicula');
  const contieneEspoilers = searchParams.get('contieneEspoilers') === 'true';
  const soloMeGusta = searchParams.get('soloMeGusta') === 'true';

  const reviewsData = await getReviews(/* Pasamos los filtros despues */);
  return { reviewsData }
}

const Inicio = () => {
  const { reviewsData } = useLoaderData();
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
    aplicarOrdenamiento
  } = useResenas();

  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);

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
        <p>Cargando reseñas...</p>
      </div>
    );
  }

  return (
    <div className="pagina-inicio">
      {/* Hero Section */}
      <div className="seccion-hero">
        <div className="contenido-hero">
          <h1 className="titulo-hero">Descubre, Reseña, Comparte</h1>
          <p className="subtitulo-hero">
            Únete a la comunidad cinéfila más activa. Comparte tus opiniones y descubre nuevas películas.
          </p>
          <div className="botones-hero">
            <Link to="/crear" className="boton-principal-hero">
              ✏️ Escribir Reseña
            </Link>
            <Link to="/peliculas" className="boton-secundario-hero">
              🎬 Explorar Películas
            </Link>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="seccion-estadisticas">
        <div className="estadistica">
          <span className="numero-estadistica">{resenas.length}</span>
          <span className="etiqueta-estadistica">Reseñas totales</span>
        </div>
        <div className="estadistica">
          <span className="numero-estadistica">
            {new Set(resenas.map(r => r.titulo)).size}
          </span>
          <span className="etiqueta-estadistica">Películas reseñadas</span>
        </div>
        <div className="estadistica">
          <span className="numero-estadistica">
            {new Set(resenas.map(r => r.usuario)).size}
          </span>
          <span className="etiqueta-estadistica">Usuarios activos</span>
        </div>
        <div className="estadistica">
          <span className="numero-estadistica">
            {resenas.reduce((total, r) => total + r.likes, 0)}
          </span>
          <span className="etiqueta-estadistica">Likes totales</span>
        </div>
      </div>

      {/* Controles principales */}
      <div className="controles-principales">
        <h2 className="titulo-seccion">Reseñas Recientes</h2>

        {/* Filtros */}
        <FiltrosResenas/>

        {/* Barra de ordenamiento */}
        <BarraOrdenamiento
          onCambiarOrdenamiento={manejarCambiarOrdenamiento}
          ordenamientoActual={ordenamientoActual}
          totalResenas={reviewsData.length}
        />
      </div>

      {/* Lista de reseñas */}
      <div className="contenedor-resenas">
        {reviewsData.length === 0 ? (
          <div className="estado-vacio">
            <div className="icono-vacio">🎬</div>
            <h3>No se encontraron reseñas</h3>
            <p>Intenta ajustar los filtros o sé el primero en crear una reseña</p>
            <Link to="/crear" className="boton-crear-primera">
              Crear primera reseña
            </Link>
          </div>
        ) : (
          <div className="lista-resenas">
            {reviewsData.map(resena => (
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
