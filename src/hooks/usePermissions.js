import { useAuth } from './useAuth';
import { ROLES, PERMISSIONS } from '../utils/auth';

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

    // Verificación de permisos de películas
    puedeCrearPelicula: tienePermiso(PERMISSIONS.CREATE_MOVIE),
    puedeEditarPelicula: tienePermiso(PERMISSIONS.EDIT_MOVIE),
    puedeEliminarPelicula: tienePermiso(PERMISSIONS.DELETE_MOVIE),

    // Verificación de permisos de comentarios
    puedeEditarComentario: tienePermiso(PERMISSIONS.EDIT_COMMENT),
    puedeEliminarComentario: tienePermiso(PERMISSIONS.DELETE_COMMENT),

    // Verificación de permisos de usuarios
    puedeCrearUsuario: tienePermiso(PERMISSIONS.CREATE_USER),
    puedeEditarUsuario: tienePermiso(PERMISSIONS.EDIT_USER),
    puedeEliminarUsuario: tienePermiso(PERMISSIONS.DELETE_USER),
    puedeVerUsuario: tienePermiso(PERMISSIONS.VIEW_USER),
    puedeAsignarPermiso: tienePermiso(PERMISSIONS.ASSIGN_PERMISSION),
    puedeAsignarRol: tienePermiso(PERMISSIONS.ASSIGN_ROLE),

    // Verificación de permisos sobre recursos específicos
    puedeEditarRecurso,
    puedeEliminarRecurso,

    // Función genérica para verificar cualquier permiso
    tienePermiso,
    tieneRol,

    // Constantes
    ROLES,
    PERMISSIONS
  };
};

/**
 * Hook para verificar si el usuario puede editar un recurso específico
 */
export const useCanEdit = (resourceUserId) => {
  const { puedeEditarRecurso } = usePermissions();
  return puedeEditarRecurso(resourceUserId);
};

/**
 * Hook para verificar si el usuario puede eliminar un recurso específico
 */
export const useCanDelete = (resourceUserId) => {
  const { puedeEliminarRecurso } = usePermissions();
  return puedeEliminarRecurso(resourceUserId);
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
