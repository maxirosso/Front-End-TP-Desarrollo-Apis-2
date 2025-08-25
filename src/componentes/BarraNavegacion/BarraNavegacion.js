import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BarraNavegacion.css';

const BarraNavegacion = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const navigate = useNavigate();

  const manejarBusqueda = (evento) => {
    setTerminoBusqueda(evento.target.value);
  };

  const enviarBusqueda = (evento) => {
    evento.preventDefault();
    if (terminoBusqueda.trim()) {
      // Navegar a la página de resultados con el término de búsqueda
      navigate(`/?busqueda=${encodeURIComponent(terminoBusqueda.trim())}`);
    }
  };

  return (
    <nav className="barra-navegacion">
      <div className="contenedor-navegacion">
        {/* Logo y nombre */}
        <Link to="/" className="logo-contenedor">
          <div className="logo-triangulos">
            <div className="triangulo triangulo-rojo"></div>
            <div className="triangulo triangulo-cyan"></div>
          </div>
          <h1 className="nombre-aplicacion">cineTrack</h1>
        </Link>

        {/* Menú de navegación */}
        <ul className="menu-navegacion">
          <li><Link to="/usuario" className="enlace-navegacion">USUARIO</Link></li>
          <li><Link to="/peliculas" className="enlace-navegacion">FILMS</Link></li>
          <li><Link to="/recomendaciones" className="enlace-navegacion">¿QUÉ VEO HOY?</Link></li>
        </ul>

        {/* Buscador */}
        <form className="formulario-busqueda" onSubmit={enviarBusqueda}>
          <input
            type="text"
            placeholder="Buscar películas..."
            value={terminoBusqueda}
            onChange={manejarBusqueda}
            className="entrada-busqueda"
          />
          <button type="submit" className="boton-busqueda">🔍</button>
        </form>

        {/* Botón de crear reseña */}
        <Link to="/crear" className="boton-crear-resena-nav">
          ✏️ NUEVA RESEÑA
        </Link>
      </div>
    </nav>
  );
};

export default BarraNavegacion;
