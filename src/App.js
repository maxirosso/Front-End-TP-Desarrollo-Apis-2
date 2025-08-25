import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorResenas } from './contextos/ContextoResenas';
import BarraNavegacion from './componentes/BarraNavegacion/BarraNavegacion';
import PiePagina from './componentes/PiePagina/PiePagina';
import Inicio from './pages/Inicio';
import CrearResena from './pages/CrearResena';
import PeliculaDetalle from './pages/PeliculaDetalle';
import './App.css';

function App() {
  return (
    <ProveedorResenas>
      <Router>
        <div className="aplicacion-principal">
          <BarraNavegacion />
          <main className="contenido-principal">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/crear" element={<CrearResena />} />
              <Route path="/editar/:id" element={<CrearResena />} />
              <Route path="/pelicula/:titulo" element={<PeliculaDetalle />} />
              {/* Rutas adicionales se pueden agregar aquí */}
            </Routes>
          </main>
          <PiePagina />
        </div>
      </Router>
    </ProveedorResenas>
  );
}

export default App;