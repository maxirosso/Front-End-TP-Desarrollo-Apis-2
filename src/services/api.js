// services/api.js
import { getToken, getRefreshToken, saveAuthTokens } from "../utils/auth";

const USER_API_URL = process.env.REACT_APP_USER_URL; // módulo de usuarios (login)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080"; // back (movies/reviews)

const jsonHeaders = { "Content-Type": "application/json" };

const buildQuery = (o = {}) => {
  const params = new URLSearchParams();
  Object.entries(o).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, v);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

const parseMaybeJson = async (response) => {
  if (response.status === 204) return null;
  const ct = response.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const txt = await response.text();
    return txt || null;
  }
  return response.json();
};

const apiRequestUser = async (endpoint, options = {}) => {
  const url = `${USER_API_URL}${endpoint}`;
  const token = getToken();

  const config = {
    method: options.method || "GET",
    headers: {
      ...(options.headers || {}),
      // NO seteamos Content-Type por defecto: lo define cada variante (JSON o form)
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body,
  };

  const res = await fetch(url, config);
  const payload = await parseMaybeJson(res).catch(() => null);

  if (!res.ok) {
    // Log claro para ver el motivo del 422
    console.error(`[users-api] ${res.status} ${url}`, payload);
    const err = new Error(
      (payload && (payload.error || payload.message)) || `HTTP ${res.status}`
    );
    err.status = res.status;
    err.data = payload;
    throw err;
  }
  return payload;
};

// --- helpers de envío para login ---
// const postJsonUser = (path, obj) =>
//   apiRequestUser(path, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(obj),
//   });

const postFormUser = (path, obj) => {
  const form = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => form.append(k, v ?? ""));
  return apiRequestUser(path, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn("[auth] No hay refresh_token guardado");
    throw new Error("No hay refresh_token");
  }

  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "";
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET || "";
  const SCOPE = process.env.REACT_APP_OAUTH_SCOPE || "";

  // ⚠️ Usamos el mismo endpoint que login, pero con grant_type=refresh_token
  // Ajustar path si tu user-service tiene un endpoint distinto para refresh.
  const res = await postFormUser("/api/v1/auth/login", {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    scope: SCOPE,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const newAccessToken =
    res?.access_token || res?.token || res?.jwt || res?.id_token || null;

  if (!newAccessToken) {
    console.error("[auth] Refresh respondió sin access_token. Body:", res);
    throw new Error("No se recibió nuevo access_token");
  }

  const newRefreshToken = res?.refresh_token || refreshToken; // pueden rotar o no

  saveAuthTokens(newAccessToken, newRefreshToken);
  console.log("[auth] Access token refrescado correctamente");
  return newAccessToken;
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const baseConfig = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body,
  };

  const doFetch = async (config) => {
    const res = await fetch(url, config);
    const data = await parseMaybeJson(res).catch(() => null);
    return { res, data };
  };

  // 1) Primer intento con el access token actual
  let { res, data } = await doFetch(baseConfig);

  // 2) Si todo bien, devolvemos
  if (res.ok) return data;

  // 3) Si es 401 por token expirado, intentamos refresh y reintentar UNA vez
  if (res.status === 401 && data && data.error === "Token expired") {
    try {
      console.warn("[apiRequest] Token expirado, intentando refresh...");
      const newAccessToken = await refreshAccessToken();

      const retryConfig = {
        ...baseConfig,
        headers: {
          ...baseConfig.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      };

      const retry = await doFetch(retryConfig);
      res = retry.res;
      data = retry.data;

      if (res.ok) return data;
    } catch (e) {
      console.error("[apiRequest] Error al refrescar token:", e);
      // dejamos que siga abajo y lance el error
    }
  }

  // 4) Si seguimos acá, falló (no fue 401 o refresh no solucionó)
  const error = new Error(
    (data && (data.error || data.message)) || `HTTP ${res.status}`
  );
  error.status = res.status;
  error.data = data;
  console.error(
    `[apiRequest] Error en ${baseConfig.method} ${url}`,
    "status:",
    res.status,
    "respuesta:",
    data
  );
  throw error;
};

//-------- Auth (solo login contra el módulo de usuarios) --------
export const authAPI = {
  /**
   * Intenta varios formatos comunes:
   * 1) JSON { email, password }
   * 2) JSON { username, password }
   * 3) x-www-form-urlencoded (OAuth2 Resource Owner Password) con grant_type=password
   *
   * Si tu user-service exige client_id/client_secret o scope, setealos en .env y se envían.
   */
  login: async (credentials) => {
    const { username, email, password } = credentials;

    // Opcionales por si tu user-service los pide (OAuth2)
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "";
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET || "";
    const SCOPE = process.env.REACT_APP_OAUTH_SCOPE || "";

    const attempts = [
      // 1) JSON con email
      // () => postJsonUser("/api/v1/auth/login", { email, password }),
      // // 2) JSON con username
      // () => postJsonUser("/api/v1/auth/login", { username, password }),
      // 3) FORM oauth2
      () =>
        postFormUser("/api/v1/auth/login", {
          grant_type: "password",
          username: email || username || "",
          password: password || "",
          scope: SCOPE,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
    ];

    let lastErr;
    for (const run of attempts) {
      try {
        const res = await run();
        // Normalizamos el nombre del campo token
        console.log("[login] respuesta user-service:", res);
        const token =
          res?.access_token || res?.token || res?.jwt || res?.id_token || null;
        if (!token) {
          // si vino un body que aclara por qué, lo mostramos
          console.warn("Login respondió sin token. Body:", res);
          throw new Error("No se recibió token del servidor");
        }
        const refreshToken = res?.refresh_token || null;
        return { token, refreshToken, raw: res };
      } catch (e) {
        lastErr = e;
        // 422/400 seguimos intentando la siguiente variante
        if (e.status !== 400 && e.status !== 422) break;
      }
    }
    throw lastErr || new Error("No se pudo iniciar sesión");
  },
};

// -------- Reviews --------
export const reviewsAPI = {
  create: (reviewData) =>
    apiRequest("/reviews", {
      method: "POST",
      headers: { ...jsonHeaders },
      body: JSON.stringify(reviewData),
    }),

  getById: (id) => apiRequest(`/reviews/${id}`),

  delete: (id) =>
    apiRequest(`/reviews/${id}`, {
      method: "DELETE",
    }),

  update: (id, reviewData) =>
    apiRequest(`/reviews/${id}`, {
      method: "PUT",
      headers: { ...jsonHeaders },
      body: JSON.stringify(reviewData),
    }),

  getByUser: (userId, filters = {}) =>
    apiRequest(`/users/${userId}/reviews${buildQuery(filters)}`),

  filter: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/reviews/filter${queryParams ? `?${queryParams}` : ""}`;
    return apiRequest(endpoint);
  },

  // “todas” usa /reviews/filter con defaults
  getAll: (filters = {}) => {
    const defaults = { sort: "recent", limit: "1000", offset: "0", ...filters };
    return reviewsAPI.filter(defaults);
  },
};

// -------- Users --------
export const usersAPI = {
  getById: (id) => apiRequest(`/users/${id}`),
  getAll: () => apiRequest("/users"),
  getReviews: (userId, filters = {}) =>
    apiRequest(`/users/${userId}/reviews${buildQuery(filters)}`),
};

// -------- Movies --------
export const moviesAPI = {
  getById: (id) => apiRequest(`/movies/${id}`),
  getAll: () => apiRequest("/movies"),
  search: (searchTerm) =>
    apiRequest(`/movies/search${buildQuery({ query: searchTerm })}`),
  getByGenre: (genre) =>
    apiRequest(`/movies/genre/${encodeURIComponent(genre)}`),
};

// -------- Social (solo endpoints existentes) --------
export const socialAPI = {
  getAllLikes: () => apiRequest("/social/likes"),
  getLikesByReview: (reviewId) =>
    apiRequest(`/social/likes/review/${reviewId}`),
};

// -------- Utilidades --------
export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.status === 401) return "No autorizado. Iniciá sesión nuevamente.";
  if (error.status === 404) return "Recurso no encontrado.";
  if (error.status === 500) return "Error interno del servidor.";
  if ((error.message || "").includes("Failed to fetch"))
    return "Error de conexión. Verificá que el servidor esté ejecutándose.";

  return error.message || "Ha ocurrido un error inesperado.";
};

// Simple health: usa /movies (existe) como ping
export const checkBackendHealth = async () => {
  try {
    await apiRequest("/movies");
    return true;
  } catch {
    return false;
  }
};

const apiService = {
  authAPI,
  reviewsAPI,
  usersAPI,
  moviesAPI,
  socialAPI,
  handleApiError,
  checkBackendHealth,
};

export default apiService;
