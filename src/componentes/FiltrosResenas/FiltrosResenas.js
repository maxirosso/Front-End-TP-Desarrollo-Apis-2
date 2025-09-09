import React, { useState } from 'react';
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
    { valor: '1', etiqueta: '1+ estrellas' }
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
    { valor: 'accion', etiqueta: 'Acción' },
    { valor: 'drama', etiqueta: 'Drama' },
    { valor: 'comedia', etiqueta: 'Comedia' },
    { valor: 'terror', etiqueta: 'Terror' },
    { valor: 'romance', etiqueta: 'Romance' },
    { valor: 'ciencia-ficcion', etiqueta: 'Ciencia Ficción' },
    { valor: 'thriller', etiqueta: 'Thriller' },
    { valor: 'animacion', etiqueta: 'Animación' },
    { valor: 'documental', etiqueta: 'Documental' }
  ];

  const tagsDisponibles = [
    'Spoiler Free', 'Obra Maestra', 'Decepcionante', 'Sobrevalorada', 
    'Infravalorada', 'Acción', 'Drama', 'Comedia', 'Terror', 'Romance'
  ];

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

  const aplicarFiltros = () => {
    onAplicarFiltros(filtrosLocales);
  };

  const limpiarTodosFiltros = () => {
    const filtrosVacios = {
      calificacion: '',
      fechaPublicacion: '',
      genero: '',
      tags: [],
      usuario: '',
      pelicula: '',
      contieneEspoilers: false,
      soloMeGusta: false
    };
    setFiltrosLocales(filtrosVacios);
    onLimpiarFiltros();
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

          {/* Opciones especiales */}
          <div className="grupo-opciones-especiales">
            <div className="opcion-checkbox">
              <label className="etiqueta-checkbox-filtro">
                <input
                  type="checkbox"
                  checked={filtrosLocales.soloMeGusta}
                  onChange={(e) => manejarCambioFiltro('soloMeGusta', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                Solo películas que me gustaron ❤️
              </label>
            </div>

            <div className="opcion-checkbox">
              <label className="etiqueta-checkbox-filtro">
                <input
                  type="checkbox"
                  checked={filtrosLocales.contieneEspoilers}
                  onChange={(e) => manejarCambioFiltro('contieneEspoilers', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                Incluir reseñas con spoilers ⚠️
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="botones-filtros">
        {hayFiltrosActivos() && (
          <button className="boton-limpiar" onClick={limpiarTodosFiltros}>
            Limpiar filtros
          </button>
        )}
        <button className="boton-aplicar" onClick={aplicarFiltros}>
          Aplicar filtros
          {hayFiltrosActivos() && <span className="indicador-filtros-activos">●</span>}
        </button>
      </div>

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
