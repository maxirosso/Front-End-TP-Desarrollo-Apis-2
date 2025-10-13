import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorAuth } from './contextos/ContextoAuth';
import { ProveedorResenas } from './contextos/ContextoResenas';
import ProtectedRoute from './componentes/ProtectedRoute/ProtectedRoute';
import BarraNavegacion from './componentes/BarraNavegacion/BarraNavegacion';
import PiePagina from './componentes/PiePagina/PiePagina';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
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
    <ProveedorAuth>
      <ProveedorResenas>
        <Router>
          <div className="aplicacion-principal">
            <BarraNavegacion />
            <main className="contenido-principal">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                
                {/* Rutas que requieren autenticación */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Inicio />
                  </ProtectedRoute>
                } />
                
                <Route path="/crear" element={
                  <ProtectedRoute>
                    <CrearResena />
                  </ProtectedRoute>
                } />
                
                <Route path="/editar/:id" element={
                  <ProtectedRoute>
                    <CrearResena />
                  </ProtectedRoute>
                } />
                
                <Route path="/crear-resena/:id" element={
                  <ProtectedRoute>
                    <CrearResena />
                  </ProtectedRoute>
                } />
                
                <Route path="/pelicula/:titulo" element={
                  <ProtectedRoute>
                    <PeliculaDetalle />
                  </ProtectedRoute>
                } />
                
                <Route path="/usuario" element={
                  <ProtectedRoute>
                    <Usuario />
                  </ProtectedRoute>
                } />
                
                <Route path="/usuario/:userId" element={
                  <ProtectedRoute>
                    <PerfilUsuario />
                  </ProtectedRoute>
                } />
                
                <Route path="/editar-perfil" element={
                  <ProtectedRoute>
                    <EditarPerfil />
                  </ProtectedRoute>
                } />
                
                <Route path="/editar-perfil/:userId" element={
                  <ProtectedRoute>
                    <EditarPerfil />
                  </ProtectedRoute>
                } />
                
                <Route path="/peliculas" element={
                  <ProtectedRoute>
                    <Peliculas />
                  </ProtectedRoute>
                } />
                
                <Route path="/recomendaciones" element={
                  <ProtectedRoute>
                    <Recomendaciones />
                  </ProtectedRoute>
                } />
                
                <Route path="/movie/:movieId/reviews" element={
                  <ProtectedRoute>
                    <ResenasDelicula />
                  </ProtectedRoute>
                } />
                
                {/* HU-005: Rutas para reseñas por película */}
                <Route path="/pelicula/:movieId/resenas" element={
                  <ProtectedRoute>
                    <ResenasDelicula />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <PiePagina />
          </div>
        </Router>
      </ProveedorResenas>
    </ProveedorAuth>
  );
}

export default App;