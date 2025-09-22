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
  
  // Primero obtenemos el título para usarlo en la imagen de placeholder
  const titulo = pelicula?.title || pelicula?.titulo || 'Título no disponible';
  
  const {
    id,
    año = pelicula?.year || pelicula?.año || 2024,
    imagenUrl = pelicula?.poster_url || pelicula?.imagenUrl || `https://via.placeholder.com/120x180/34495e/ecf0f1?text=${encodeURIComponent(titulo)}`,
    calificacion = Number(pelicula?.rating || pelicula?.calificacion || 0),
    usuario = pelicula?.user_name || pelicula?.usuario || 'Usuario desconocido',
    fechaResena = pelicula?.created_at || pelicula?.fechaResena || 'Fecha no disponible',
    textoResena = pelicula?.body || pelicula?.textoResena || '',
    megusta = pelicula?.megusta || false,
    fechaVisionado = pelicula?.watch_date || pelicula?.created_at || 'No especificado',
    likes = Number(pelicula?.likes_count || pelicula?.likes || 0),
    yaLeDiLike = pelicula?.yaLeDiLike || false,
    comentarios = pelicula?.comentarios || [],
    tags = pelicula?.tags || [],
    contieneEspoilers = pelicula?.has_spoilers || pelicula?.contieneEspoilers || false,
    movieTitle = pelicula?.movie_title || pelicula?.titulo || pelicula?.title || 'Título no disponible',
    moviePoster = pelicula?.movie_poster  || pelicula?.imagenUrl,
    // ✅ NUEVO: Detectar si la reseña fue editada
    fechaActualizacion = pelicula?.updated_at || null,
  } = pelicula || {};

  // ✅ NUEVO: Determinar si la reseña fue editada
  const fueEditada = fechaActualizacion && fechaActualizacion !== fechaResena && 
                     new Date(fechaActualizacion) > new Date(fechaResena);

  console.log('🎬 TARJETA RESENA - Datos mapeados:');
  console.log('  - titulo:', titulo, '(de:', pelicula?.titulo, '/', pelicula?.title, ')');
  console.log('  - usuario:', usuario, '(de:', pelicula?.usuario, '/', pelicula?.user_name, ')');
  console.log('  - calificacion:', calificacion, '(de:', pelicula?.calificacion, '/', pelicula?.rating, ')');
  console.log('  - año:', año, '(de:', pelicula?.año, '/', pelicula?.year, ')');
  console.log('  - imagenUrl:', imagenUrl?.substring(0, 50) + '...', '(de poster_url o generada)');
  console.log('  - fechaResena:', fechaResena, '(de:', pelicula?.fechaResena, '/', pelicula?.created_at, ')');
  console.log('  - fechaActualizacion:', fechaActualizacion, '(de:', pelicula?.updated_at, ')');
  console.log('  - fueEditada:', fueEditada);
  console.log('  - textoResena:', textoResena?.substring(0, 50) + '...', '(de:', pelicula?.textoResena ? 'textoResena' : 'body', ')');
  console.log('  - fechaVisionado:', fechaVisionado, '(de:', pelicula?.fechaVisionado, ')');
  console.log('  - likes:', likes, '(de:', pelicula?.likes, ')');
  console.log('  - comentarios:', comentarios.length, '(de:', pelicula?.comentarios?.length, ')');




  // Validar que los números sean válidos
  const calificacionSegura = isNaN(calificacion) ? 0 : calificacion;
  const añoSeguro = isNaN(año) ? 2024 : año;

  // Función para obtener el nombre del usuario por ID
  const obtenerNombreUsuario = (userId) => {
    const id = Number(userId);
    switch (id) {
      case 1: return 'Admin';
      case 2: return 'Juan Pérez';
      case 3: return 'María García';
      case 4: return 'Carlos López';
      case 5: return 'Ana Martín';
      case 6: return 'Luis Rodríguez';
      default: return `Usuario ${id}`;
    }
  };

  // Determinar si es el propietario comparando tanto por ID como por nombre
  const usuarioActualNombre = obtenerNombreUsuario(usuarioActual);
  const esPropioDueño = (pelicula?.user_id === usuarioActual) || 
                        (usuario === usuarioActualNombre) ||
                        (usuario === `usuario_${usuarioActual}`);

  console.log('🔒 PROPIETARIO CHECK:');
  console.log('  - usuarioActual (ID):', usuarioActual);
  console.log('  - usuarioActualNombre:', usuarioActualNombre);
  console.log('  - pelicula.user_id:', pelicula?.user_id);
  console.log('  - usuario (nombre):', usuario);
  console.log('  - esPropioDueño:', esPropioDueño);

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
