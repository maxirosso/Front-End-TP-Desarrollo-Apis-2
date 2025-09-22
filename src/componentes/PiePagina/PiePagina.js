import React from 'react';
import './PiePagina.css';

const PiePagina = () => {
  // const añoActual = new Date().getFullYear();

  return (
    <footer className="pie-pagina">
      <div className="contenedor-pie">
        {/* Enlaces de navegación */}
        <div className="seccion-enlaces">
          <a href="#" className="enlace-pie">Sobre nosotros</a>
          <a href="#" className="enlace-pie">Términos y condiciones</a>
          <a href="#" className="enlace-pie">Ayuda</a>
        </div>

        {/* Información de copyright */}
        <div className="seccion-copyright">
          <p>© cineTrack - Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default PiePagina;
