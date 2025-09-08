const API_BASE_URL = 'http://localhost:3000';
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
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/users/${userId}/reviews${queryParams ? `?${queryParams}` : ''}`;
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
};

// Servicios de usuarios
export const usersAPI = {
  // Obtener usuario por ID
  getById: (id) => 
    apiRequest(`/users/${id}`),

  // Obtener todos los usuarios
  getAll: () => 
    apiRequest('/users'),
};

// Servicios de películas (para futura integración)
export const moviesAPI = {
  // Mock data hasta que se integre con el módulo de películas
  getById: async (id) => {
    const mockMovies = {
      1: { id: 1, title: "El Padrino", year: 1972, genre: "drama" },
      2: { id: 2, title: "Blade Runner 2049", year: 2017, genre: "ciencia-ficcion" },
      3: { id: 3, title: "Parasite", year: 2019, genre: "thriller" },
      4: { id: 4, title: "Mad Max: Fury Road", year: 2015, genre: "accion" },
      5: { id: 5, title: "Her", year: 2013, genre: "romance" },
    };
    return mockMovies[id] || null;
  },

  getAll: async () => {
    return [
      { id: 1, title: "El Padrino", year: 1972, genre: "drama" },
      { id: 2, title: "Blade Runner 2049", year: 2017, genre: "ciencia-ficcion" },
      { id: 3, title: "Parasite", year: 2019, genre: "thriller" },
      { id: 4, title: "Mad Max: Fury Road", year: 2015, genre: "accion" },
      { id: 5, title: "Her", year: 2013, genre: "romance" },
    ];
  },
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
    await apiRequest('/reviews/filter?limit=1');
    return true;
  } catch (error) {
    console.warn('Backend not available, falling back to mock data');
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
