import React, { createContext, useContext, useState, useEffect } from 'react';
import { reviewsAPI, usersAPI, moviesAPI, handleApiError, checkBackendHealth } from '../services/api';

// Crear el contexto
const ContextoResenas = createContext();

// Hook personalizado para usar el contexto
export const useResenas = () => {
  const contexto = useContext(ContextoResenas);
  if (!contexto) {
    throw new Error('useResenas debe ser usado dentro de un ProveedorResenas');
  }
  return contexto;
};

const datosPeliculasEjemplo = [
  {
    id: 1,
    title: "El Padrino",
    movie_id: 1,
    user_id: 1,
    year: 1972,
    poster_url: "https://via.placeholder.com/120x180/2C3E50/ECF0F1?text=El+Padrino",
    rating: 5,
    user_name: "usuario_actual",
    created_at: "2024-03-15T10:00:00Z",
    body: "Una obra maestra absoluta del cine. La narrativa de Coppola es impecable, combinando drama familiar con elementos del crimen de manera magistral. Cada escena está cuidadosamente construida, y las actuaciones de Brando y Pacino son legendarias. Es imposible no quedar cautivado por la complejidad de los personajes y la profundidad de la historia.",
    likes: 24,
    yaLeDiLike: true,
    comentarios: [
      { id: 1, usuario: "otro_usuario", texto: "Totalmente de acuerdo, es una obra maestra", fecha: "16 de marzo, 2024" }
    ],
    tags: ["Obra Maestra", "Drama", "Spoiler Free"],
    has_spoilers: false,
    genre: "drama",
    // Mantener compatibilidad con formato anterior
    titulo: "El Padrino",
    año: 1972,
    imagenUrl: "https://via.placeholder.com/120x180/2C3E50/ECF0F1?text=El+Padrino",
    calificacion: 5,
    usuario: "usuario_actual",
    fechaResena: "15 de marzo, 2024",
    textoResena: "Una obra maestra absoluta del cine. La narrativa de Coppola es impecable, combinando drama familiar con elementos del crimen de manera magistral. Cada escena está cuidadosamente construida, y las actuaciones de Brando y Pacino son legendarias. Es imposible no quedar cautivado por la complejidad de los personajes y la profundidad de la historia.",
    megusta: true,
    contieneEspoilers: false,
    genero: "drama"
  },
  {
    id: 2,
    title: "Blade Runner 2049",
    movie_id: 2,
    user_id: 2,
    year: 2017,
    poster_url: "https://via.placeholder.com/120x180/E74C3C/ECF0F1?text=Blade+Runner",
    rating: 4,
    user_name: "scifi_lover",
    created_at: "2024-03-12T10:00:00Z",
    body: "Denis Villeneuve logra crear una secuela que honra al original mientras construye algo completamente nuevo. La cinematografía es deslumbrante, el diseño de sonido es excepcional, y Ryan Gosling ofrece una actuación muy matizada. Una reflexión profunda sobre la humanidad y la identidad en un futuro distópico.",
    likes: 18,
    yaLeDiLike: false,
    comentarios: [],
    tags: ["Ciencia Ficción", "Spoiler Free"],
    has_spoilers: false,
    genre: "ciencia-ficcion",
    // Compatibilidad
    titulo: "Blade Runner 2049",
    año: 2017,
    imagenUrl: "https://via.placeholder.com/120x180/E74C3C/ECF0F1?text=Blade+Runner",
    calificacion: 4,
    usuario: "scifi_lover",
    fechaResena: "12 de marzo, 2024",
    textoResena: "Denis Villeneuve logra crear una secuela que honra al original mientras construye algo completamente nuevo. La cinematografía es deslumbrante, el diseño de sonido es excepcional, y Ryan Gosling ofrece una actuación muy matizada. Una reflexión profunda sobre la humanidad y la identidad en un futuro distópico.",
    megusta: true,
    contieneEspoilers: false,
    genero: "ciencia-ficcion"
  },
  {
    id: 3,
    title: "Parasite",
    movie_id: 3,
    user_id: 3,
    year: 2019,
    poster_url: "https://via.placeholder.com/120x180/1ABC9C/ECF0F1?text=Parasite",
    rating: 5,
    user_name: "cinema_critic",
    created_at: "2024-03-10T10:00:00Z",
    body: "Bong Joon-ho presenta una crítica social brillante envuelta en un thriller impredecible. La película funciona en múltiples niveles: como comedia negra, thriller psicológico y comentario social. Cada detalle visual tiene un propósito, y la forma en que construye la tensión es magistral.",
    likes: 31,
    yaLeDiLike: true,
    comentarios: [
      { id: 1, usuario: "usuario_actual", texto: "Increíble análisis!", fecha: "11 de marzo, 2024" },
      { id: 2, usuario: "otro_fan", texto: "Una de las mejores del año", fecha: "12 de marzo, 2024" }
    ],
    tags: ["Thriller", "Obra Maestra"],
    has_spoilers: false,
    genre: "thriller",
    // Compatibilidad
    titulo: "Parasite",
    año: 2019,
    imagenUrl: "https://via.placeholder.com/120x180/1ABC9C/ECF0F1?text=Parasite",
    calificacion: 5,
    usuario: "cinema_critic",
    fechaResena: "10 de marzo, 2024",
    textoResena: "Bong Joon-ho presenta una crítica social brillante envuelta en un thriller impredecible. La película funciona en múltiples niveles: como comedia negra, thriller psicológico y comentario social. Cada detalle visual tiene un propósito, y la forma en que construye la tensión es magistral.",
    megusta: false,
    contieneEspoilers: false,
    genero: "thriller"
  },
  {
    id: 4,
    title: "Mad Max: Fury Road",
    movie_id: 4,
    user_id: 4,
    year: 2015,
    poster_url: "https://via.placeholder.com/120x180/F39C12/ECF0F1?text=Mad+Max",
    rating: 4,
    user_name: "action_fan",
    created_at: "2024-03-08T10:00:00Z",
    body: "George Miller demuestra que las películas de acción pueden ser arte. Cada secuencia de acción está coreografiada con precisión cinematográfica. Charlize Theron y Tom Hardy tienen una química fantástica, y la película logra contar una historia completa con diálogo mínimo pero impacto máximo.",
    likes: 12,
    yaLeDiLike: false,
    comentarios: [],
    tags: ["Acción", "Spoiler Free"],
    has_spoilers: false,
    genre: "accion",
    // Compatibilidad
    titulo: "Mad Max: Fury Road",
    año: 2015,
    imagenUrl: "https://via.placeholder.com/120x180/F39C12/ECF0F1?text=Mad+Max",
    calificacion: 4,
    usuario: "action_fan",
    fechaResena: "8 de marzo, 2024",
    textoResena: "George Miller demuestra que las películas de acción pueden ser arte. Cada secuencia de acción está coreografiada con precisión cinematográfica. Charlize Theron y Tom Hardy tienen una química fantástica, y la película logra contar una historia completa con diálogo mínimo pero impacto máximo.",
    megusta: true,
    contieneEspoilers: false,
    genero: "accion"
  },
  {
    id: 5,
    title: "Her",
    movie_id: 5,
    user_id: 1,
    year: 2013,
    poster_url: "https://via.placeholder.com/120x180/9B59B6/ECF0F1?text=Her",
    rating: 4,
    user_name: "usuario_actual",
    created_at: "2024-03-05T10:00:00Z",
    body: "Spike Jonze crea una historia de amor única y profundamente humana sobre la conexión en la era digital. Joaquin Phoenix ofrece una actuación vulnerable y auténtica. La película plantea preguntas fascinantes sobre la naturaleza del amor y la intimidad en un futuro no tan lejano.",
    likes: 8,
    yaLeDiLike: false,
    comentarios: [],
    tags: ["Romance", "Drama"],
    has_spoilers: false,
    genre: "romance",
    // Compatibilidad
    titulo: "Her",
    año: 2013,
    imagenUrl: "https://via.placeholder.com/120x180/9B59B6/ECF0F1?text=Her",
    calificacion: 4,
    usuario: "usuario_actual",
    fechaResena: "5 de marzo, 2024",
    textoResena: "Spike Jonze crea una historia de amor única y profundamente humana sobre la conexión en la era digital. Joaquin Phoenix ofrece una actuación vulnerable y auténtica. La película plantea preguntas fascinantes sobre la naturaleza del amor y la intimidad en un futuro no tan lejano.",
    megusta: false,
    contieneEspoilers: false,
    genero: "romance"
  },
  {
    id: 6,
    title: "Historia de amor única",
    movie_id: 6,
    user_id: 2,
    year: 2022,
    poster_url: "https://via.placeholder.com/120x180/E67E22/ECF0F1?text=Historia+de+Amor",
    rating: 4,
    user_name: "romantic_viewer",
    created_at: "2024-03-01T10:00:00Z",
    body: "Una película emotiva que captura la esencia del amor verdadero. La química entre los protagonistas es palpable y la historia se desarrolla de manera orgánica. Aunque predecible en algunos momentos, logra transmitir emociones genuinas y deja una sensación cálida en el espectador.",
    likes: 15,
    yaLeDiLike: false,
    comentarios: [
      { id: 1, usuario: "otro_usuario", texto: "Me hizo llorar al final", fecha: "2 de marzo, 2024" }
    ],
    tags: ["Romance", "Drama", "Spoiler Free"],
    has_spoilers: false,
    genre: "romance",
    // Compatibilidad
    titulo: "Historia de amor única",
    año: 2022,
    imagenUrl: "https://via.placeholder.com/120x180/E67E22/ECF0F1?text=Historia+de+Amor",
    calificacion: 4,
    usuario: "romantic_viewer",
    fechaResena: "1 de marzo, 2024",
    textoResena: "Una película emotiva que captura la esencia del amor verdadero. La química entre los protagonistas es palpable y la historia se desarrolla de manera orgánica. Aunque predecible en algunos momentos, logra transmitir emociones genuinas y deja una sensación cálida en el espectador.",
    megusta: false,
    contieneEspoilers: false,
    genero: "romance"
  },
  {
    id: 7,
    title: "Secuela digna del original",
    movie_id: 7,
    user_id: 3,
    year: 2023,
    poster_url: "https://via.placeholder.com/120x180/8E44AD/ECF0F1?text=Secuela+Digna",
    rating: 4,
    user_name: "sequel_fan",
    created_at: "2024-02-28T10:00:00Z",
    body: "Una secuela que realmente honra la película original. Los realizadores entendieron qué hacía especial la primera película y construyeron sobre esa base de manera inteligente. La narrativa se expande naturalmente y los personajes evolucionan de forma orgánica.",
    likes: 22,
    yaLeDiLike: true,
    comentarios: [
      { id: 1, usuario: "usuario_actual", texto: "Mejor que la original!", fecha: "1 de marzo, 2024" },
      { id: 2, usuario: "critico_cine", texto: "Raro ver una secuela tan bien hecha", fecha: "2 de marzo, 2024" }
    ],
    tags: ["Secuela", "Drama", "Spoiler Free"],
    has_spoilers: false,
    genre: "drama",
    // Compatibilidad
    titulo: "Secuela digna del original",
    año: 2023,
    imagenUrl: "https://via.placeholder.com/120x180/8E44AD/ECF0F1?text=Secuela+Digna",
    calificacion: 4,
    usuario: "sequel_fan",
    fechaResena: "28 de febrero, 2024",
    textoResena: "Una secuela que realmente honra la película original. Los realizadores entendieron qué hacía especial la primera película y construyeron sobre esa base de manera inteligente. La narrativa se expande naturalmente y los personajes evolucionan de forma orgánica.",
    megusta: true,
    contieneEspoilers: false,
    genero: "drama"
  },
  {
    id: 8,
    title: "Una obra maestra del cine",
    movie_id: 8,
    user_id: 1,
    year: 2021,
    poster_url: "https://via.placeholder.com/120x180/D35400/ECF0F1?text=Obra+Maestra",
    rating: 5,
    user_name: "usuario_actual",
    created_at: "2024-02-25T10:00:00Z",
    body: "Esta película trasciende géneros y expectativas. Cada aspecto técnico y artístico está ejecutado a la perfección. La dirección, actuación, cinematografía y guión trabajan en perfecta armonía para crear una experiencia cinematográfica verdaderamente memorable.",
    likes: 45,
    yaLeDiLike: true,
    comentarios: [
      { id: 1, usuario: "cinefilo_experto", texto: "Totalmente de acuerdo, una obra de arte", fecha: "26 de febrero, 2024" },
      { id: 2, usuario: "critico_profesional", texto: "Merece todos los premios", fecha: "27 de febrero, 2024" },
      { id: 3, usuario: "amante_cine", texto: "La vi 3 veces y cada vez descubro algo nuevo", fecha: "28 de febrero, 2024" }
    ],
    tags: ["Obra Maestra", "Drama", "Arte"],
    has_spoilers: false,
    genre: "drama",
    // Compatibilidad
    titulo: "Una obra maestra del cine",
    año: 2021,
    imagenUrl: "https://via.placeholder.com/120x180/D35400/ECF0F1?text=Obra+Maestra",
    calificacion: 5,
    usuario: "usuario_actual",
    fechaResena: "25 de febrero, 2024",
    textoResena: "Esta película trasciende géneros y expectativas. Cada aspecto técnico y artístico está ejecutado a la perfección. La dirección, actuación, cinematografía y guión trabajan en perfecta armonía para crear una experiencia cinematográfica verdaderamente memorable.",
    megusta: true,
    contieneEspoilers: false,
    genero: "drama"
  }
];

// Proveedor del contexto
export const ProveedorResenas = ({ children }) => {
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [ordenamientoActual, setOrdenamientoActual] = useState('fecha-desc');
  const [usingBackend, setUsingBackend] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarResenas = async () => {
      setCargando(true);
      setError(null);
      
      try {
        const backendAvailable = await checkBackendHealth();
        setUsingBackend(backendAvailable);
        
        if (backendAvailable) {
          console.log('Cargando reseñas desde API...');
          const response = await reviewsAPI.getAll();
          const resenas = response.data || response.rows || [];
          console.log('📊 Reseñas cargadas desde API:', resenas.length);
          setResenas(resenas);
        } else {
          console.log('Backend no disponible, usando datos mock...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          setResenas(datosPeliculasEjemplo);
        }
      } catch (err) {
        console.error('Error cargando reseñas:', err);
        setError(handleApiError(err));
        setResenas(datosPeliculasEjemplo);
        setUsingBackend(false);
      } finally {
        setCargando(false);
      }
    };

    cargarResenas();
  }, []);

  const agregarResena = async (nuevaResena) => {
    try {
      if (usingBackend) {
        const response = await reviewsAPI.create(nuevaResena);
        setResenas(prev => [response, ...prev]);
        return response;
      } else {
        const fechaActual = new Date();
        console.log('🔍 DATOS RECIBIDOS DEL FORMULARIO:', nuevaResena);
        
        const resenaConId = { 
          // Propiedades para compatibilidad con backend
          id: Date.now(),
          title: nuevaResena.titulo,
          rating: nuevaResena.calificacion,
          user_name: "usuario_actual",
          created_at: fechaActual.toISOString(),
          body: nuevaResena.textoResena,
          likes: 0,
          year: parseInt(nuevaResena.año) || new Date().getFullYear(),
          poster_url: nuevaResena.imagenUrl || `https://via.placeholder.com/120x180/34495e/ecf0f1?text=${encodeURIComponent(nuevaResena.titulo || 'Pelicula')}`,
          movie_id: Date.now(),
          user_id: 1,
          has_spoilers: nuevaResena.contieneEspoilers || false,
          genre: nuevaResena.genero || '',
          tags: nuevaResena.tags || [],
          yaLeDiLike: false,
          comentarios: [],
          
          // ✅ PROPIEDADES PARA COMPATIBILIDAD CON FRONTEND - ESTAS SON LAS IMPORTANTES
          titulo: nuevaResena.titulo,              // ✅ Para que TarjetaResena encuentre el título
          año: parseInt(nuevaResena.año) || new Date().getFullYear(),
          calificacion: nuevaResena.calificacion,  // ✅ Para que TarjetaResena encuentre la calificación
          usuario: "usuario_actual",               // ✅ Para que TarjetaResena encuentre el usuario
          fechaResena: fechaActual.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          fechaVisionado: nuevaResena.fechaVisionado || fechaActual.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          textoResena: nuevaResena.textoResena,
          imagenUrl: nuevaResena.imagenUrl || `https://via.placeholder.com/120x180/34495e/ecf0f1?text=${encodeURIComponent(nuevaResena.titulo || 'Pelicula')}`,
          megusta: nuevaResena.megusta || false,
          contieneEspoilers: nuevaResena.contieneEspoilers || false,
          genero: nuevaResena.genero || ''
        };
        
        console.log('🔍 DATOS FINALES CREADOS:', resenaConId);
        setResenas(prev => [resenaConId, ...prev]);
        return resenaConId;
      }
    } catch (err) {
      console.error('Error agregando reseña:', err);
      setError(handleApiError(err));
      throw err;
    }
  };

  const actualizarResena = async (id, datosActualizados) => {
    try {
      if (usingBackend) {
        const response = await reviewsAPI.update(id, datosActualizados);
        setResenas(prev => prev.map(resena => 
          resena.id === id ? response : resena
        ));
        return response;
      } else {
        // Usar lógica mock
        setResenas(prev => prev.map(resena => 
          resena.id === id ? { ...resena, ...datosActualizados } : resena
        ));
      }
    } catch (err) {
      console.error('Error actualizando reseña:', err);
      setError(handleApiError(err));
      throw err;
    }
  };

  const eliminarResena = async (id) => {
    try {
      if (usingBackend) {
        await reviewsAPI.delete(id);
      }
      // En ambos casos, remover de la lista local
      setResenas(prev => prev.filter(resena => resena.id !== id));
    } catch (err) {
      console.error('Error eliminando reseña:', err);
      setError(handleApiError(err));
      throw err;
    }
  };

  const toggleLikeResena = (id) => {
    setResenas(prev => prev.map(resena => {
      if (resena.id === id) {
        return {
          ...resena,
          yaLeDiLike: !resena.yaLeDiLike,
          likes: resena.yaLeDiLike ? resena.likes - 1 : resena.likes + 1
        };
      }
      return resena;
    }));
  };

  const agregarComentario = (idResena, comentario) => {
    setResenas(prev => prev.map(resena => {
      if (resena.id === idResena) {
        return {
          ...resena,
          comentarios: [...resena.comentarios, comentario]
        };
      }
      return resena;
    }));
  };

  const eliminarComentario = (idResena, idComentario) => {
    setResenas(prev => prev.map(resena => {
      if (resena.id === idResena) {
        return {
          ...resena,
          comentarios: resena.comentarios.filter(c => c.id !== idComentario)
        };
      }
      return resena;
    }));
  };

  // Función para obtener reseña por ID
  const obtenerResenaPorId = (id) => {
    return resenas.find(resena => resena.id === parseInt(id));
  };

  const obtenerResenasPorPelicula = async (movieId, filtros = {}) => {
    try {
      if (usingBackend) {
        const response = await reviewsAPI.getByMovie(movieId, filtros);
        return response.data || response.rows || [];
      } else {
        return resenas.filter(resena => 
          resena.movie_id === parseInt(movieId) || 
          (resena.titulo && resena.titulo.toLowerCase().includes(movieId.toLowerCase()))
        );
      }
    } catch (err) {
      console.error('Error obteniendo reseñas por película:', err);
      setError(handleApiError(err));
      return [];
    }
  };

  const obtenerResenasPorUsuario = async (userId, filtros = {}) => {
    try {
      if (usingBackend) {
        const response = await reviewsAPI.getByUser(userId, filtros);
        return response.data || response.rows || [];
      } else {
        return resenas.filter(resena => 
          resena.user_id === parseInt(userId) || 
          (resena.usuario && resena.usuario === userId)
        );
      }
    } catch (err) {
      console.error('Error obteniendo reseñas por usuario:', err);
      setError(handleApiError(err));
      return [];
    }
  };

  // Función para aplicar filtros
  const aplicarFiltros = (resenasList, filtros) => {
    let resenasFiltradas = [...resenasList];

    if (filtros.pelicula) {
      resenasFiltradas = resenasFiltradas.filter(resena => {
        const titulo = resena.titulo || resena.title || '';
        return titulo && titulo.toLowerCase().includes(filtros.pelicula.toLowerCase());
      });
    }

    if (filtros.usuario) {
      resenasFiltradas = resenasFiltradas.filter(resena => {
        const usuario = resena.usuario || resena.user_name || '';
        return usuario && usuario.toLowerCase().includes(filtros.usuario.toLowerCase());
      });
    }

    if (filtros.calificacion) {
      const calMin = parseInt(filtros.calificacion);
      resenasFiltradas = resenasFiltradas.filter(resena => {
        const calificacion = resena.calificacion || resena.rating || 0;
        return Number(calificacion) >= calMin;
      });
    }

    if (filtros.genero) {
      resenasFiltradas = resenasFiltradas.filter(resena => resena.genero === filtros.genero);
    }

    if (filtros.tags && filtros.tags.length > 0) {
      resenasFiltradas = resenasFiltradas.filter(resena =>
        resena.tags && filtros.tags.some(tag => resena.tags.includes(tag))
      );
    }

    if (filtros.soloMeGusta) {
      resenasFiltradas = resenasFiltradas.filter(resena => resena.megusta);
    }

    if (!filtros.contieneEspoilers) {
      resenasFiltradas = resenasFiltradas.filter(resena => !resena.contieneEspoilers);
    }

    return resenasFiltradas;
  };

  // Función para aplicar ordenamiento
  const aplicarOrdenamiento = (resenasList, ordenamiento) => {
    const resenasOrdenadas = [...resenasList];
    
    resenasOrdenadas.sort((a, b) => {
      switch (ordenamiento) {
        case 'fecha-desc':
          return new Date(b.fechaResena) - new Date(a.fechaResena);
        case 'fecha-asc':
          return new Date(a.fechaResena) - new Date(b.fechaResena);
        case 'calificacion-desc':
          return b.calificacion - a.calificacion;
        case 'calificacion-asc':
          return a.calificacion - b.calificacion;
        case 'likes-desc':
          return b.likes - a.likes;
        case 'likes-asc':
          return a.likes - b.likes;
        case 'titulo-asc':
          return a.titulo.localeCompare(b.titulo);
        case 'titulo-desc':
          return b.titulo.localeCompare(a.titulo);
        case 'usuario-asc':
          return a.usuario.localeCompare(b.usuario);
        default:
          return 0;
      }
    });

    return resenasOrdenadas;
  };

  // Valor del contexto
  const valor = {
    // Estado
    resenas,
    cargando,
    filtrosActivos,
    ordenamientoActual,
    usingBackend,
    error,
    
    // Setters
    setFiltrosActivos,
    setOrdenamientoActual,
    setError,
    
    // Funciones de reseñas
    agregarResena,
    actualizarResena,
    eliminarResena,
    toggleLikeResena,
    
    // Funciones de comentarios
    agregarComentario,
    eliminarComentario,
    
    // Funciones de búsqueda
    obtenerResenaPorId,
    obtenerResenasPorPelicula,
    obtenerResenasPorUsuario,
    
    // Funciones de filtrado y ordenamiento
    aplicarFiltros,
    aplicarOrdenamiento,
    
    // APIs directas para casos especiales
    reviewsAPI,
    usersAPI,
    moviesAPI
  };

  return (
    <ContextoResenas.Provider value={valor}>
      {children}
    </ContextoResenas.Provider>
  );
};

export default ContextoResenas;
