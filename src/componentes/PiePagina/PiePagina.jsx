import React from 'react';
import './PiePagina.css';

const PiePagina = () => {
  // const añoActual = new Date().getFullYear();

  return (
    <footer className="pie-pagina">
      <div className="contenedor-pie">
        {/* Enlaces de navegación */}
        <div className="seccion-enlaces">
          <button className="enlace-pie" type="button">Sobre nosotros</button>
          <button className="enlace-pie" type="button">Términos y condiciones</button>
          <button className="enlace-pie" type="button">Ayuda</button>
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
