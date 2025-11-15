/**
 * Utilidades para manejo de autenticación, JWT y permisos
 */

// Roles disponibles en el sistema
export const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

// Claves de localStorage
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

/**
 * Guarda el token JWT en localStorage
 */
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Obtiene el token JWT de localStorage
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Elimina el token JWT de localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Guarda el refresh token en localStorage
 */
export const saveRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Obtiene el refresh token de localStorage
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Elimina el refresh token de localStorage
 */
export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Guarda ambos tokens de autenticación en localStorage
 */
export const saveAuthTokens = (accessToken, refreshToken) => {
  if (accessToken) saveToken(accessToken);
  if (refreshToken) saveRefreshToken(refreshToken);
};

/**
 * Guarda los datos del usuario en localStorage
 */
export const saveUser = (userData) => {
  if (userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }
};

/**
 * Obtiene los datos del usuario de localStorage
 */
export const getUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Elimina los datos del usuario de localStorage
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Limpia toda la información de autenticación
 */
export const clearAuth = () => {
  removeToken();
  removeRefreshToken();
  removeUser();
};

/**
 * Decodifica un JWT (solo la parte del payload, sin verificar la firma)
 * NOTA: Esta función NO valida el token, solo lo decodifica.
 * La validación debe hacerse en el backend.
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Verifica si el token ha expirado
 */
export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = () => {
  const accessToken = getToken();
  const refreshToken = getRefreshToken();

  if (!accessToken && !refreshToken) return false;

  if (!accessToken && refreshToken) return true;

  if (accessToken && !isTokenExpired(accessToken)) return true;

  if (refreshToken) return true;

  return false;
};

/**
 * Verifica si el usuario tiene un rol específico
 */
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
};

/**
 * Verifica si el usuario es admin
 */
export const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN);
};

/**
 * Verifica si el usuario es moderador
 */
export const isModerator = (user) => {
  return hasRole(user, ROLES.MODERATOR);
};

/**
 * Verifica si el usuario es admin o moderador
 */
export const isAdminOrModerator = (user) => {
  return hasRole(user, [ROLES.ADMIN, ROLES.MODERATOR]);
};

/**
 * Verifica si el usuario tiene un permiso específico
 * Los usuarios estándar (role: "user") no tienen array de permisos explícitos
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;

  // Los usuarios estándar no tienen permisos administrativos
  if (user.role === ROLES.USER) return false;

  // Admin y moderadores tienen array de permisos
  if (!user.permissions || !Array.isArray(user.permissions)) return false;

  if (Array.isArray(permission)) {
    return permission.some((p) => user.permissions.includes(p));
  }

  return user.permissions.includes(permission);
};

/**
 * Verifica si el usuario puede editar un recurso específico
 * (es el propietario del recurso o tiene permisos de administrador)
 */
export const canEditResource = (user, resourceUserId) => {
  if (!user) return false;

  // El usuario es el propietario del recurso
  if (user.user_id === resourceUserId) return true;

  // El usuario tiene permisos administrativos
  return isAdminOrModerator(user);
};

/**
 * Verifica si el usuario puede eliminar un recurso específico
 */
export const canDeleteResource = (user, resourceUserId) => {
  return canEditResource(user, resourceUserId);
};

/**
 * Obtiene el nombre completo del usuario
 */
export const getFullName = (user) => {
  if (!user) return "";

  if (user.full_name) return user.full_name;
  if (user.name && user.last_name) return `${user.name} ${user.last_name}`;
  if (user.name) return user.name;

  return user.email || user.sub || "Usuario";
};

/**
 * Obtiene los iniciales del usuario para avatar
 */
export const getUserInitials = (user) => {
  if (!user) return "?";

  const fullName = getFullName(user);
  const parts = fullName.split(" ");

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return fullName.substring(0, 2).toUpperCase();
};

/**
 * Formatea el rol para mostrarlo al usuario
 */
export const formatRole = (role) => {
  const roleNames = {
    [ROLES.ADMIN]: "Administrador",
    [ROLES.MODERATOR]: "Moderador",
    [ROLES.USER]: "Usuario",
  };

  return roleNames[role] || role;
};

/**
 * Obtiene el badge de color según el rol
 */
export const getRoleBadgeClass = (role) => {
  const badgeClasses = {
    [ROLES.ADMIN]: "badge-admin",
    [ROLES.MODERATOR]: "badge-moderator",
    [ROLES.USER]: "badge-user",
  };

  return badgeClasses[role] || "badge-default";
};

const authUtils = {
  ROLES,
  saveToken,
  getToken,
  removeToken,
  saveRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  saveAuthTokens,
  saveUser,
  getUser,
  removeUser,
  clearAuth,
  decodeJWT,
  isTokenExpired,
  isAuthenticated,
  hasRole,
  isAdmin,
  isModerator,
  isAdminOrModerator,
  hasPermission,
  canEditResource,
  canDeleteResource,
  getFullName,
  getUserInitials,
  formatRole,
  getRoleBadgeClass,
};

export default authUtils;
