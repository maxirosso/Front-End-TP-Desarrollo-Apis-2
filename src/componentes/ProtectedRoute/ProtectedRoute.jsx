import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contextos/ContextoAuth';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './ProtectedRoute.css';

/**
 * Componente que protege rutas que requieren autenticación
 */
const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { estaAutenticado, tieneRol, tienePermiso, cargando, usuario } = useAuth();
  const location = useLocation();

  // Mostrar spinner mientras se verifica la autenticación
  if (cargando) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!estaAutenticado()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si se requiere un rol específico
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!roles.some(rol => tieneRol(rol))) {
      return (
        <div className="acceso-denegado">
          <div className="acceso-denegado-contenido">
            <h1>🚫 Acceso Denegado</h1>
            <p>No tienes permisos para acceder a esta página.</p>
            <p className="rol-requerido">
              Rol requerido: <strong>{roles.join(' o ')}</strong>
            </p>
            <p className="tu-rol">
              Tu rol actual: <strong>{usuario?.role || 'N/A'}</strong>
            </p>
            <button onClick={() => window.history.back()} className="btn-volver">
              Volver atrás
            </button>
          </div>
        </div>
      );
    }
  }

  // Verificar si se requiere un permiso específico
  if (requiredPermission) {
    const permisos = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    
    if (!permisos.some(permiso => tienePermiso(permiso))) {
      return (
        <div className="acceso-denegado">
          <div className="acceso-denegado-contenido">
            <h1>🚫 Acceso Denegado</h1>
            <p>No tienes los permisos necesarios para acceder a esta página.</p>
            <p className="permiso-requerido">
              Permiso requerido: <strong>{permisos.join(' o ')}</strong>
            </p>
            <button onClick={() => window.history.back()} className="btn-volver">
              Volver atrás
            </button>
          </div>
        </div>
      );
    }
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return children;
};

export default ProtectedRoute;
