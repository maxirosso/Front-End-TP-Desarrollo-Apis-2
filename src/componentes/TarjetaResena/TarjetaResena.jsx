import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import './TarjetaResena.css';

// Normaliza tags:
// null/undefined → []
// Array → igual
// '["a","b"]' → JSON
// '{"a","b"}' → Postgres text[]
// 'a,b' → split
const normalizarTags = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {}
    }

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const inner = trimmed.slice(1, -1);
      return inner
        .split(',')
        .map((raw) =>
          raw.trim().replace(/^"+|"+$/g, '')
        )
        .filter(Boolean);
    }

    return trimmed
      .split(/[,\|]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return [];
};

const TarjetaResena = ({
  pelicula,
  onEliminar = () => {},
  onEditar = () => {},
  onToggleLike = () => {},
  onAbrirComentarios = () => {},
  usuarioActual = 'usuario_actual',
}) => {
  const [mostrarAcciones, setMostrarAcciones] = useState(false);
  const [textoCompleto, setTextoCompleto] = useState(false);

  const { usuario: usuarioAuth } = useAuth();
  const { puedeEditarComentario, puedeEliminarComentario } = usePermissions();

  if (!pelicula || !pelicula.id) return null;

  // Campos crudos desde el back
  const {
    id,
    rating,
    calificacion: calificacionAlt,
    user_name,
    usuario: usuarioAlt,
    created_at,
    fechaResena: fechaResenaAlt,
    body,
    textoResena: textoResenaAlt,
    title,                // título de la reseña
    title_review,
    tituloResena: tituloResenaAlt,
    has_spoilers,
    contieneEspoilers: contieneEspoilersAlt,
    movie_title,
    movie_poster,
    poster_url,
    imagenUrl,
    updated_at,
    user_id,
    tags: tagsRaw,
    likes_count,
    likes,
  } = pelicula;

  // 🔹 Título de la película (usa SIEMPRE el campo de movie)
  const movieTitle =
    movie_title ||
    pelicula.movieTitle ||
    pelicula.titulo_pelicula ||
    'Título no disponible';

  // 🔹 Título de la reseña (usa el título de la review)
  const reviewTitle =
    title_review || tituloResenaAlt || title || '';

  // Resto de normalizaciones
  const calificacion = Number(
    rating ?? calificacionAlt ?? 0
  );
  const calificacionSegura = isNaN(calificacion) ? 0 : calificacion;

  const usuarioMostrar =
    user_name || usuarioAlt || 'Usuario desconocido';

  const fechaResena =
    created_at || fechaResenaAlt || 'Fecha no disponible';

  const textoResena =
    body || textoResenaAlt || '';

  const tags = normalizarTags(tagsRaw);

  const contieneEspoilers =
    has_spoilers ?? contieneEspoilersAlt ?? false;

  const moviePoster = (movie_poster || poster_url || imagenUrl || '').trim();

  const posterFallback = `https://via.placeholder.com/160x240/1a1f2e/6366f1?text=${encodeURIComponent(
    movieTitle || 'Sin+imagen'
  )}`;

  const fechaActualizacion = updated_at || null;

  // Contador de likes
  const likesCount = parseInt(likes_count || likes || 0);

  const fueEditada =
    fechaActualizacion &&
    fechaActualizacion !== fechaResena &&
    new Date(fechaActualizacion) > new Date(fechaResena);

  const esPropioDueño = usuarioAuth?.user_id === user_id;
  const puedeEditar = esPropioDueño || puedeEditarComentario;
  const puedeEliminar = esPropioDueño || puedeEliminarComentario;

  const truncarTexto = (texto, limite = 150) => {
    if (!texto || typeof texto !== 'string') return '';
    if (texto.length <= limite) return texto;
    return textoCompleto
      ? texto
      : texto.substring(0, limite) + '...';
  };

  const generarEstrellas = (puntuacion) => {
    const estrellas = [];
    const puntuacionRedondeada =
      Math.round(puntuacion * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= puntuacionRedondeada) {
        estrellas.push(
          <span key={i} className="estrella completa">
            ★
          </span>
        );
      } else if (i - 0.5 === puntuacionRedondeada) {
        estrellas.push(
          <span key={i} className="estrella media">
            ☆
          </span>
        );
      } else {
        estrellas.push(
          <span key={i} className="estrella vacia">
            ☆
          </span>
        );
      }
    }

    return estrellas;
  };

  return (
    <article className="tarjeta-resena">
      <div className="contenido-resena">
        {/* Póster */}
        <div className="contenedor-imagen-pelicula">
          <img
            src={moviePoster || posterFallback}
            alt={`Póster de ${movieTitle}`}
            className="imagen-pelicula"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = posterFallback;
            }}
          />
        </div>

        {/* Info reseña */}
        <div className="informacion-resena">
          <header className="encabezado-resena">
            <div className="info-usuario">
              <span className="nombre-usuario">
                Reseña de {usuarioMostrar}
                {esPropioDueño && (
                  <span className="indicador-propietario">
                    TU RESEÑA
                  </span>
                )}
              </span>
            </div>
          </header>

          {/* Título de la película */}
          <div className="titulo-pelicula-contenedor">
            <Link
              to={`/pelicula/${encodeURIComponent(movieTitle)}`}
              className="enlace-titulo-pelicula"
            >
              <h3 className="titulo-resenia">
                {movieTitle}
              </h3>
            </Link>
          </div>

          {/* Título de la reseña */}
          {reviewTitle && (
            <div className="titulo-resena-contenedor">
              <h4 className="titulo-resena">
                {reviewTitle}
              </h4>
            </div>
          )}

          {/* Calificación */}
          {calificacionSegura >= 0 && (
            <div className="calificacion-contenedor">
              <div className="estrellas-calificacion">
                {generarEstrellas(calificacionSegura)}
              </div>
            </div>
          )}

          {/* Texto */}
          <div className="texto-resena">
            <p>{truncarTexto(textoResena)}</p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="tags-resena">
              {tags.map((tag, i) => (
                <span key={i} className="tag-resena">
                  {String(tag)}
                </span>
              ))}
            </div>
          )}

          {/* Spoilers */}
          {contieneEspoilers && (
            <div className="advertencia-spoilers">
              ⚠️ Esta reseña tiene spoilers
            </div>
          )}

          {/* Pie */}
          <footer className="pie-resena">
            <div className="info-footer">
              <span className="fecha-publicacion">
                Posteado el {new Date(fechaResena).toLocaleTimeString([], {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
                {fueEditada && (
                  <span className="indicador-editada">
                    {' '}
                    (editada)
                  </span>
                )}
              </span>
              
              {/* Contador de likes */}
              <span className="contador-likes-texto">
                ❤️ {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </span>
            </div>

            <div className="acciones-resena">
              {(puedeEditar || puedeEliminar) && (
                <div className="menu-acciones-dueno">
                  <button
                    className="boton-menu-acciones"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMostrarAcciones(!mostrarAcciones);
                    }}
                    title={
                      esPropioDueño
                        ? 'Acciones'
                        : 'Acciones de moderación'
                    }
                  >
                    ⋮
                  </button>

                  {mostrarAcciones && (
                    <>
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
                              onEditar(pelicula);
                              setMostrarAcciones(false);
                            }}
                          >
                            ✏️ Editar
                            {!esPropioDueño &&
                              ' (Moderador)'}
                          </button>
                        )}
                        {puedeEliminar && (
                          <button
                            className="opcion-eliminar"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const mensaje =
                                esPropioDueño
                                  ? '¿Estás seguro de que quieres eliminar esta reseña?'
                                  : '¿Estás seguro de que quieres eliminar esta reseña? (Acción de moderador)';
                              if (window.confirm(mensaje)) {
                                onEliminar(id);
                              }
                              setMostrarAcciones(false);
                            }}
                          >
                            🗑️ Eliminar
                            {!esPropioDueño &&
                              ' (Moderador)'}
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
