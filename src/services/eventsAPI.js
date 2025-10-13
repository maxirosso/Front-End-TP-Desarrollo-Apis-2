/**
 * Servicio para publicar eventos al Core (Event Hub)
 * 
 * El Core actúa como Event Hub centralizando el envío y recepción de mensajes
 * entre servicios mediante RabbitMQ.
 * 
 * Especificación CloudEvents:
 * - type: Tipo de evento (ej: "pelicula.created", "resena.created")
 * - source: Origen del evento (ej: "/api/peliculas", "/api/resenas")
 * - id: ID único del evento (UUID)
 * - time: Fecha y hora del evento (ISO 8601)
 * - datacontenttype: Tipo de contenido (application/json)
 * - data: Payload del evento
 */

import { getToken } from '../utils/auth';

const CORE_EVENT_URL = process.env.REACT_APP_CORE_EVENT_URL || 'http://core-letterboxd.us-east-2.elasticbeanstalk.com';

/**
 * Genera un UUID v4 simple
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Obtiene la fecha actual en formato ISO 8601 con timezone
 */
const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Obtiene la fecha actual como array [año, mes, día, hora, minuto]
 */
const getCurrentSysDate = () => {
  const now = new Date();
  return [
    now.getFullYear(),
    now.getMonth() + 1, // Mes es 0-indexed
    now.getDate(),
    now.getHours(),
    now.getMinutes()
  ];
};

/**
 * Publica un evento al Core
 * 
 * @param {Object} eventData - Datos del evento
 * @param {string} eventData.type - Tipo de evento (ej: "resena.created")
 * @param {string} eventData.source - Origen del evento (ej: "/api/resenas")
 * @param {Object} eventData.data - Payload de datos del evento
 * @param {string} [eventData.id] - ID único del evento (se genera automáticamente si no se proporciona)
 * @returns {Promise<Object>} Respuesta del Core
 */
const publishEvent = async (eventData) => {
  const token = getToken();
  
  // Construir el evento según la especificación CloudEvents
  const cloudEvent = {
    id: eventData.id || generateUUID(),
    type: eventData.type,
    specversion: '1.0',
    source: eventData.source,
    time: getCurrentTimestamp(),
    datacontenttype: 'application/json',
    sysDate: getCurrentSysDate(),
    data: eventData.data,
    _origin: 'frontend'
  };

  try {
    const response = await fetch(`${CORE_EVENT_URL}/events/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(cloudEvent),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error publicando evento al Core:', error);
    throw error;
  }
};

/**
 * Eventos predefinidos para el dominio de Reseñas
 */
export const reviewEvents = {
  /**
   * Publica evento de creación de reseña
   * @param {Object} reviewData - Datos de la reseña creada
   */
  created: (reviewData) => publishEvent({
    type: 'resena.created',
    source: '/api/resenas',
    data: {
      id: reviewData.id,
      pelicula_id: reviewData.pelicula_id,
      usuario_id: reviewData.usuario_id,
      calificacion: reviewData.calificacion,
      contenido: reviewData.contenido,
      fecha_creacion: reviewData.fecha_creacion,
    }
  }),

  /**
   * Publica evento de actualización de reseña
   * @param {Object} reviewData - Datos de la reseña actualizada
   */
  updated: (reviewData) => publishEvent({
    type: 'resena.updated',
    source: '/api/resenas',
    data: {
      id: reviewData.id,
      pelicula_id: reviewData.pelicula_id,
      usuario_id: reviewData.usuario_id,
      calificacion: reviewData.calificacion,
      contenido: reviewData.contenido,
      fecha_modificacion: new Date().toISOString(),
    }
  }),

  /**
   * Publica evento de eliminación de reseña
   * @param {number} reviewId - ID de la reseña eliminada
   * @param {number} userId - ID del usuario que eliminó
   */
  deleted: (reviewId, userId) => publishEvent({
    type: 'resena.deleted',
    source: '/api/resenas',
    data: {
      id: reviewId,
      usuario_id: userId,
      fecha_eliminacion: new Date().toISOString(),
    }
  }),

  /**
   * Publica evento de like en reseña
   * @param {number} reviewId - ID de la reseña
   * @param {number} userId - ID del usuario que dio like
   */
  liked: (reviewId, userId) => publishEvent({
    type: 'resena.liked',
    source: '/api/resenas',
    data: {
      resena_id: reviewId,
      usuario_id: userId,
      fecha: new Date().toISOString(),
    }
  }),

  /**
   * Publica evento de unlike en reseña
   * @param {number} reviewId - ID de la reseña
   * @param {number} userId - ID del usuario que quitó el like
   */
  unliked: (reviewId, userId) => publishEvent({
    type: 'resena.unliked',
    source: '/api/resenas',
    data: {
      resena_id: reviewId,
      usuario_id: userId,
      fecha: new Date().toISOString(),
    }
  }),

  /**
   * Publica evento de comentario en reseña
   * @param {Object} commentData - Datos del comentario
   */
  commented: (commentData) => publishEvent({
    type: 'resena.commented',
    source: '/api/resenas',
    data: {
      resena_id: commentData.resena_id,
      usuario_id: commentData.usuario_id,
      comentario_id: commentData.id,
      contenido: commentData.contenido,
      fecha: new Date().toISOString(),
    }
  }),
};

/**
 * Eventos predefinidos para el dominio de Películas
 */
export const movieEvents = {
  /**
   * Publica evento de visita a película
   * @param {Object} movieData - Datos de la película visitada
   */
  visited: (movieData) => publishEvent({
    type: 'pelicula.visited',
    source: '/discovery/api',
    data: {
      id: movieData.id,
      titulo: movieData.titulo,
      usuario_id: movieData.usuario_id,
      fecha_visita: new Date().toISOString(),
    }
  }),

  /**
   * Publica evento de búsqueda de película
   * @param {string} searchTerm - Término de búsqueda
   * @param {number} userId - ID del usuario que realizó la búsqueda
   */
  searched: (searchTerm, userId) => publishEvent({
    type: 'pelicula.searched',
    source: '/discovery/api',
    data: {
      termino_busqueda: searchTerm,
      usuario_id: userId,
      fecha: new Date().toISOString(),
    }
  }),

  /**
   * Publica evento de creación de película (admin)
   * @param {Object} movieData - Datos de la película creada
   */
  created: (movieData) => publishEvent({
    type: 'pelicula.created',
    source: '/api/peliculas',
    data: {
      id: movieData.id,
      titulo: movieData.titulo,
      genero: movieData.genero,
      anio: movieData.anio,
      director: movieData.director,
      creado_por: movieData.creado_por,
      fecha_creacion: new Date().toISOString(),
    }
  }),
};

/**
 * Eventos predefinidos para el dominio de Usuarios
 */
export const userEvents = {
  /**
   * Publica evento de visita al perfil
   * @param {number} profileUserId - ID del usuario cuyo perfil se visitó
   * @param {number} visitorUserId - ID del usuario que visitó el perfil
   */
  profileVisited: (profileUserId, visitorUserId) => publishEvent({
    type: 'usuario.perfil.visited',
    source: '/api/usuarios',
    data: {
      perfil_usuario_id: profileUserId,
      visitante_usuario_id: visitorUserId,
      fecha_visita: new Date().toISOString(),
    }
  }),

  /**
   * Publica evento de actualización de perfil
   * @param {Object} userData - Datos del usuario actualizado
   */
  profileUpdated: (userData) => publishEvent({
    type: 'usuario.perfil.updated',
    source: '/api/usuarios',
    data: {
      id: userData.id,
      nombre: userData.nombre,
      email: userData.email,
      fecha_modificacion: new Date().toISOString(),
    }
  }),
};

/**
 * Servicio de eventos principal
 */
const eventsAPI = {
  publishEvent,
  reviewEvents,
  movieEvents,
  userEvents,
  
  // Utilidades
  generateUUID,
  getCurrentTimestamp,
  getCurrentSysDate,
};

export default eventsAPI;

