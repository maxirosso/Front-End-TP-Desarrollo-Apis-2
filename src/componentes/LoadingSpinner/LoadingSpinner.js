import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ mensaje = 'Cargando...', tamaño = 'medium' }) => {
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${tamaño}`}>
        <div className="spinner-ring">
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
