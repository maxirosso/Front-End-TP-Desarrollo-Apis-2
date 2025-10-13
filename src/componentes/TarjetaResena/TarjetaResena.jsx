import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
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
  
  // Hooks de autenticación y permisos
  const { usuario: usuarioAuth } = useAuth();
  const { puedeEditarComentario, puedeEliminarComentario } = usePermissions();

  // Verificación de seguridad después de los hooks
  if (!pelicula || !pelicula.id) {
    return null;
  }
  
  // Mapear datos del backend a formato esperado por el componente
  // Primero obtenemos el título para usarlo en la imagen de placeholder
  const titulo = pelicula?.title || pelicula?.titulo || 'Título no disponible';
  
  const {
    id,
    // año = pelicula?.year || pelicula?.año || 2024,
    // imagenUrl = pelicula?.poster_url || pelicula?.imagenUrl || `https://via.placeholder.com/120x180/34495e/ecf0f1?text=${encodeURIComponent(titulo)}`,
    calificacion = Number(pelicula?.rating || pelicula?.calificacion || 0),
    usuario = pelicula?.user_name || pelicula?.usuario || 'Usuario desconocido',
    fechaResena = pelicula?.created_at || pelicula?.fechaResena || 'Fecha no disponible',
    textoResena = pelicula?.body || pelicula?.textoResena || '',
    megusta = pelicula?.megusta || false,
    fechaVisionado = pelicula?.watch_date || pelicula?.created_at || 'No especificado',
    likes = Number(pelicula?.likes_count || pelicula?.likes || 0),
    yaLeDiLike = pelicula?.yaLeDiLike || false,
    // comentarios = pelicula?.comentarios || [],
    tags = pelicula?.tags || [],
    contieneEspoilers = pelicula?.has_spoilers || pelicula?.contieneEspoilers || false,
    moviePoster = pelicula?.movie_poster  || pelicula?.imagenUrl,
    // ✅ NUEVO: Detectar si la reseña fue editada
    fechaActualizacion = pelicula?.updated_at || null,
  } = pelicula || {};

  // ✅ NUEVO: Determinar si la reseña fue editada
  const fueEditada = fechaActualizacion && fechaActualizacion !== fechaResena && 
                     new Date(fechaActualizacion) > new Date(fechaResena);

  // Validar que los números sean válidos
  const calificacionSegura = isNaN(calificacion) ? 0 : calificacion;

  // Función para obtener el nombre del usuario por ID
  // const obtenerNombreUsuario = (userId) => {
  //   const id = Number(userId);
  //   switch (id) {
  //     case 1: return 'Admin';
  //     case 2: return 'Juan Pérez';
  //     case 3: return 'María García';
  //     case 4: return 'Carlos López';
  //     case 5: return 'Ana Martín';
  //     case 6: return 'Luis Rodríguez';
  //     default: return `Usuario ${id}`;
  //   }
  // };

  // ✅ MEJORADO: Determinar si puede editar/eliminar la reseña
  // El usuario puede editar/eliminar si:
  // 1. Es el propietario de la reseña (user_id coincide con el usuario autenticado)
  // 2. Tiene permisos de admin/moderador (puedeEditarComentario / puedeEliminarComentario)
  const userId = pelicula?.user_id;
  const esPropioDueño = usuarioAuth?.user_id === userId;
  const puedeEditar = esPropioDueño || puedeEditarComentario;
  const puedeEliminar = esPropioDueño || puedeEliminarComentario;

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
                {fechaVisionado && (
                  <span className="fecha-visionado">Visto el {fechaVisionado}</span>
                )}
              </div>
            </div>
          </header>

         

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
            <span className="fecha-publicacion">
              Posteado el {fechaResena}
              {fueEditada && <span className="indicador-editada"> (editada)</span>}
            </span>
            
            <div className="acciones-resena">
              {/* Botón de like */}
              <button 
                className={`boton-like `}
                onClick={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  // onToggleLike && onToggleLike(id);
                }}
                title={yaLeDiLike ? 'Sacar me gusta' : 'Me gusta'}
              >
                <span className="icono-like">
                  {yaLeDiLike ? '❤️' : '🤍'}
                </span>
                <span className="contador-likes">{isNaN(likes) ? 0 : likes}</span>
              </button>

              {/* Menú de acciones del propietario o moderador */}
              {(puedeEditar || puedeEliminar) && (
                <div className="menu-acciones-dueno">
                  <button 
                    className="boton-menu-acciones"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMostrarAcciones(!mostrarAcciones);
                    }}
                    title={esPropioDueño ? 'Acciones' : 'Acciones de moderación'}
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
                        {puedeEditar && (
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
                            ✏️ Editar {!esPropioDueño && '(Moderador)'}
                          </button>
                        )}
                        {puedeEliminar && (
                          <button 
                            className="opcion-eliminar"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Eliminar clicked!', id);
                              const mensaje = esPropioDueño 
                                ? '¿Estás seguro de que quieres eliminar esta reseña?'
                                : '¿Estás seguro de que quieres eliminar esta reseña? (Acción de moderador)';
                              if (window.confirm(mensaje)) {
                                onEliminar && onEliminar(id);
                              }
                              setMostrarAcciones(false);
                            }}
                          >
                            🗑️ Eliminar {!esPropioDueño && '(Moderador)'}
                          </button>
                        )}
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
