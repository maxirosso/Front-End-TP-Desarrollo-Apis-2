
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as CrearResenaPage from './pages/CrearResena';
import * as InicioPage from './pages/Inicio';
import PeliculaDetalle from './pages/PeliculaDetalle';
import ErrorBoundary from './componentes/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App actúa como layout
    errorElement: <ErrorBoundary />, // Pantalla de error global
    children: [
      { index: true, element: <InicioPage.default />, loader: InicioPage.loader },
      { path: 'crear', element: <CrearResenaPage.default />, action: CrearResenaPage.action },
      { path: 'editar/:id', element: <CrearResenaPage.default />, loader: CrearResenaPage.loader },
      { path: 'pelicula/:titulo', element: <PeliculaDetalle /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
