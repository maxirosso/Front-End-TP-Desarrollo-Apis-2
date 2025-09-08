import React from 'react';
import { Outlet } from 'react-router-dom';
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
      <div className="aplicacion-principal">
        <BarraNavegacion />
        <main className="contenido-principal">
          <Outlet />
        </main>
        <PiePagina />
      </div>
    </ProveedorResenas>
  );
}

export default App;