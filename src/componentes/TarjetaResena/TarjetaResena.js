import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TarjetaResena.css';

const TarjetaResena = ({ 
  pelicula, 
  onEliminar, 
  onEditar, 
  onToggleLike, 
  onAbrirComentarios,
  usuarioActual = 'usuario_actual' 
}) => {
  const {
    id,
    titulo,
    año,
    imagenUrl,
    calificacion,
    usuario,
    fechaResena,
    textoResena,
    megusta,
    fechaVisionado,
    likes = 0,
    yaLeDiLike = false,
    comentarios = [],
    tags = [],
    contieneEspoilers = false
  } = pelicula;

  const [mostrarAcciones, setMostrarAcciones] = useState(false);
  const [textoCompleto, setTextoCompleto] = useState(false);

  const esPropioDueño = usuario === usuarioActual;

  // Función auxiliar para truncar texto
  const truncarTexto = (texto, limite = 300) => {
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
            src={imagenUrl} 
            alt={`Póster de ${titulo}`}
            className="imagen-pelicula"
          />
        </div>

        {/* Información y reseña */}
        <div className="informacion-resena">
          {/* Encabezado */}
          <header className="encabezado-resena">
            <div className="info-usuario">
              <span className="nombre-usuario">Reseña de {usuario}</span>
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
              <h3 className="titulo-pelicula">{titulo}</h3>
            </Link>
            <span className="año-pelicula">{año}</span>
          </div>

          {/* Calificación con estrellas */}
          <div className="calificacion-contenedor">
            <div className="estrellas-calificacion">
              {generarEstrellas(calificacion)}
            </div>
            {megusta && <span className="icono-megusta">❤️</span>}
          </div>

          {/* Texto de la reseña */}
          <div className="texto-resena">
            <p>{truncarTexto(textoResena)}</p>
            {textoResena.length > 300 && (
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
              ⚠️ Esta reseña contiene spoilers
            </div>
          )}

          {/* Pie de la reseña */}
          <footer className="pie-resena">
            <span className="fecha-publicacion">Publicado el {fechaResena}</span>
            
            <div className="acciones-resena">
              {/* Botón de like */}
              <button 
                className={`boton-like ${yaLeDiLike ? 'activo' : ''}`}
                onClick={() => onToggleLike && onToggleLike(id)}
                title={yaLeDiLike ? 'Quitar me gusta' : 'Me gusta'}
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
                    onClick={() => setMostrarAcciones(!mostrarAcciones)}
                  >
                    ⋮
                  </button>
                  
                  {mostrarAcciones && (
                    <div className="opciones-acciones">
                      <button 
                        className="opcion-editar"
                        onClick={() => {
                          onEditar && onEditar(pelicula);
                          setMostrarAcciones(false);
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="opcion-eliminar"
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
                            onEliminar && onEliminar(id);
                          }
                          setMostrarAcciones(false);
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </footer>
        </div>
      </div>

      {/* Overlay para cerrar menú de acciones */}
      {mostrarAcciones && (
        <div 
          className="overlay-acciones"
          onClick={() => setMostrarAcciones(false)}
        />
      )}
    </article>
  );
};

export default TarjetaResena;
