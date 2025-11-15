// context/ContextoAuth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";
import {
  // 👇 nuevo helper que guarda access + refresh
  saveAuthTokens,
  getToken,
  saveUser,
  getUser,
  clearAuth,
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
  if (!ctx)
    throw new Error("useAuth debe ser usado dentro de un ProveedorAuth");
  return ctx;
};

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Inicializar auth leyendo token guardado (NO chequeamos exp)
  useEffect(() => {
    try {
      const tokenGuardado = getToken();
      const usuarioGuardado = getUser();

      if (!tokenGuardado) {
        // no hay sesión previa
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

  // ✅ Login: guarda access + refresh y decodifica el payload para la UI
  const login = async (credentials) => {
    setError(null);
    setCargando(true);
    try {
      const { token: accessToken, refreshToken, raw } =
        await authAPI.login(credentials);

      if (!accessToken) throw new Error("No se recibió token del servidor");

      // Guarda access + refresh en localStorage
      saveAuthTokens(accessToken, refreshToken);
      setToken(accessToken);

      // Datos del usuario (del JWT o del body)
      const decoded = decodeJWT(accessToken) || raw?.user || {};
      saveUser(decoded);
      setUsuario(decoded);

      return decoded;
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setCargando(false);
    }
  };

  // Logout local
  const logout = () => {
    clearAuth();          // borra access, refresh y user
    setUsuario(null);
    setToken(null);
    setError(null);
  };

  // ✅ Ahora NO miramos exp, solo que haya usuario + token
  const estaAutenticado = () => !!usuario && !!token;

  const tieneRol = (rol) => hasRole(usuario, rol);
  const tienePermiso = (perm) => hasPermission(usuario, perm);
  const puedeEditarRecurso = (resourceUserId) =>
    canEditResource(usuario, resourceUserId);
  const puedeEliminarRecurso = (resourceUserId) =>
    canDeleteResource(usuario, resourceUserId);

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

  return (
    <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>
  );
};

export default ContextoAuth;
