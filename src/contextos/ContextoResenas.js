import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Datos de ejemplo para las reseñas
const datosPeliculasEjemplo = [
  {
    id: 1,
    titulo: "El Padrino",
    año: 1972,
    imagenUrl: "https://via.placeholder.com/120x180/2C3E50/ECF0F1?text=El+Padrino",
    calificacion: 5,
    usuario: "usuario_actual",
    fechaResena: "15 de marzo, 2024",
    fechaVisionado: "10 de marzo, 2024",
    textoResena: "Una obra maestra absoluta del cine. La narrativa de Coppola es impecable, combinando drama familiar con elementos del crimen de manera magistral. Cada escena está cuidadosamente construida, y las actuaciones de Brando y Pacino son legendarias. Es imposible no quedar cautivado por la complejidad de los personajes y la profundidad de la historia.",
    megusta: true,
    likes: 24,
    yaLeDiLike: true,
    comentarios: [
      { id: 1, usuario: "otro_usuario", texto: "Totalmente de acuerdo, es una obra maestra", fecha: "16 de marzo, 2024" }
    ],
    tags: ["Obra Maestra", "Drama", "Spoiler Free"],
    contieneEspoilers: false,
    genero: "drama"
  },
  {
    id: 2,
    titulo: "Blade Runner 2049",
    año: 2017,
    imagenUrl: "https://via.placeholder.com/120x180/E74C3C/ECF0F1?text=Blade+Runner",
    calificacion: 4.5,
    usuario: "scifi_lover",
    fechaResena: "12 de marzo, 2024",
    fechaVisionado: "8 de marzo, 2024",
    textoResena: "Denis Villeneuve logra crear una secuela que honra al original mientras construye algo completamente nuevo. La cinematografía es deslumbrante, el diseño de sonido es excepcional, y Ryan Gosling ofrece una actuación muy matizada. Una reflexión profunda sobre la humanidad y la identidad en un futuro distópico.",
    megusta: true,
    likes: 18,
    yaLeDiLike: false,
    comentarios: [],
    tags: ["Ciencia Ficción", "Spoiler Free"],
    contieneEspoilers: false,
    genero: "ciencia-ficcion"
  },
  {
    id: 3,
    titulo: "Parasite",
    año: 2019,
    imagenUrl: "https://via.placeholder.com/120x180/1ABC9C/ECF0F1?text=Parasite",
    calificacion: 4.8,
    usuario: "cinema_critic",
    fechaResena: "10 de marzo, 2024",
    fechaVisionado: "5 de marzo, 2024",
    textoResena: "Bong Joon-ho presenta una crítica social brillante envuelta en un thriller impredecible. La película funciona en múltiples niveles: como comedia negra, thriller psicológico y comentario social. Cada detalle visual tiene un propósito, y la forma en que construye la tensión es magistral.",
    megusta: false,
    likes: 31,
    yaLeDiLike: true,
    comentarios: [
      { id: 1, usuario: "usuario_actual", texto: "Increíble análisis!", fecha: "11 de marzo, 2024" },
      { id: 2, usuario: "otro_fan", texto: "Una de las mejores del año", fecha: "12 de marzo, 2024" }
    ],
    tags: ["Thriller", "Obra Maestra"],
    contieneEspoilers: false,
    genero: "thriller"
  },
  {
    id: 4,
    titulo: "Mad Max: Fury Road",
    año: 2015,
    imagenUrl: "https://via.placeholder.com/120x180/F39C12/ECF0F1?text=Mad+Max",
    calificacion: 4.2,
    usuario: "action_fan",
    fechaResena: "8 de marzo, 2024",
    fechaVisionado: "3 de marzo, 2024",
    textoResena: "George Miller demuestra que las películas de acción pueden ser arte. Cada secuencia de acción está coreografiada con precisión cinematográfica. Charlize Theron y Tom Hardy tienen una química fantástica, y la película logra contar una historia completa con diálogo mínimo pero impacto máximo.",
    megusta: true,
    likes: 12,
    yaLeDiLike: false,
    comentarios: [],
    tags: ["Acción", "Spoiler Free"],
    contieneEspoilers: false,
    genero: "accion"
  },
  {
    id: 5,
    titulo: "Her",
    año: 2013,
    imagenUrl: "https://via.placeholder.com/120x180/9B59B6/ECF0F1?text=Her",
    calificacion: 4.3,
    usuario: "usuario_actual",
    fechaResena: "5 de marzo, 2024",
    fechaVisionado: "1 de marzo, 2024",
    textoResena: "Spike Jonze crea una historia de amor única y profundamente humana sobre la conexión en la era digital. Joaquin Phoenix ofrece una actuación vulnerable y auténtica. La película plantea preguntas fascinantes sobre la naturaleza del amor y la intimidad en un futuro no tan lejano.",
    megusta: false,
    likes: 8,
    yaLeDiLike: false,
    comentarios: [],
    tags: ["Romance", "Drama"],
    contieneEspoilers: false,
    genero: "romance"
  }
];

// Proveedor del contexto
export const ProveedorResenas = ({ children }) => {
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [ordenamientoActual, setOrdenamientoActual] = useState('fecha-desc');

  // Cargar datos iniciales
  useEffect(() => {
    const cargarResenas = async () => {
      setCargando(true);
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResenas(datosPeliculasEjemplo);
      setCargando(false);
    };

    cargarResenas();
  }, []);

  // Funciones para manejar reseñas
  const agregarResena = (nuevaResena) => {
    setResenas(prev => [nuevaResena, ...prev]);
  };

  const actualizarResena = (id, datosActualizados) => {
    setResenas(prev => prev.map(resena => 
      resena.id === id ? { ...resena, ...datosActualizados } : resena
    ));
  };

  const eliminarResena = (id) => {
    setResenas(prev => prev.filter(resena => resena.id !== id));
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

  // Función para obtener reseñas por película
  const obtenerResenasPorPelicula = (titulo) => {
    return resenas.filter(resena => 
      resena.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  };

  // Función para obtener reseñas por usuario
  const obtenerResenasPorUsuario = (usuario) => {
    return resenas.filter(resena => resena.usuario === usuario);
  };

  // Función para aplicar filtros
  const aplicarFiltros = (resenasList, filtros) => {
    let resenasFiltradas = [...resenasList];

    if (filtros.pelicula) {
      resenasFiltradas = resenasFiltradas.filter(resena =>
        resena.titulo.toLowerCase().includes(filtros.pelicula.toLowerCase())
      );
    }

    if (filtros.usuario) {
      resenasFiltradas = resenasFiltradas.filter(resena =>
        resena.usuario.toLowerCase().includes(filtros.usuario.toLowerCase())
      );
    }

    if (filtros.calificacion) {
      const calMin = parseInt(filtros.calificacion);
      resenasFiltradas = resenasFiltradas.filter(resena => resena.calificacion >= calMin);
    }

    if (filtros.genero) {
      resenasFiltradas = resenasFiltradas.filter(resena => resena.genero === filtros.genero);
    }

    if (filtros.tags && filtros.tags.length > 0) {
      resenasFiltradas = resenasFiltradas.filter(resena =>
        filtros.tags.some(tag => resena.tags.includes(tag))
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
    
    // Setters
    setFiltrosActivos,
    setOrdenamientoActual,
    
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
    aplicarOrdenamiento
  };

  return (
    <ContextoResenas.Provider value={valor}>
      {children}
    </ContextoResenas.Provider>
  );
};

export default ContextoResenas;
