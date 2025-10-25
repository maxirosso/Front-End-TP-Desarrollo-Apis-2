import { useAuth } from './useAuth';
import { ROLES } from '../utils/auth';

/**
 * Hook personalizado para verificar permisos del usuario
 */
export const usePermissions = () => {
  const { usuario, tieneRol, tienePermiso, puedeEditarRecurso, puedeEliminarRecurso } = useAuth();

  return {
    // Usuario actual
    usuario,

    // Verificación de roles
    esAdmin: tieneRol(ROLES.ADMIN),
    esModerador: tieneRol(ROLES.MODERATOR),
    esUsuario: tieneRol(ROLES.USER),
    esAdminOModerador: tieneRol([ROLES.ADMIN, ROLES.MODERATOR]),

    // Verificación de permisos sobre recursos específicos
    puedeEditarRecurso,
    puedeEliminarRecurso,

    // Función genérica para verificar cualquier permiso
    tienePermiso,
    tieneRol,

    // Constantes
    ROLES
  };
};

/**
 * Hook para obtener las capacidades de administración
 */
export const useAdminCapabilities = () => {
  const permisos = usePermissions();
  
  return {
    // Gestión de películas
    gestionPeliculas: {
      crear: permisos.puedeCrearPelicula,
      editar: permisos.puedeEditarPelicula,
      eliminar: permisos.puedeEliminarPelicula,
      tieneAlguno: permisos.puedeCrearPelicula || permisos.puedeEditarPelicula || permisos.puedeEliminarPelicula
    },

    // Gestión de comentarios
    gestionComentarios: {
      editar: permisos.puedeEditarComentario,
      eliminar: permisos.puedeEliminarComentario,
      tieneAlguno: permisos.puedeEditarComentario || permisos.puedeEliminarComentario
    },

    // Gestión de usuarios
    gestionUsuarios: {
      crear: permisos.puedeCrearUsuario,
      editar: permisos.puedeEditarUsuario,
      eliminar: permisos.puedeEliminarUsuario,
      ver: permisos.puedeVerUsuario,
      asignarPermiso: permisos.puedeAsignarPermiso,
      asignarRol: permisos.puedeAsignarRol,
      tieneAlguno: permisos.puedeCrearUsuario || permisos.puedeEditarUsuario || 
                   permisos.puedeEliminarUsuario || permisos.puedeVerUsuario ||
                   permisos.puedeAsignarPermiso || permisos.puedeAsignarRol
    },

    // Es administrador o moderador
    esAdministrador: permisos.esAdminOModerador
  };
};

export default usePermissions;
