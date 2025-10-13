import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import {
  saveToken,
  getToken,
  // removeToken,
  saveUser,
  getUser,
  // removeUser,
  clearAuth,
  isTokenExpired,
  decodeJWT,
  hasRole,
  hasPermission,
  isAdmin,
  isModerator,
  isAdminOrModerator,
  canEditResource,
  canDeleteResource,
  getFullName,
  getUserInitials,
  formatRole,
  ROLES,
  PERMISSIONS
} from '../utils/auth';

// Crear el contexto
const ContextoAuth = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const contexto = useContext(ContextoAuth);
  if (!contexto) {
    throw new Error('useAuth debe ser usado dentro de un ProveedorAuth');
  }
  return contexto;
};

// Proveedor del contexto
export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  /**
   * Inicializar autenticación al cargar la app
   */
  useEffect(() => {
    const inicializarAuth = async () => {
      try {
        const tokenGuardado = getToken();
        const usuarioGuardado = getUser();

        if (!tokenGuardado || !usuarioGuardado) {
          setCargando(false);
          return;
        }

        // Verificar si el token ha expirado
        if (isTokenExpired(tokenGuardado)) {
          console.log('⚠️ Token expirado, limpiando sesión');
          clearAuth();
          setCargando(false);
          return;
        }

        // Validar el token con el backend
        try {
          const perfilActualizado = await authAPI.getMe();
          
          // Actualizar el estado y localStorage con los datos más recientes
          setUsuario(perfilActualizado);
          setToken(tokenGuardado);
          saveUser(perfilActualizado);
          
          console.log('✅ Sesión restaurada correctamente:', perfilActualizado);
        } catch (validationError) {
          // Si el token no es válido, limpiar la sesión
          if (validationError.status === 401) {
            console.log('⚠️ Token inválido, limpiando sesión');
            clearAuth();
            setUsuario(null);
            setToken(null);
          } else {
            // Si hay otro error (ej: servidor caído), usar datos en caché
            console.warn('⚠️ No se pudo validar el token, usando datos en caché');
            setUsuario(usuarioGuardado);
            setToken(tokenGuardado);
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        clearAuth();
      } finally {
        setCargando(false);
      }
    };

    inicializarAuth();
  }, []);

  /**
   * Login - Autenticar usuario
   */
  const login = async (credentials) => {
    try {
      setError(null);
      setCargando(true);

      // Realizar login
      const response = await authAPI.login(credentials);
      
      // Verificar token (OAuth2 usa 'access_token', pero puede venir como 'token' también)
      const nuevoToken = response.access_token || response.token;
      
      if (!nuevoToken) {
        throw new Error('No se recibió token del servidor');
      }

      // Guardar token
      saveToken(nuevoToken);
      setToken(nuevoToken);

      // Decodificar JWT para obtener info del usuario
      const decoded = decodeJWT(nuevoToken);
      
      // Obtener perfil completo del usuario desde /me
      let perfilUsuario;
      try {
        perfilUsuario = await authAPI.getMe();
      } catch (meError) {
        // Si /me falla, usar datos decodificados del JWT
        console.warn('No se pudo obtener /me, usando datos del JWT');
        perfilUsuario = decoded;
      }

      // Guardar usuario
      saveUser(perfilUsuario);
      setUsuario(perfilUsuario);

      console.log('✅ Login exitoso:', perfilUsuario);
      return perfilUsuario;
    } catch (error) {
      console.error('Error en login:', error);
      const mensajeError = error.message || 'Error al iniciar sesión';
      setError(mensajeError);
      throw error;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Logout - Cerrar sesión
   */
  const logout = async () => {
    try {
      // Intentar hacer logout en el backend
      try {
        await authAPI.logout();
      } catch (error) {
        console.warn('Error al hacer logout en backend:', error);
        // Continuar con logout local aunque falle el backend
      }

      // Limpiar estado y localStorage
      clearAuth();
      setUsuario(null);
      setToken(null);
      setError(null);

      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
      // Asegurar que se limpie localmente aunque falle
      clearAuth();
      setUsuario(null);
      setToken(null);
    }
  };

  /**
   * Refresh - Renovar token
   */
  const refreshToken = async (refreshToken) => {
    try {
      const response = await authAPI.refresh(refreshToken);
      
      if (!response.token) {
        throw new Error('No se recibió token del servidor');
      }

      const nuevoToken = response.token;
      saveToken(nuevoToken);
      setToken(nuevoToken);

      // Actualizar perfil
      const perfilActualizado = await authAPI.getMe();
      saveUser(perfilActualizado);
      setUsuario(perfilActualizado);

      return nuevoToken;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw error;
    }
  };

  /**
   * Actualizar perfil del usuario
   */
  const actualizarPerfil = async () => {
    try {
      const perfilActualizado = await authAPI.getMe();
      saveUser(perfilActualizado);
      setUsuario(perfilActualizado);
      return perfilActualizado;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const estaAutenticado = () => {
    return !!usuario && !!token && !isTokenExpired(token);
  };

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const tieneRol = (rol) => {
    return hasRole(usuario, rol);
  };

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  const tienePermiso = (permiso) => {
    return hasPermission(usuario, permiso);
  };

  /**
   * Verificar si el usuario puede editar un recurso
   */
  const puedeEditarRecurso = (resourceUserId) => {
    return canEditResource(usuario, resourceUserId);
  };

  /**
   * Verificar si el usuario puede eliminar un recurso
   */
  const puedeEliminarRecurso = (resourceUserId) => {
    return canDeleteResource(usuario, resourceUserId);
  };

  // Valor del contexto
  const valor = {
    // Estado
    usuario,
    token,
    cargando,
    error,
    
    // Funciones de autenticación
    login,
    logout,
    refreshToken,
    actualizarPerfil,
    
    // Funciones de verificación
    estaAutenticado,
    tieneRol,
    tienePermiso,
    puedeEditarRecurso,
    puedeEliminarRecurso,
    
    // Funciones de utilidad
    isAdmin: () => isAdmin(usuario),
    isModerator: () => isModerator(usuario),
    isAdminOrModerator: () => isAdminOrModerator(usuario),
    getFullName: () => getFullName(usuario),
    getUserInitials: () => getUserInitials(usuario),
    formatRole: () => formatRole(usuario?.role),
    
    // Constantes
    ROLES,
    PERMISSIONS,
    
    // Setter de error
    setError
  };

  return (
    <ContextoAuth.Provider value={valor}>
      {children}
    </ContextoAuth.Provider>
  );
};

export default ContextoAuth;
