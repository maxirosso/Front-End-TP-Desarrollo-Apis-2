/**
 * Hook personalizado para publicar eventos al Core (Event Hub)
 * 
 * Facilita el uso del servicio de eventos en componentes React,
 * proporcionando funciones simplificadas para publicar eventos
 * comunes y manejar estados de carga/error.
 * 
 * @example
 * ```jsx
 * const { publishReviewCreated, isPublishing, error } = useEvents();
 * 
 * const handleCreateReview = async (reviewData) => {
 *   const review = await createReview(reviewData);
 *   await publishReviewCreated(review); // Publica evento al Core
 * };
 * ```
 */

import { useState, useCallback } from 'react';
import eventsAPI from '../services/eventsAPI';

/**
 * Hook para gestionar publicación de eventos
 */
const useEvents = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Publica un evento genérico
   */
  const publishEvent = useCallback(async (eventData) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      const result = await eventsAPI.publishEvent(eventData);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento:', err);
      // No lanzar error - los eventos son "fire and forget"
      return null;
    } finally {
      setIsPublishing(false);
    }
  }, []);

  // ========================================
  // EVENTOS DE RESEÑAS
  // ========================================

  /**
   * Publica evento de creación de reseña
   */
  const publishReviewCreated = useCallback(async (reviewData) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.reviewEvents.created(reviewData);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento resena.created:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Publica evento de actualización de reseña
   */
  const publishReviewUpdated = useCallback(async (reviewData) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.reviewEvents.updated(reviewData);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento resena.updated:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Publica evento de eliminación de reseña
   */
  const publishReviewDeleted = useCallback(async (reviewId, userId) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.reviewEvents.deleted(reviewId, userId);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento resena.deleted:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Publica evento de like en reseña
   */
  const publishReviewLiked = useCallback(async (reviewId, userId) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.reviewEvents.liked(reviewId, userId);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento resena.liked:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Publica evento de unlike en reseña
   */
  const publishReviewUnliked = useCallback(async (reviewId, userId) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.reviewEvents.unliked(reviewId, userId);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento resena.unliked:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Publica evento de comentario en reseña
   */
  const publishReviewCommented = useCallback(async (commentData) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.reviewEvents.commented(commentData);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento resena.commented:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  // ========================================
  // EVENTOS DE PELÍCULAS
  // ========================================

  /**
   * Publica evento de visita a película
   */
  const publishMovieVisited = useCallback(async (movieData) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.movieEvents.visited(movieData);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento pelicula.visited:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Publica evento de búsqueda de película
   */
  const publishMovieSearched = useCallback(async (searchTerm, userId) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.movieEvents.searched(searchTerm, userId);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento pelicula.searched:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Publica evento de creación de película
   */
  const publishMovieCreated = useCallback(async (movieData) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.movieEvents.created(movieData);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento pelicula.created:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  // ========================================
  // EVENTOS DE USUARIOS
  // ========================================

  /**
   * Publica evento de visita a perfil
   */
  const publishProfileVisited = useCallback(async (profileUserId, visitorUserId) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.userEvents.profileVisited(profileUserId, visitorUserId);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento usuario.perfil.visited:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Publica evento de actualización de perfil
   */
  const publishProfileUpdated = useCallback(async (userData) => {
    setIsPublishing(true);
    setError(null);
    
    try {
      await eventsAPI.userEvents.profileUpdated(userData);
    } catch (err) {
      setError(err.message);
      console.error('Error publicando evento usuario.perfil.updated:', err);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  return {
    // Estado
    isPublishing,
    error,
    
    // Publicar evento genérico
    publishEvent,
    
    // Eventos de reseñas
    publishReviewCreated,
    publishReviewUpdated,
    publishReviewDeleted,
    publishReviewLiked,
    publishReviewUnliked,
    publishReviewCommented,
    
    // Eventos de películas
    publishMovieVisited,
    publishMovieSearched,
    publishMovieCreated,
    
    // Eventos de usuarios
    publishProfileVisited,
    publishProfileUpdated,
  };
};

export default useEvents;

