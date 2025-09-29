// src/componentes/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ mensaje = 'Cargando...', tamaño = 'medium' }) => {
  return (
    <div className="loading-container">
      <div
        className={`loading-spinner ${tamaño}`}
        role="status"               // 👈 agregado para accesibilidad
        aria-label="loading-spinner" // 👈 opcional para claridad
      >
        <div className="spinner-ring" data-testid="spinner-ring"> {/* 👈 agregado data-testid */}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <p className="loading-mensaje">{mensaje}</p>
    </div>
  );
};

export default LoadingSpinner;
