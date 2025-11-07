import React, { useState } from 'react';
import { TAGS_DISPONIBLES } from '../../constants/tags'; // ✅ Importar tags compartidos
import './FiltrosResenas.css';

const FiltrosResenas = ({ onAplicarFiltros, filtrosActivos, onLimpiarFiltros }) => {
  const [filtrosLocales, setFiltrosLocales] = useState({
    calificacion: filtrosActivos.calificacion || '',
    fechaPublicacion: filtrosActivos.fechaPublicacion || '',
    genero: filtrosActivos.genero || '',
    tags: filtrosActivos.tags || [],
    usuario: filtrosActivos.usuario || '',
    pelicula: filtrosActivos.pelicula || '',
    contieneEspoilers: filtrosActivos.contieneEspoilers || false,
    soloMeGusta: filtrosActivos.soloMeGusta || false
  });

  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  const opcionesCalificacion = [
    { valor: '', etiqueta: 'Todas las puntuaciones' },
    { valor: '5', etiqueta: '5 estrellas' },
    { valor: '4', etiqueta: '4+ estrellas' },
    { valor: '3', etiqueta: '3+ estrellas' },
    { valor: '2', etiqueta: '2+ estrellas' },
    { valor: '1', etiqueta: '1+ estrellas' },
    { valor: '0', etiqueta: 'Sin calificación' }
  ];

  const opcionesFecha = [
    { valor: '', etiqueta: 'Cualquier fecha' },
    { valor: 'hoy', etiqueta: 'Hoy' },
    { valor: 'esta-semana', etiqueta: 'Esta semana' },
    { valor: 'este-mes', etiqueta: 'Este mes' },
    { valor: 'este-año', etiqueta: 'Este año' }
  ];

  const opcionesGenero = [
    { valor: '', etiqueta: 'Todos los géneros' },
    { valor: 'Acción', etiqueta: 'Acción' },
    { valor: 'Drama', etiqueta: 'Drama' },
    { valor: 'Comedia', etiqueta: 'Comedia' },
    { valor: 'Terror', etiqueta: 'Terror' },
    { valor: 'Romance', etiqueta: 'Romance' },
    { valor: 'Ciencia Ficción', etiqueta: 'Ciencia Ficción' },
    { valor: 'Thriller', etiqueta: 'Thriller' },
    { valor: 'Animación', etiqueta: 'Animación' },
    { valor: 'Fantasía', etiqueta: 'Fantasía' },
    { valor: 'Musical', etiqueta: 'Musical' },
    { valor: 'Crimen', etiqueta: 'Crimen' }
  ];

  // ✅ Usar tags compartidos en lugar de definir aquí
  const tagsDisponibles = TAGS_DISPONIBLES;

  const manejarCambioFiltro = (campo, valor) => {
    const nuevosFiltros = {
      ...filtrosLocales,
      [campo]: valor
    };
    setFiltrosLocales(nuevosFiltros);
    // Aplicar filtros automáticamente
    onAplicarFiltros(nuevosFiltros);
  };

  const manejarCambioTag = (tag) => {
    const nuevosFiltros = {
      ...filtrosLocales,
      tags: filtrosLocales.tags.includes(tag)
        ? filtrosLocales.tags.filter(t => t !== tag)
        : [...filtrosLocales.tags, tag]
    };
    setFiltrosLocales(nuevosFiltros);
    // Aplicar filtros automáticamente
    onAplicarFiltros(nuevosFiltros);
  };

  const hayFiltrosActivos = () => {
    return filtrosLocales.calificacion !== '' ||
           filtrosLocales.fechaPublicacion !== '' ||
           filtrosLocales.genero !== '' ||
           filtrosLocales.tags.length > 0 ||
           filtrosLocales.usuario !== '' ||
           filtrosLocales.pelicula !== '' ||
           filtrosLocales.contieneEspoilers ||
           filtrosLocales.soloMeGusta;
  };

  return (
    <div className="contenedor-filtros">
      <div className="encabezado-filtros">
        <h3 className="titulo-filtros">
          🔍 Filtrar Reseñas
        </h3>
        <button
          className="boton-toggle-avanzados"
          onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
        >
          {mostrarFiltrosAvanzados ? 'Ocultar filtros' : 'Más filtros'}
        </button>
      </div>

      <div className="filtros-basicos">
        {/* Búsqueda por película */}
        <div className="grupo-filtro">
          <label className="etiqueta-filtro">Película</label>
          <input
            type="text"
            value={filtrosLocales.pelicula}
            onChange={(e) => manejarCambioFiltro('pelicula', e.target.value)}
            placeholder="Buscar por título..."
            className="entrada-filtro"
          />
        </div>

        {/* Búsqueda por usuario */}
        <div className="grupo-filtro">
          <label className="etiqueta-filtro">Usuario</label>
          <input
            type="text"
            value={filtrosLocales.usuario}
            onChange={(e) => manejarCambioFiltro('usuario', e.target.value)}
            placeholder="Buscar por usuario..."
            className="entrada-filtro"
          />
        </div>

        {/* Calificación */}
        <div className="grupo-filtro">
          <label className="etiqueta-filtro">Calificación</label>
          <select
            value={filtrosLocales.calificacion}
            onChange={(e) => manejarCambioFiltro('calificacion', e.target.value)}
            className="select-filtro"
          >
            {opcionesCalificacion.map(opcion => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha de publicación */}
        <div className="grupo-filtro">
          <label className="etiqueta-filtro">Fecha de publicación</label>
          <select
            value={filtrosLocales.fechaPublicacion}
            onChange={(e) => manejarCambioFiltro('fechaPublicacion', e.target.value)}
            className="select-filtro"
          >
            {opcionesFecha.map(opcion => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltrosAvanzados && (
        <div className="filtros-avanzados">
          {/* Género */}
          <div className="grupo-filtro">
            <label className="etiqueta-filtro">Género</label>
            <select
              value={filtrosLocales.genero}
              onChange={(e) => manejarCambioFiltro('genero', e.target.value)}
              className="select-filtro"
            >
              {opcionesGenero.map(opcion => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="grupo-filtro-tags">
            <label className="etiqueta-filtro">Tags</label>
            <div className="contenedor-tags-filtro">
              {tagsDisponibles.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-filtro ${filtrosLocales.tags.includes(tag) ? 'activo' : ''}`}
                  onClick={() => manejarCambioTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {hayFiltrosActivos() && (
        <div className="resumen-filtros">
          <span className="texto-resumen">Filtros activos:</span>
          <div className="filtros-activos-lista">
            {filtrosLocales.calificacion && (
              <span className="filtro-activo">
                {opcionesCalificacion.find(o => o.valor === filtrosLocales.calificacion)?.etiqueta}
              </span>
            )}
            {filtrosLocales.fechaPublicacion && (
              <span className="filtro-activo">
                {opcionesFecha.find(o => o.valor === filtrosLocales.fechaPublicacion)?.etiqueta}
              </span>
            )}
            {filtrosLocales.genero && (
              <span className="filtro-activo">
                {opcionesGenero.find(o => o.valor === filtrosLocales.genero)?.etiqueta}
              </span>
            )}
            {filtrosLocales.pelicula && (
              <span className="filtro-activo">Película: "{filtrosLocales.pelicula}"</span>
            )}
            {filtrosLocales.usuario && (
              <span className="filtro-activo">Usuario: "{filtrosLocales.usuario}"</span>
            )}
            {filtrosLocales.tags.map(tag => (
              <span key={tag} className="filtro-activo">{tag}</span>
            ))}
            {filtrosLocales.soloMeGusta && (
              <span className="filtro-activo">Solo me gusta</span>
            )}
            {filtrosLocales.contieneEspoilers && (
              <span className="filtro-activo">Con spoilers</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltrosResenas;
