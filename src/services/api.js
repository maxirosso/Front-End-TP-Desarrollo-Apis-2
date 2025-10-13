import { getToken } from '../utils/auth';
import eventsAPI from './eventsAPI';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Obtener el token de autenticación
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  // Agregar el token de autenticación si existe
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Si el token expiró o es inválido (401), lanzar error específico
      if (response.status === 401) {
        const error = new Error(errorData.error || 'No autorizado');
        error.status = 401;
        error.data = errorData;
        throw error;
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// Servicios de autenticación
export const authAPI = {
  // Login - Autenticar usuario con credenciales (OAuth2 format)
  login: (credentials) => {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('scope', '');
    formData.append('client_id', '');
    formData.append('client_secret', '');
    
    return apiRequest('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  },

  // Obtener perfil del usuario autenticado
  getMe: () => 
    apiRequest('/api/v1/auth/me'),

  // Refrescar token JWT
  refresh: (refreshToken) => 
    apiRequest('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  // Logout (si el backend tiene endpoint de logout)
  logout: () => 
    apiRequest('/api/v1/auth/logout', {
      method: 'POST',
    }),
};

// Servicios de reseñas
export const reviewsAPI = {
  // HU-001: Crear reseña
  create: (reviewData) => 
    apiRequest('/api/v1/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  // HU-002: Ver reseña específica
  getById: (id) => 
    apiRequest(`/api/v1/reviews/${id}`),

  // HU-003: Eliminar reseña
  delete: (id) => 
    apiRequest(`/api/v1/reviews/${id}`, {
      method: 'DELETE',
    }),

  // HU-004: Editar reseña
  update: (id, reviewData) => 
    apiRequest(`/api/v1/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    }),

  // HU-005: Obtener reseñas por película
  getByMovie: (movieId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/v1/movies/${movieId}/reviews${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // HU-006: Buscar reseñas por usuario
  getByUser: (userId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/v1/users/${userId}/reviews${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // HU-007 y HU-008: Filtrar y ordenar reseñas
  filter: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/v1/reviews/filter${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // Obtener todas las reseñas con filtros opcionales
  getAll: (filters = {}) => {
    const defaultFilters = {
      sort: 'recent',
      limit: '1000', // ✅ Aumentar límite para obtener todas las reseñas
      offset: '0',
      ...filters
    };
    return reviewsAPI.filter(defaultFilters);
  },

  // Likes
  getLikes: (reviewId) => 
    apiRequest(`/api/v1/reviews/${reviewId}/likes`),

  addLike: (reviewId, userId) => 
    apiRequest(`/api/v1/reviews/${reviewId}/likes`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),

  removeLike: (reviewId, userId) => 
    apiRequest(`/api/v1/reviews/${reviewId}/likes`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    }),

  // Comentarios
  getComments: (reviewId) => 
    apiRequest(`/api/v1/reviews/${reviewId}/comments`),

  addComment: (reviewId, userId, comment) => 
    apiRequest(`/api/v1/reviews/${reviewId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, comment }),
    }),

  deleteComment: (commentId, userId) => 
    apiRequest(`/api/v1/reviews/comments/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    }),
};

// Servicios de usuarios
export const usersAPI = {
  // Crear usuario
  create: (userData) => 
    apiRequest('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Obtener usuario por ID (con estadísticas)
  getById: (id) => 
    apiRequest(`/api/v1/users/${id}`),

  // Obtener todos los usuarios
  getAll: () => 
    apiRequest('/api/v1/users'),

  // Buscar usuario por email
  getByEmail: (email) => 
    apiRequest(`/api/v1/users/search?email=${encodeURIComponent(email)}`),

  // Actualizar usuario
  update: (id, userData) => 
    apiRequest(`/api/v1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Eliminar usuario
  delete: (id) => 
    apiRequest(`/api/v1/users/${id}`, {
      method: 'DELETE',
    }),
};

// Servicios de películas
export const moviesAPI = {
  // Obtener película por ID
  getById: (id) => 
    apiRequest(`/api/v1/movies/${id}`),

  // Obtener todas las películas
  getAll: () => 
    apiRequest('/api/v1/movies'),

  // Buscar películas
  search: (searchTerm) => 
    apiRequest(`/api/v1/movies/search?q=${encodeURIComponent(searchTerm)}`),

  // Obtener películas por género
  getByGenre: (genre) => 
    apiRequest(`/api/v1/movies/genre/${encodeURIComponent(genre)}`),

  // Crear película (admin)
  create: (movieData) => 
    apiRequest('/api/v1/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    }),

  // Actualizar película (admin)
  update: (id, movieData) => 
    apiRequest(`/api/v1/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData),
    }),

  // Eliminar película (admin)
  delete: (id) => 
    apiRequest(`/api/v1/movies/${id}`, {
      method: 'DELETE',
    }),
};

// Utilidades para manejo de errores
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('Failed to fetch')) {
    return 'Error de conexión. Verifica que el servidor esté ejecutándose.';
  }
  
  if (error.message.includes('404')) {
    return 'Recurso no encontrado.';
  }
  
  if (error.message.includes('500')) {
    return 'Error interno del servidor.';
  }
  
  return error.message || 'Ha ocurrido un error inesperado.';
};

// Función para verificar si el backend está disponible
export const checkBackendHealth = async () => {
  try {
    await apiRequest('/health');
    return true;
  } catch (error) {
    console.warn('Backend not available:', error.message);
    return false;
  }
};

const apiService = {
  authAPI,
  reviewsAPI,
  usersAPI,
  moviesAPI,
  eventsAPI,
  handleApiError,
  checkBackendHealth,
};

export default apiService;
