import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { reviewsAPI, usersAPI, moviesAPI, handleApiError, checkBackendHealth } from '../services/api';
import { useAuth } from './ContextoAuth';

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
    user_name: "Juan Pérez",
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
    usuario: "Juan Pérez",
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
    user_name: "María García",
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
    usuario: "María García",
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
    user_name: "Carlos López",
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
    usuario: "Carlos López",
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
  // ✅ Obtener usuario autenticado desde ContextoAuth
  const { usuario: usuarioAutenticado } = useAuth();
  
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState(() => ({})); // Función inicializadora para referencia estable
  const [ordenamientoActual, setOrdenamientoActual] = useState('fecha-desc');
  
  // ✅ FIX: Inicializar usuario desde localStorage como fallback
  const [usuarioActual, setUsuarioActualState] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    return usuarioGuardado ? parseInt(usuarioGuardado) : 1;
  });
  const [usingBackend, setUsingBackend] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIX: Función wrapper para setUsuarioActual que también guarda en localStorage
  const setUsuarioActual = (userId) => {
    setUsuarioActualState(userId);
    localStorage.setItem('usuarioActual', userId.toString());
    console.log('✅ Usuario actualizado en localStorage:', userId);
  };

  // ✅ Sincronizar usuarioActual cuando cambia el usuario autenticado
  // IMPORTANTE: Usar useRef para evitar loop infinito
  const prevUserIdRef = useRef();
  
  useEffect(() => {
    const currentUserId = usuarioAutenticado?.id;
    
    // Solo actualizar si realmente cambió
    if (currentUserId && currentUserId !== prevUserIdRef.current) {
      console.log('🔄 Sincronizando usuarioActual con usuario autenticado:', currentUserId);
      setUsuarioActualState(currentUserId);
      localStorage.setItem('usuarioActual', currentUserId.toString());
      prevUserIdRef.current = currentUserId;
    }
  }, [usuarioAutenticado?.id]); // ✅ Solo dependencia del ID, no del objeto completo

  useEffect(() => {
    const cargarResenas = async () => {
      setCargando(true);
      setError(null);
      debugger
      try {
        const backendAvailable = await checkBackendHealth();
        setUsingBackend(backendAvailable);
        
        // if (backendAvailable) {
        //   const response = await reviewsAPI.getAll();
        //   const resenas = response.data || response.rows || [];
          
        //   // IMPORTANTE: Solo usar datos reales cuando el backend esté disponible
        //   setResenas(resenas); // Solo datos de la base de datos, NO mock data
        // } else {
        //   await new Promise(resolve => setTimeout(resolve, 1000));
        //   setResenas(datosPeliculasEjemplo);
        // }
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

  // ✅ Nueva función para recargar reseñas desde el backend
  const recargarResenasDesdeBackend = async () => {
    if (!usingBackend) return;
    
    try {
      console.log('🔄 Recargando reseñas desde el backend...');
      const response = await reviewsAPI.getAll();
      console.log('🔍 Respuesta completa del backend:', response);
      
      const resenas = response.data || response.rows || [];
      
      console.log('📊 Datos recibidos del backend:', {
        total: resenas.length,
        peliculasUnicas: new Set(resenas.map(r => r.movie_title || r.titulo)).size,
        usuariosUnicos: new Set(resenas.map(r => r.user_name || r.usuario)).size,
        responseTotal: response.total || 'no especificado'
      });
      
      setResenas(resenas);
      console.log('✅ Reseñas recargadas desde el backend, total:', resenas.length);
      
      // 🚀 NUEVO: También notificar a otros componentes que las reseñas cambiaron
      // Esto forzará que PerfilUsuario y otros componentes recarguen sus datos
      window.dispatchEvent(new CustomEvent('resenasActualizadas', { 
        detail: { total: resenas.length, timestamp: Date.now() } 
      }));
      
    } catch (err) {
      console.error('Error recargando reseñas:', err);
    }
  };

  const agregarResena = async (nuevaResena) => {
    console.log('🔥 agregarResena llamada con:', nuevaResena);
    try {
      if (usingBackend) {
        // Validar datos antes de enviar
        // if (!nuevaResena.titulo || nuevaResena.titulo.trim().length < 5) {
        //   throw new Error(`El título debe tener al menos 5 caracteres: ${nuevaResena.titulo}`);
        // }
        const textoResena = nuevaResena.textoResena || nuevaResena.body || '';
        if (!textoResena || textoResena.trim().length < 20) {
          throw new Error('La reseña debe tener al menos 20 caracteres');
        }
        if (!nuevaResena.calificacion || nuevaResena.calificacion < 1 || nuevaResena.calificacion > 5) {
          throw new Error('La calificación debe estar entre 1 y 5');
        }

        // Obtener movie_id: usar el seleccionado o buscar/crear
        let movieId = 1;
        
        if (nuevaResena.movie_id) {
          // Ya tenemos una película seleccionada
          movieId = nuevaResena.movie_id;
        } else {
          // Buscar película existente por título o crear nueva
          try {
            const existingMovies = await moviesAPI.getAll();
            // Buscar película con título similar
            const tituloLimpio = nuevaResena.titulo.trim().toLowerCase();
            const peliculaExistente = existingMovies.find(movie => 
              (movie.title && movie.title.toLowerCase().includes(tituloLimpio)) ||
              (tituloLimpio.includes(movie.title && movie.title.toLowerCase()))
            );
            
            if (peliculaExistente) {
              movieId = peliculaExistente.id;
            } else {
              // Solo crear nueva si no existe
              const movieData = {
                title: nuevaResena.titulo.trim(),
                year: parseInt(nuevaResena.año) || new Date().getFullYear(),
                genre: nuevaResena.genero || 'drama',
                director: 'Director Desconocido',
                poster_url: nuevaResena.imagenUrl || `https://via.placeholder.com/120x180/34495e/ecf0f1?text=${encodeURIComponent(nuevaResena.titulo)}`,
                description: `Película: ${nuevaResena.titulo}`
              };
              
              const movieResponse = await moviesAPI.create(movieData);
              movieId = movieResponse.id || 1;
            }
          } catch (movieError) {
            movieId = 1;
          }
        }

        // Asegurar que tenemos un movieId válido
        if (!movieId || !Number.isInteger(Number(movieId))) {
          movieId = 1;
        }

        // Convertir datos del frontend al formato del backend
        const datosParaBackend = {
          movie_id: Number(movieId),
          user_id: Number(usuarioActual),
          title: (nuevaResena.tituloResena || nuevaResena.titulo || '').trim(),
          body: (nuevaResena.textoResena || nuevaResena.body || '').trim(),
          rating: Number(nuevaResena.calificacion),
          has_spoilers: Boolean(nuevaResena.contieneEspoilers),
          tags: Array.isArray(nuevaResena.tags) ? nuevaResena.tags : []
        };
        console.log('Datos para backend:', datosParaBackend);
        
        const response = await reviewsAPI.create(datosParaBackend);
        console.log('✅ Reseña creada en backend:', response);
        
        // ✅ FIX: Recargar todas las reseñas desde el backend para asegurar sincronización
        await recargarResenasDesdeBackend();
        
        // ✅ NUEVO: Forzar actualización inmediata con un pequeño delay para asegurar que el backend procese
        setTimeout(async () => {
          console.log('🔄 Segunda recarga para asegurar sincronización');
          await recargarResenasDesdeBackend();
          
          // Forzar re-render de componentes
          window.dispatchEvent(new CustomEvent('forceRerender', { 
            detail: { reason: 'nueva_resena_creada', timestamp: Date.now() } 
          }));
        }, 1000); // Aumentar delay a 1 segundo
        
        return response;
      } else {
        const fechaActual = new Date();
        
        const resenaConId = { 
          // Propiedades para compatibilidad con backend
          id: Date.now(),
          title: nuevaResena.titulo,
          rating: nuevaResena.calificacion,
          user_name: usuarioActual === 1 ? 'Admin' : 
                     usuarioActual === 2 ? 'Juan Pérez' :
                     usuarioActual === 3 ? 'María García' :
                     usuarioActual === 4 ? 'Carlos López' :
                     usuarioActual === 5 ? 'Ana Martín' :
                     usuarioActual === 6 ? 'Luis Rodríguez' : `Usuario ${usuarioActual}`,
          created_at: fechaActual.toISOString(),
          body: nuevaResena.textoResena,
          likes: 0,
          year: parseInt(nuevaResena.año) || new Date().getFullYear(),
          poster_url: nuevaResena.imagenUrl || `https://via.placeholder.com/120x180/34495e/ecf0f1?text=${encodeURIComponent(nuevaResena.titulo || 'Pelicula')}`,
          movie_id: Date.now(),
          user_id: Number(usuarioActual),
          has_spoilers: nuevaResena.contieneEspoilers || false,
          genre: nuevaResena.genero || '',
          tags: nuevaResena.tags || [],
          yaLeDiLike: false,
          comentarios: [],
          
          // ✅ PROPIEDADES PARA COMPATIBILIDAD CON FRONTEND - ESTAS SON LAS IMPORTANTES
          titulo: nuevaResena.titulo,              // ✅ Para que TarjetaResena encuentre el título
          año: parseInt(nuevaResena.año) || new Date().getFullYear(),
          calificacion: nuevaResena.calificacion,  // ✅ Para que TarjetaResena encuentre la calificación
          usuario: usuarioActual === 1 ? 'Admin' : 
                   usuarioActual === 2 ? 'Juan Pérez' :
                   usuarioActual === 3 ? 'María García' :
                   usuarioActual === 4 ? 'Carlos López' :
                   usuarioActual === 5 ? 'Ana Martín' :
                   usuarioActual === 6 ? 'Luis Rodríguez' : `Usuario ${usuarioActual}`,               // ✅ Para que TarjetaResena encuentre el usuario
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
        
        console.log('✅ Reseña creada en modo offline:', resenaConId);
        setResenas(prev => {
          const nuevasResenas = [resenaConId, ...prev];
          console.log('📝 Resenas actualizadas (offline), total:', nuevasResenas.length);
          return nuevasResenas;
        });
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
        // ✅ FIX: Recargar todas las reseñas desde el backend para asegurar sincronización
        await recargarResenasDesdeBackend();
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
        // ✅ FIX: Recargar todas las reseñas desde el backend para asegurar sincronización
        await recargarResenasDesdeBackend();
      } else {
        // En modo local, remover de la lista local
        setResenas(prev => prev.filter(resena => resena.id !== id));
      }
    } catch (err) {
      console.error('Error eliminando reseña:', err);
      setError(handleApiError(err));
      throw err;
    }
  };

  const toggleLikeResena = async (id) => {
    try {
      // Encontrar la reseña para determinar el estado actual
      const resenaIndex = resenas.findIndex(r => r.id === id);
      if (resenaIndex === -1) {
        console.error('Reseña no encontrada');
        return;
      }

      const resena = resenas[resenaIndex];
      const yaLeDiLikeActual = resena.yaLeDiLike || false;
      
      if (usingBackend) {
        if (yaLeDiLikeActual) {
          await reviewsAPI.removeLike(id, usuarioActual);
        } else {
          await reviewsAPI.addLike(id, usuarioActual);
        }
      }
      
      // Actualizar estado local inmediatamente para UX responsiva
      setResenas(prev => prev.map(resena => {
        if (resena.id === id) {
          const likesActuales = Number(resena.likes_count || resena.likes || 0);
          const nuevosLikes = yaLeDiLikeActual ? 
            Math.max(0, likesActuales - 1) : 
            likesActuales + 1;
            
          return {
            ...resena,
            yaLeDiLike: !yaLeDiLikeActual,
            likes: nuevosLikes,
            likes_count: nuevosLikes
          };
        }
        return resena;
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
      setError(handleApiError(err));
      
      // Revertir cambio en caso de error
      setResenas(prev => prev.map(resena => {
        if (resena.id === id) {
          return {
            ...resena,
            yaLeDiLike: resena.yaLeDiLike, // Mantener estado original
            likes: resena.likes,
            likes_count: resena.likes_count
          };
        }
        return resena;
      }));
    }
  };

  const agregarComentario = async (idResena, comentario) => {
    try {
      if (usingBackend) {
        const nuevoComentario = await reviewsAPI.addComment(idResena, usuarioActual, comentario);
        
        // Actualizar estado local con el comentario del backend
        setResenas(prev => prev.map(resena => {
          if (resena.id === idResena) {
            return {
              ...resena,
              comentarios: [...(resena.comentarios || []), nuevoComentario]
            };
          }
          return resena;
        }));
      } else {
        // Modo local
        const comentarioLocal = {
          id: Date.now(),
          usuario: usuarioActual === 1 ? 'Admin' : 
                   usuarioActual === 2 ? 'Juan Pérez' :
                   usuarioActual === 3 ? 'María García' :
                   usuarioActual === 4 ? 'Carlos López' : `Usuario ${usuarioActual}`,
          texto: comentario,
          fecha: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
        
        setResenas(prev => prev.map(resena => {
          if (resena.id === idResena) {
            return {
              ...resena,
              comentarios: [...(resena.comentarios || []), comentarioLocal]
            };
          }
          return resena;
        }));
      }
    } catch (err) {
      console.error('Error agregando comentario:', err);
      setError(handleApiError(err));
      throw err;
    }
  };

  const eliminarComentario = async (idResena, idComentario) => {
    try {
      if (usingBackend) {
        await reviewsAPI.deleteComment(idComentario, usuarioActual);
      }
      
      // Actualizar estado local
      setResenas(prev => prev.map(resena => {
        if (resena.id === idResena) {
          return {
            ...resena,
            comentarios: (resena.comentarios || []).filter(c => c.id !== idComentario)
          };
        }
        return resena;
      }));
    } catch (err) {
      console.error('Error eliminando comentario:', err);
      setError(handleApiError(err));
      throw err;
    }
  };

  // Función para obtener reseña por ID
  const obtenerResenaPorId = (id) => {
    const idNumerico = parseInt(id);
    console.log('🔍 obtenerResenaPorId:');
    console.log('  - ID buscado:', id, '(convertido a:', idNumerico, ')');
    console.log('  - Total de reseñas:', resenas.length);
    console.log('  - IDs disponibles:', resenas.map(r => r.id));
    
    const resenaEncontrada = resenas.find(resena => resena.id === idNumerico);
    console.log('  - Reseña encontrada:', resenaEncontrada);
    
    return resenaEncontrada;
  };

  const obtenerResenasPorPelicula = async (movieId, filtros = {}) => {
    try {
      if (usingBackend) {
        // Si tu reviewsAPI tiene un método getAll, úsalo con filtro
        const response = await reviewsAPI.getAll({ movie_id: movieId, ...filtros });
        // Si tu backend filtra correctamente, esto es suficiente
        return response.data || response.rows || [];
      } else {
        // FILTRAR SOLO POR movie_id (no por título)
        return resenas.filter(resena => 
          String(resena.movie_id) === String(movieId)
        );
      }
    } catch (err) {
      console.error('Error obteniendo reseñas por película:', err);
      setError(handleApiError(err));
      return [];
    }
  };

  /* const obtenerResenasPorPelicula = async (movieId, filtros = {}) => {
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
  }; */

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

  // Función para aplicar filtros (usa backend cuando es necesario)
  const aplicarFiltros = async (filtros = {}) => {
    try {
      if (usingBackend && (filtros.genero || filtros.calificacion || filtros.usuario || filtros.pelicula || filtros.tags?.length > 0 || filtros.fechaPublicacion)) {
        // Usar backend para filtros complejos
        const filtrosBackend = {};
        
        if (filtros.genero) filtrosBackend.genre = filtros.genero;
        if (filtros.calificacion) filtrosBackend.min_rating = parseInt(filtros.calificacion);
        if (filtros.contieneEspoilers !== undefined) filtrosBackend.has_spoilers = filtros.contieneEspoilers;
        if (filtros.fechaPublicacion) filtrosBackend.date_range = filtros.fechaPublicacion;
        if (filtros.tags && filtros.tags.length > 0) filtrosBackend.tags = JSON.stringify(filtros.tags);
        
        const response = await reviewsAPI.filter(filtrosBackend);
        let resenasFiltradas = response.data || response.rows || [];
        
        // Aplicar filtros adicionales que el backend no maneja directamente
        if (filtros.pelicula) {
          resenasFiltradas = resenasFiltradas.filter(resena => {
            const titulo = resena.movie_title || resena.titulo || resena.title || '';
            return titulo.toLowerCase().startsWith(filtros.pelicula.toLowerCase());
          });
        }

        if (filtros.usuario) {
          resenasFiltradas = resenasFiltradas.filter(resena => {
            const usuario = resena.user_name || resena.usuario || '';
            return usuario && usuario.toLowerCase().startsWith(filtros.usuario.toLowerCase());
          });
        }

        if (filtros.soloMeGusta) {
          resenasFiltradas = resenasFiltradas.filter(resena => resena.megusta);
        }

        // Corregir filtro de spoilers
        if (!filtros.contieneEspoilers) {
          resenasFiltradas = resenasFiltradas.filter(resena => !resena.has_spoilers);
        }
        
        return resenasFiltradas;
      } else {
        // Usar filtrado local para casos simples o cuando backend no está disponible
        return aplicarFiltrosLocal(resenas, filtros);
      }
    } catch (err) {
      console.error('Error aplicando filtros:', err);
      return aplicarFiltrosLocal(resenas, filtros);
    }
  };

  // Función para aplicar filtros localmente (original)
  const aplicarFiltrosLocal = (resenasList, filtros) => {
    // Validar que resenasList sea un array
    if (!Array.isArray(resenasList)) {
      console.warn('aplicarFiltrosLocal: resenasList no es un array:', resenasList);
      return [];
    }
    
    let resenasFiltradas = [...resenasList];

    if (filtros.pelicula) {
      resenasFiltradas = resenasFiltradas.filter(resena => {
        //const titulo = resena.titulo || resena.title || '';
        const titulo = resena.movie_title || resena.titulo || resena.title || '';
        //return titulo && titulo.toLowerCase().includes(filtros.pelicula.toLowerCase());
        return titulo.toLowerCase().startsWith(filtros.pelicula.toLowerCase());
      });
    }

    if (filtros.usuario) {
      resenasFiltradas = resenasFiltradas.filter(resena => {
        //const usuario = resena.usuario || resena.user_name || '';
        const usuario = resena.user_name || resena.usuario || '';
        //return usuario && usuario.toLowerCase() === filtros.usuario.toLowerCase();
        return usuario && usuario.toLowerCase().startsWith(filtros.usuario.toLowerCase());
        //return usuario && usuario.toLowerCase().includes(filtros.usuario.toLowerCase());
      });
    }

    if (filtros.calificacion) {
      const calExacta = parseInt(filtros.calificacion);
      resenasFiltradas = resenasFiltradas.filter(resena => {
        const calificacion = resena.calificacion || resena.rating || 0;
        //return Number(calificacion) >= calMin;
        return Number(calificacion) === calExacta
      });
    }

    if (filtros.genero) {
      resenasFiltradas = resenasFiltradas.filter(resena => {
        const genero = resena.movie_genre || resena.genero || resena.genre || '';
        return genero === filtros.genero;
      });
    }
    

    if (filtros.tags && filtros.tags.length > 0) {
      resenasFiltradas = resenasFiltradas.filter(resena =>
        resena.tags && filtros.tags.some(tag => resena.tags.includes(tag))
      );
    }

    if (filtros.soloMeGusta) {
      resenasFiltradas = resenasFiltradas.filter(resena => resena.megusta);
    }

    // Filtro por fecha de publicación
    if (filtros.fechaPublicacion) {
      const now = new Date();
      let startDate;
      
      switch (filtros.fechaPublicacion) {
        case 'hoy':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'esta-semana':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'este-mes':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'este-año':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        resenasFiltradas = resenasFiltradas.filter(resena => {
          const fechaResena = new Date(resena.created_at || resena.fechaResena);
          return fechaResena >= startDate;
        });
      }
    }

    if (!filtros.contieneEspoilers) {
      resenasFiltradas = resenasFiltradas.filter(resena => !resena.has_spoilers && !resena.contieneEspoilers);
    }

    return resenasFiltradas;
  };

  // Función para aplicar ordenamiento
  const aplicarOrdenamiento = (resenasList, ordenamiento) => {
    // Validar que resenasList sea un array
    if (!Array.isArray(resenasList)) {
      console.warn('aplicarOrdenamiento: resenasList no es un array:', resenasList);
      return [];
    }
    
    const resenasOrdenadas = [...resenasList];
    
    resenasOrdenadas.sort((a, b) => {
      switch (ordenamiento) {
        case 'fecha-desc':
          const fechaA = new Date(a.created_at || a.fechaResena || 0);
          const fechaB = new Date(b.created_at || b.fechaResena || 0);
          return fechaB - fechaA;
        case 'fecha-asc':
          const fechaAsc_A = new Date(a.created_at || a.fechaResena || 0);
          const fechaAsc_B = new Date(b.created_at || b.fechaResena || 0);
          return fechaAsc_A - fechaAsc_B;
        case 'calificacion-desc':
          return (b.rating || b.calificacion || 0) - (a.rating || a.calificacion || 0);
        case 'calificacion-asc':
          return (a.rating || a.calificacion || 0) - (b.rating || b.calificacion || 0);
        case 'likes-desc':
          return (b.likes_count || b.likes || 0) - (a.likes_count || a.likes || 0);
        case 'likes-asc':
          return (a.likes_count || a.likes || 0) - (b.likes_count || b.likes || 0);
        case 'titulo-asc':
          const tituloA = a.movie_title || a.titulo || a.title || '';
          const tituloB = b.movie_title || b.titulo || b.title || '';
          return tituloA.localeCompare(tituloB);
        case 'titulo-desc':
          const tituloDescA = a.movie_title || a.titulo || a.title || '';
          const tituloDescB = b.movie_title || b.titulo || b.title || '';
          return tituloDescB.localeCompare(tituloDescA);
        case 'usuario-asc':
          const usuarioA = a.user_name || a.usuario || '';
          const usuarioB = b.user_name || b.usuario || '';
          return usuarioA.localeCompare(usuarioB);
        default:
          return 0;
      }
    });

    return resenasOrdenadas;
  };

  // ✅ Función para obtener nombre de usuario por ID
  const obtenerNombreUsuario = (userId) => {
    const nombres = {
      1: 'Admin',
      2: 'Juan Pérez', 
      3: 'María García',
      4: 'Carlos López',
      5: 'Ana Martín',
      6: 'Luis Rodríguez'
    };
    return nombres[userId] || `Usuario ${userId}`;
  };

  // ✅ FIX DEFINITIVO: Crear un objeto de valor estable que solo cambie cuando sea absolutamente necesario
  // Usamos useRef para mantener las funciones actualizadas sin causar re-renders
  const funcionesRef = useRef({});
  
  // Actualizar el ref con las funciones actuales (no causa re-render)
  funcionesRef.current = {
    agregarResena,
    actualizarResena,
    eliminarResena,
    toggleLikeResena,
    recargarResenasDesdeBackend,
    agregarComentario,
    eliminarComentario,
    obtenerResenaPorId,
    obtenerResenasPorPelicula,
    obtenerResenasPorUsuario,
    obtenerNombreUsuario,
    aplicarFiltros,
    aplicarOrdenamiento,
  };
  
  // Crear funciones estables que deleguen al ref
  const funcionesEstables = useMemo(() => ({
    agregarResena: (...args) => funcionesRef.current.agregarResena(...args),
    actualizarResena: (...args) => funcionesRef.current.actualizarResena(...args),
    eliminarResena: (...args) => funcionesRef.current.eliminarResena(...args),
    toggleLikeResena: (...args) => funcionesRef.current.toggleLikeResena(...args),
    recargarResenasDesdeBackend: (...args) => funcionesRef.current.recargarResenasDesdeBackend(...args),
    agregarComentario: (...args) => funcionesRef.current.agregarComentario(...args),
    eliminarComentario: (...args) => funcionesRef.current.eliminarComentario(...args),
    obtenerResenaPorId: (...args) => funcionesRef.current.obtenerResenaPorId(...args),
    obtenerResenasPorPelicula: (...args) => funcionesRef.current.obtenerResenasPorPelicula(...args),
    obtenerResenasPorUsuario: (...args) => funcionesRef.current.obtenerResenasPorUsuario(...args),
    obtenerNombreUsuario: (...args) => funcionesRef.current.obtenerNombreUsuario(...args),
    aplicarFiltros: (...args) => funcionesRef.current.aplicarFiltros(...args),
    aplicarOrdenamiento: (...args) => funcionesRef.current.aplicarOrdenamiento(...args),
  }), []); // ✅ Array vacío = se crea una sola vez

  // ✅ FIX: Memorizar el valor del contexto con useMemo
  const valor = useMemo(() => ({
    // Estado
    resenas,
    cargando,
    filtrosActivos,
    ordenamientoActual,
    usuarioActual,
    usingBackend,
    error,
    
    // Setters (estos son estables de por sí por ser de useState)
    setFiltrosActivos,
    setOrdenamientoActual,
    setUsuarioActual,
    setError,
    
    // Funciones estables (se crean una sola vez)
    ...funcionesEstables,
    
    // APIs directas para casos especiales
    reviewsAPI,
    usersAPI,
    moviesAPI
  }), [
    // Solo incluir valores primitivos que realmente necesitan causar re-render
    resenas, // Incluye el array completo para cumplir con la regla
    cargando,
    filtrosActivos,
    ordenamientoActual,
    usuarioActual,
    usingBackend,
    error,
    funcionesEstables, // ✅ Objeto estable de funciones
  ]);

  // 🔍 DEBUG: Log para ver renders del Provider (reducido)
  useEffect(() => {
    console.log('🔄 ContextoResenas Provider valor actualizado:', {
      resenasLength: resenas.length,
      cargando,
      usuarioActual,
      usingBackend
    });
  }, [resenas.length, cargando, usuarioActual, usingBackend]);

  return (
    <ContextoResenas.Provider value={valor}>
      {children}
    </ContextoResenas.Provider>
  );
};

export default ContextoResenas;
