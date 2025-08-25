import React, { useState } from 'react';
import './BarraOrdenamiento.css';

const BarraOrdenamiento = ({ onCambiarOrdenamiento, ordenamientoActual, totalResenas }) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const opcionesOrdenamiento = [
    {
      valor: 'fecha-desc',
      etiqueta: 'Más recientes primero',
      icono: '🕐',
      descripcion: 'Ordenar por fecha de publicación (nuevas → antiguas)'
    },
    {
      valor: 'fecha-asc',
      etiqueta: 'Más antiguas primero',
      icono: '⏰',
      descripcion: 'Ordenar por fecha de publicación (antiguas → nuevas)'
    },
    {
      valor: 'calificacion-desc',
      etiqueta: 'Mejor calificación primero',
      icono: '⭐',
      descripcion: 'Ordenar por calificación (5★ → 1★)'
    },
    {
      valor: 'calificacion-asc',
      etiqueta: 'Peor calificación primero',
      icono: '☆',
      descripcion: 'Ordenar por calificación (1★ → 5★)'
    },
    {
      valor: 'likes-desc',
      etiqueta: 'Más likes primero',
      icono: '👍',
      descripcion: 'Ordenar por cantidad de likes (más → menos)'
    },
    {
      valor: 'likes-asc',
      etiqueta: 'Menos likes primero',
      icono: '👎',
      descripcion: 'Ordenar por cantidad de likes (menos → más)'
    },
    {
      valor: 'titulo-asc',
      etiqueta: 'Título A-Z',
      icono: '🔤',
      descripcion: 'Ordenar alfabéticamente por título'
    },
    {
      valor: 'titulo-desc',
      etiqueta: 'Título Z-A',
      icono: '🔤',
      descripcion: 'Ordenar alfabéticamente por título (inverso)'
    },
    {
      valor: 'usuario-asc',
      etiqueta: 'Usuario A-Z',
      icono: '👤',
      descripcion: 'Ordenar alfabéticamente por nombre de usuario'
    }
  ];

  const obtenerEtiquetaOrdenamiento = () => {
    const opcion = opcionesOrdenamiento.find(op => op.valor === ordenamientoActual);
    return opcion ? opcion.etiqueta : 'Ordenar por';
  };

  const obtenerIconoOrdenamiento = () => {
    const opcion = opcionesOrdenamiento.find(op => op.valor === ordenamientoActual);
    return opcion ? opcion.icono : '📋';
  };

  const manejarSeleccionOrdenamiento = (valor) => {
    onCambiarOrdenamiento(valor);
    setMostrarOpciones(false);
  };

  const alternarMostrarOpciones = () => {
    setMostrarOpciones(!mostrarOpciones);
  };

  return (
    <div className="barra-ordenamiento">
      <div className="info-resultados">
        <span className="contador-resultados">
          {totalResenas === 0 ? 'No hay reseñas' : 
           totalResenas === 1 ? '1 reseña encontrada' : 
           `${totalResenas} reseñas encontradas`}
        </span>
      </div>

      <div className="controles-ordenamiento">
        <span className="etiqueta-ordenar">Ordenar por:</span>
        
        <div className="selector-ordenamiento">
          <button
            className="boton-ordenamiento"
            onClick={alternarMostrarOpciones}
          >
            <span className="icono-ordenamiento">{obtenerIconoOrdenamiento()}</span>
            <span className="texto-ordenamiento">{obtenerEtiquetaOrdenamiento()}</span>
            <span className={`flecha-dropdown ${mostrarOpciones ? 'rotada' : ''}`}>
              ▼
            </span>
          </button>

          {mostrarOpciones && (
            <div className="menu-ordenamiento">
              {opcionesOrdenamiento.map(opcion => (
                <button
                  key={opcion.valor}
                  className={`opcion-ordenamiento ${
                    ordenamientoActual === opcion.valor ? 'activa' : ''
                  }`}
                  onClick={() => manejarSeleccionOrdenamiento(opcion.valor)}
                  title={opcion.descripcion}
                >
                  <span className="icono-opcion">{opcion.icono}</span>
                  <div className="texto-opcion">
                    <span className="etiqueta-opcion">{opcion.etiqueta}</span>
                    <span className="descripcion-opcion">{opcion.descripcion}</span>
                  </div>
                  {ordenamientoActual === opcion.valor && (
                    <span className="marca-seleccionada">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vista móvil simplificada */}
      <div className="ordenamiento-movil">
        <select
          value={ordenamientoActual}
          onChange={(e) => onCambiarOrdenamiento(e.target.value)}
          className="select-ordenamiento-movil"
        >
          {opcionesOrdenamiento.map(opcion => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.icono} {opcion.etiqueta}
            </option>
          ))}
        </select>
      </div>

      {/* Overlay para cerrar el menú */}
      {mostrarOpciones && (
        <div 
          className="overlay-menu"
          onClick={() => setMostrarOpciones(false)}
        />
      )}
    </div>
  );
};

export default BarraOrdenamiento;
