import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorResenas } from './contextos/ContextoResenas';
import BarraNavegacion from './componentes/BarraNavegacion/BarraNavegacion';
import PiePagina from './componentes/PiePagina/PiePagina';
import Inicio from './pages/Inicio';
import CrearResena from './pages/CrearResena';
import PeliculaDetalle from './pages/PeliculaDetalle';
import PerfilUsuario from './pages/PerfilUsuario';
import ResenasDelicula from './pages/ResenasDelicula';
import Peliculas from './pages/Peliculas';
import Recomendaciones from './pages/Recomendaciones';
import Usuario from './pages/Usuario';
import EditarPerfil from './pages/EditarPerfil';
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
              <Route path="/crear-resena/:id" element={<CrearResena />} />
              <Route path="/pelicula/:titulo" element={<PeliculaDetalle />} />
              <Route path="/usuario" element={<Usuario />} />
              <Route path="/usuario/:userId" element={<PerfilUsuario />} />
              <Route path="/editar-perfil" element={<EditarPerfil />} />
              <Route path="/editar-perfil/:userId" element={<EditarPerfil />} />
              <Route path="/peliculas" element={<Peliculas />} />
              <Route path="/recomendaciones" element={<Recomendaciones />} />
              <Route path="/movie/:movieId/reviews" element={<ResenasDelicula />} />
              {/* HU-005: Rutas para reseñas por película */}
              <Route path="/pelicula/:movieId/resenas" element={<ResenasDelicula />} />
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