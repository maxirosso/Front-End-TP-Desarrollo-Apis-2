const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// Servicios de reseñas
export const reviewsAPI = {
  // HU-001: Crear reseña
  create: (reviewData) => 
    apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  // HU-002: Ver reseña específica
  getById: (id) => 
    apiRequest(`/reviews/${id}`),

  // HU-003: Eliminar reseña
  delete: (id) => 
    apiRequest(`/reviews/${id}`, {
      method: 'DELETE',
    }),

  // HU-004: Editar reseña
  update: (id, reviewData) => 
    apiRequest(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    }),

  // HU-005: Buscar reseñas por película
  getByMovie: (movieId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/movies/${movieId}/reviews${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // HU-006: Buscar reseñas por usuario
  getByUser: (userId, filters = {}) => {
    const allFilters = { user_id: userId, ...filters };
    const queryParams = new URLSearchParams(allFilters).toString();
    const endpoint = `/reviews${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // HU-007 y HU-008: Filtrar y ordenar reseñas
  filter: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/reviews/filter${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // Obtener todas las reseñas con filtros opcionales
  getAll: (filters = {}) => {
    const defaultFilters = {
      sort: 'recent',
      limit: '20',
      offset: '0',
      ...filters
    };
    return reviewsAPI.filter(defaultFilters);
  },

  // Likes
  getLikes: (reviewId) => 
    apiRequest(`/reviews/${reviewId}/likes`),

  addLike: (reviewId, userId) => 
    apiRequest(`/reviews/${reviewId}/likes`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),

  removeLike: (reviewId, userId) => 
    apiRequest(`/reviews/${reviewId}/likes`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    }),

  // Comentarios
  getComments: (reviewId) => 
    apiRequest(`/reviews/${reviewId}/comments`),

  addComment: (reviewId, userId, comment) => 
    apiRequest(`/reviews/${reviewId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, comment }),
    }),

  deleteComment: (commentId, userId) => 
    apiRequest(`/reviews/comments/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    }),
};

// Servicios de usuarios
export const usersAPI = {
  // Crear usuario
  create: (userData) => 
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Obtener usuario por ID (con estadísticas)
  getById: (id) => 
    apiRequest(`/users/${id}`),

  // Obtener todos los usuarios
  getAll: () => 
    apiRequest('/users'),

  // Buscar usuario por email
  getByEmail: (email) => 
    apiRequest(`/users/search?email=${encodeURIComponent(email)}`),

  // Actualizar usuario
  update: (id, userData) => 
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Eliminar usuario
  delete: (id) => 
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Servicios de películas
export const moviesAPI = {
  // Obtener película por ID
  getById: (id) => 
    apiRequest(`/movies/${id}`),

  // Obtener todas las películas
  getAll: () => 
    apiRequest('/movies'),

  // Buscar películas
  search: (searchTerm) => 
    apiRequest(`/movies/search?q=${encodeURIComponent(searchTerm)}`),

  // Obtener películas por género
  getByGenre: (genre) => 
    apiRequest(`/movies/genre/${encodeURIComponent(genre)}`),

  // Crear película (admin)
  create: (movieData) => 
    apiRequest('/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    }),

  // Actualizar película (admin)
  update: (id, movieData) => 
    apiRequest(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData),
    }),

  // Eliminar película (admin)
  delete: (id) => 
    apiRequest(`/movies/${id}`, {
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

export default {
  reviewsAPI,
  usersAPI,
  moviesAPI,
  handleApiError,
  checkBackendHealth,
};
