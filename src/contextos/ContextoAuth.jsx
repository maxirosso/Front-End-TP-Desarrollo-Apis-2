// context/ContextoAuth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";
import {
  saveToken,
  getToken,
  saveUser,
  getUser,
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
} from "../utils/auth";

const ContextoAuth = createContext();

export const useAuth = () => {
  const ctx = useContext(ContextoAuth);
  if (!ctx) throw new Error("useAuth debe ser usado dentro de un ProveedorAuth");
  return ctx;
};

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Inicializar auth leyendo token guardado y decodificando (el back valida en cada request)
  useEffect(() => {
    try {
      const tokenGuardado = getToken();
      const usuarioGuardado = getUser();

      if (!tokenGuardado || isTokenExpired(tokenGuardado)) {
        clearAuth();
        setCargando(false);
        return;
      }

      // Si hay usuario cacheado, úsalo; si no, decodificá el JWT
      const decoded = usuarioGuardado || decodeJWT(tokenGuardado) || null;
      if (decoded) saveUser(decoded);

      setUsuario(decoded);
      setToken(tokenGuardado);
    } catch (e) {
      console.error("Error al inicializar autenticación:", e);
      clearAuth();
    } finally {
      setCargando(false);
    }
  }, []);

  // Login: llama al módulo de usuarios, guarda token y decodifica payload para la UI
  const login = async (credentials) => {
    setError(null);
    setCargando(true);
    try {
      const res = await authAPI.login(credentials);
      const nuevoToken = res.access_token || res.token;
      if (!nuevoToken) throw new Error("No se recibió token del servidor");

      saveToken(nuevoToken);
      setToken(nuevoToken);

      const decoded = decodeJWT(nuevoToken) || {};
      saveUser(decoded);
      setUsuario(decoded);

      return decoded;
    } catch (err) {
      console.error("Error en login:", err);
      const msg = err.message || "Error al iniciar sesión";
      setError(msg);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  // Logout local: el back valida JWT en cada request, no hace falta endpoint si no existe
  const logout = () => {
    clearAuth();
    setUsuario(null);
    setToken(null);
    setError(null);
  };

  // Helpers de estado/permiso
  const estaAutenticado = () => !!usuario && !!token && !isTokenExpired(token);
  const tieneRol = (rol) => hasRole(usuario, rol);
  const tienePermiso = (perm) => hasPermission(usuario, perm);
  const puedeEditarRecurso = (resourceUserId) => canEditResource(usuario, resourceUserId);
  const puedeEliminarRecurso = (resourceUserId) => canDeleteResource(usuario, resourceUserId);

  const valor = {
    // estado
    usuario,
    token,
    cargando,
    error,

    // auth
    login,
    logout,

    // verificación
    estaAutenticado,
    tieneRol,
    tienePermiso,
    puedeEditarRecurso,
    puedeEliminarRecurso,

    // utilidades
    isAdmin: () => isAdmin(usuario),
    isModerator: () => isModerator(usuario),
    isAdminOrModerator: () => isAdminOrModerator(usuario),
    getFullName: () => getFullName(usuario),
    getUserInitials: () => getUserInitials(usuario),
    formatRole: () => formatRole(usuario?.role),

    // constantes
    ROLES,
    // manejo de error
    setError,
  };

  return <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>;
};

export default ContextoAuth;
