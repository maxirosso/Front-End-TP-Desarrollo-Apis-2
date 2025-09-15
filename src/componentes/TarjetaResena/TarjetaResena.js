import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TarjetaResena.css';

const TarjetaResena = ({ 
  pelicula, 
  onEliminar = () => {}, 
  onEditar = () => {}, 
  onToggleLike = () => {}, 
  onAbrirComentarios = () => {},
  usuarioActual = 'usuario_actual' 
}) => {
  // Los hooks SIEMPRE deben llamarse primero
  const [mostrarAcciones, setMostrarAcciones] = useState(false);
  const [textoCompleto, setTextoCompleto] = useState(false);

  // Verificación de seguridad después de los hooks
  if (!pelicula || !pelicula.id) {
    return null;
  }
  
  // Mapear datos del backend a formato esperado por el componente
  console.log('🎬 TARJETA RESENA - Datos recibidos:', pelicula);
  
  const {
    id,
    titulo = pelicula?.title || pelicula?.titulo || 'Título no disponible',
    año = pelicula?.year || pelicula?.año || 2024,
    imagenUrl = pelicula?.poster_url || pelicula?.imagenUrl,
    calificacion = Number(pelicula?.rating || pelicula?.calificacion || 0),
    usuario = pelicula?.user_name || pelicula?.usuario || 'Usuario desconocido',
    fechaResena = pelicula?.created_at || pelicula?.fechaResena || 'Fecha no disponible',
    textoResena = pelicula?.body || pelicula?.textoResena || '',
    megusta = pelicula?.megusta || false,
    fechaVisionado = pelicula?.fechaVisionado,
    likes = Number(pelicula?.likes || 0),
    yaLeDiLike = pelicula?.yaLeDiLike || false,
    comentarios = pelicula?.comentarios || [],
    tags = pelicula?.tags || [],
    contieneEspoilers = pelicula?.has_spoilers || pelicula?.contieneEspoilers || false,
    movieTitle = pelicula?.movie_title || pelicula?.titulo || pelicula?.title || 'Título no disponible',
    moviePoster = pelicula?.movie_poster  || pelicula?.imagenUrl,
  } = pelicula || {};

  console.log('🎬 TARJETA RESENA - Datos mapeados:');
  console.log('  - titulo:', titulo, '(de:', pelicula?.titulo, '/', pelicula?.title, ')');
  console.log('  - usuario:', usuario, '(de:', pelicula?.usuario, '/', pelicula?.user_name, ')');
  console.log('  - calificacion:', calificacion, '(de:', pelicula?.calificacion, '/', pelicula?.rating, ')');
  console.log('  - año:', año, '(de:', pelicula?.año, '/', pelicula?.year, ')');
  console.log('  - imagenUrl:', imagenUrl, '(de:', pelicula?.imagenUrl, '/', pelicula?.poster_url, ')');
  console.log('  - fechaResena:', fechaResena, '(de:', pelicula?.fechaResena, '/', pelicula?.created_at, ')');
  console.log('  - textoResena:', textoResena, '(de:', pelicula?.textoResena, '/', pelicula?.body, ')');
  console.log('  - megusta:', megusta, '(de:', pelicula?.megusta, ')');
  console.log('  - fechaVisionado:', fechaVisionado, '(de:', pelicula?.fechaVisionado, ')');
  console.log('  - likes:', likes, '(de:', pelicula?.likes, ')');
  console.log('  - yaLeDiLike:', yaLeDiLike, '(de:', pelicula?.yaLeDiLike, ')');
  console.log('  - comentarios:', comentarios.length, '(de:', pelicula?.comentarios?.length, ')');
  console.log('  - tags:', tags, '(de:', pelicula?.tags, ')');
  console.log('  - contieneEspoilers:', contieneEspoilers, '(de:', pelicula?.contieneEspoilers, '/', pelicula?.has_spoilers, ')');
  console.log('  - movieTitle:', movieTitle, '(de:', pelicula?.movie_title, '/', pelicula?.titulo, '/', pelicula?.title, ')');




  // Validar que los números sean válidos
  const calificacionSegura = isNaN(calificacion) ? 0 : calificacion;
  const añoSeguro = isNaN(año) ? 2024 : año;

  const esPropioDueño = usuario === usuarioActual;

  // Función auxiliar para truncar texto
  const truncarTexto = (texto, limite = 300) => {
    if (!texto || typeof texto !== 'string') return '';
    if (texto.length <= limite) return texto;
    return textoCompleto ? texto : texto.substring(0, limite) + '...';
  };

  // Función para generar estrellas basada en la calificación
  const generarEstrellas = (puntuacion) => {
    const estrellas = [];
    const puntuacionRedondeada = Math.round(puntuacion * 2) / 2; // Redondear a medias estrellas
    
    for (let i = 1; i <= 5; i++) {
      if (i <= puntuacionRedondeada) {
        estrellas.push(<span key={i} className="estrella completa">★</span>);
      } else if (i - 0.5 === puntuacionRedondeada) {
        estrellas.push(<span key={i} className="estrella media">☆</span>);
      } else {
        estrellas.push(<span key={i} className="estrella vacia">☆</span>);
      }
    }
    return estrellas;
  };

  return (
    <article className="tarjeta-resena">
      <div className="contenido-resena">
        {/* Imagen de la película */}
        <div className="contenedor-imagen-pelicula">
          <img 
            src={moviePoster} 
            alt={`Póster de ${titulo}`}
            className="imagen-pelicula"
          />
        </div>

        {/* Información y reseña */}
        <div className="informacion-resena">
          {/* Encabezado */}
          <header className="encabezado-resena">
            <div className="info-usuario">
              <span className="nombre-usuario">
                Reseña de {usuario}
                {esPropioDueño && <span className="indicador-propietario">TU RESEÑA</span>}
              </span>
              <div className="fechas-resena">
                <span className="fecha-visionado">Visto el {fechaVisionado}</span>
              </div>
            </div>
          </header>

          {/* Título y año de la película */}
          <div className="titulo-pelicula-contenedor">
            <Link 
              to={`/pelicula/${encodeURIComponent(titulo)}`}
              className="enlace-titulo-pelicula"
            >
              <h3 className="titulo-pelicula">{movieTitle}</h3>
            </Link>
            <span className="año-pelicula">{añoSeguro}</span>
          </div>

          <div className="titulo-pelicula-contenedor">
            <Link 
              to={`/pelicula/${encodeURIComponent(titulo)}`}
              className="enlace-titulo-pelicula"
            >
              <h3 className="titulo-resenia">{titulo}</h3>
            </Link>
          </div>

          {/* Calificación con estrellas */}
          <div className="calificacion-contenedor">
            <div className="estrellas-calificacion">
              {generarEstrellas(calificacionSegura)}
            </div>
            {megusta && <span className="icono-megusta">❤️</span>}
          </div>

          {/* Texto de la reseña */}
          <div className="texto-resena">
            <p>{truncarTexto(textoResena)}</p>
            {textoResena && textoResena.length > 300 && (
              <button 
                className="boton-ver-mas"
                onClick={() => setTextoCompleto(!textoCompleto)}
              >
                {textoCompleto ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>

          {/* Tags de la reseña */}
          {tags.length > 0 && (
            <div className="tags-resena">
              {tags.map((tag, index) => (
                <span key={index} className="tag-resena">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Advertencia de spoilers */}
          {contieneEspoilers && (
            <div className="advertencia-spoilers">
              ⚠️ Esta reseña tiene spoilers
            </div>
          )}

          {/* Pie de la reseña */}
          <footer className="pie-resena">
            <span className="fecha-publicacion">Posteado el {fechaResena}</span>
            
            <div className="acciones-resena">
              {/* Botón de like */}
              <button 
                className={`boton-like ${yaLeDiLike ? 'activo' : ''}`}
                onClick={() => onToggleLike && onToggleLike(id)}
                title={yaLeDiLike ? 'Sacar me gusta' : 'Me gusta'}
              >
                <span className="icono-like">
                  {yaLeDiLike ? '❤️' : '🤍'}
                </span>
                <span className="contador-likes">{likes}</span>
              </button>

              {/* Botón de comentarios */}
              <button 
                className="boton-comentar"
                onClick={() => onAbrirComentarios && onAbrirComentarios(id)}
              >
                💬 Comentarios
                {comentarios.length > 0 && (
                  <span className="contador-comentarios">({comentarios.length})</span>
                )}
              </button>

              {/* Menú de acciones del propietario */}
              {esPropioDueño && (
                <div className="menu-acciones-dueno">
                  <button 
                    className="boton-menu-acciones"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMostrarAcciones(!mostrarAcciones);
                    }}
                  >
                    ⋮
                  </button>
                  
                  {mostrarAcciones && (
                    <>
                      {/* Overlay para cerrar menú de acciones */}
                      <div 
                        className="overlay-acciones"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMostrarAcciones(false);
                        }}
                      />
                      <div className="opciones-acciones">
                        <button 
                          className="opcion-editar"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Editar clicked!', pelicula);
                            onEditar && onEditar(pelicula);
                            setMostrarAcciones(false);
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="opcion-eliminar"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Eliminar clicked!', id);
                            if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
                              onEliminar && onEliminar(id);
                            }
                            setMostrarAcciones(false);
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default TarjetaResena;
