// context/ContextoResenas.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  reviewsAPI,
  usersAPI,
  moviesAPI,
  handleApiError,
  checkBackendHealth,
} from "../services/api";
import { useAuth } from "./ContextoAuth";

const ContextoResenas = createContext();

export const useResenas = () => {
  const ctx = useContext(ContextoResenas);
  if (!ctx)
    throw new Error("useResenas debe ser usado dentro de un ProveedorResenas");
  return ctx;
};

// Mock local (fallback)
const datosPeliculasEjemplo = [
  /* … (dejá tu array tal cual) … */
];

export const ProveedorResenas = ({ children }) => {
  const { usuario: usuarioAutenticado } = useAuth();

  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState(() => ({}));
  const [ordenamientoActual, setOrdenamientoActual] = useState("fecha-desc");
  const [usuarioActual, setUsuarioActualState] = useState(() => {
    const g = localStorage.getItem("usuarioActual");
    return g ? parseInt(g) : 1;
  });
  const [usingBackend, setUsingBackend] = useState(false);
  const [error, setError] = useState(null);

  const setUsuarioActual = (userId) => {
    setUsuarioActualState(userId);
    localStorage.setItem("usuarioActual", String(userId));
  };

  // sincr. con auth
  const prevUserIdRef = useRef();
  useEffect(() => {
    const currentUserId = usuarioAutenticado?.user_id || usuarioAutenticado?.id;
    if (currentUserId && currentUserId !== prevUserIdRef.current) {
      setUsuarioActualState(currentUserId);
      localStorage.setItem("usuarioActual", String(currentUserId));
      prevUserIdRef.current = currentUserId;
    }
  }, [usuarioAutenticado?.user_id, usuarioAutenticado?.id]);

  // cargar reseñas (si el back responde, usar back; si no, mock)
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const ok = await checkBackendHealth(); // /movies
        if (ok) {
          const response = await reviewsAPI.getAll();
          const rows =
            (response && (response.data || response.rows)) || response || [];
          setResenas(Array.isArray(rows) ? rows : []);
          setUsingBackend(true);
        } else {
          setResenas(datosPeliculasEjemplo);
          setUsingBackend(false);
        }
      } catch (err) {
        setError(handleApiError(err));
        setResenas(datosPeliculasEjemplo);
        setUsingBackend(false);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const recargarResenasDesdeBackend = async () => {
    if (!usingBackend) return;
    try {
      const response = await reviewsAPI.getAll();
      const rows =
        (response && (response.data || response.rows)) || response || [];
      setResenas(Array.isArray(rows) ? rows : []);
      window.dispatchEvent(
        new CustomEvent("resenasActualizadas", {
          detail: { total: rows.length, timestamp: Date.now() },
        })
      );
    } catch (err) {
      console.error("Error recargando reseñas:", err);
    }
  };

  const agregarResena = async (nuevaResena) => {
    try {
      if (usingBackend) {
        const texto = nuevaResena.textoResena || nuevaResena.body || "";
        if (!texto || texto.trim().length < 20)
          throw new Error("La reseña debe tener al menos 20 caracteres");
        
        // ✅ FIX: Validar calificación solo si existe y está fuera de rango
        if (nuevaResena.calificacion !== undefined && nuevaResena.calificacion !== null) {
          const rating = Number(nuevaResena.calificacion);
          if (rating < 0 || rating > 5) {
            throw new Error("La calificación debe estar entre 0 y 5");
          }
        }

        // movie_id (requerido). Si no vino, intento matchear por título; si no, fallback 1
        let movieId = 1;
        if (nuevaResena.movie_id) {
          movieId = nuevaResena.movie_id;
        } else {
          try {
            const movies = await moviesAPI.getAll();
            const t = (nuevaResena.titulo || "").trim().toLowerCase();
            const found = Array.isArray(movies)
              ? movies.find((m) => (m.title || "").toLowerCase().includes(t))
              : null;
            if (found?.id) movieId = found.id;
          } catch {
            movieId = 1;
          }
        }
        if (!movieId || !Number.isInteger(Number(movieId))) movieId = 1;

        const payload = {
          movie_id: Number(movieId),
          user_id: Number(usuarioActual),
          title: (nuevaResena.tituloResena || nuevaResena.titulo || "").trim(),
          body: texto.trim(),
          rating: Number(nuevaResena.calificacion || 0),
          has_spoilers: Boolean(nuevaResena.contieneEspoilers),
          tags: Array.isArray(nuevaResena.tags) ? nuevaResena.tags : [],
        };

        await reviewsAPI.create(payload);
        await recargarResenasDesdeBackend();

        setTimeout(recargarResenasDesdeBackend, 1000);
        return true;
      } else {
        // Modo local
        const fecha = new Date();
        const mock = {
          id: Date.now(),
          title: nuevaResena.titulo,
          rating: nuevaResena.calificacion,
          user_name: `Usuario ${usuarioActual}`,
          created_at: fecha.toISOString(),
          body: nuevaResena.textoResena,
          likes: 0,
          year: parseInt(nuevaResena.año) || new Date().getFullYear(),
          poster_url:
            nuevaResena.imagenUrl ||
            `https://via.placeholder.com/120x180/34495e/ecf0f1?text=${encodeURIComponent(
              nuevaResena.titulo || "Pelicula"
            )}`,
          movie_id: Date.now(),
          user_id: Number(usuarioActual),
          has_spoilers: nuevaResena.contieneEspoilers || false,
          genre: nuevaResena.genero || "",
          tags: nuevaResena.tags || [],
          yaLeDiLike: false,
          comentarios: [],
          // compat UI
          titulo: nuevaResena.titulo,
          año: parseInt(nuevaResena.año) || new Date().getFullYear(),
          calificacion: nuevaResena.calificacion,
          usuario: `Usuario ${usuarioActual}`,
          fechaResena: fecha.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          fechaVisionado:
            nuevaResena.fechaVisionado ||
            fecha.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          textoResena: nuevaResena.textoResena,
          imagenUrl:
            nuevaResena.imagenUrl ||
            `https://via.placeholder.com/120x180/34495e/ecf0f1?text=${encodeURIComponent(
              nuevaResena.titulo || "Pelicula"
            )}`,
          megusta: nuevaResena.megusta || false,
          contieneEspoilers: nuevaResena.contieneEspoilers || false,
          genero: nuevaResena.genero || "",
        };

        setResenas((prev) => [mock, ...prev]);
        return mock;
      }
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  const actualizarResena = async (id, datosActualizados) => {
    try {
      if (usingBackend) {
        await reviewsAPI.update(id, datosActualizados);
        await recargarResenasDesdeBackend();
      } else {
        setResenas((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...datosActualizados } : r))
        );
      }
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  const eliminarResena = async (id) => {
    try {
      if (usingBackend) {
        await reviewsAPI.delete(id); // 204
        await recargarResenasDesdeBackend();
      } else {
        setResenas((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  // Likes y comentarios: NO hay endpoints → solo local
  const toggleLikeResena = async (id) => {
    try {
      setResenas((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const liked = !!r.yaLeDiLike;
          const curr = Number(r.likes_count || r.likes || 0);
          const next = liked ? Math.max(0, curr - 1) : curr + 1;
          return { ...r, yaLeDiLike: !liked, likes: next, likes_count: next };
        })
      );
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const agregarComentario = async (idResena, comentario) => {
    try {
      const comentarioLocal = {
        id: Date.now(),
        usuario: `Usuario ${usuarioActual}`,
        texto: comentario,
        fecha: new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
      setResenas((prev) =>
        prev.map((r) =>
          r.id === idResena
            ? { ...r, comentarios: [...(r.comentarios || []), comentarioLocal] }
            : r
        )
      );
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  const eliminarComentario = async (idResena, idComentario) => {
    try {
      setResenas((prev) =>
        prev.map((r) =>
          r.id === idResena
            ? {
                ...r,
                comentarios: (r.comentarios || []).filter(
                  (c) => c.id !== idComentario
                ),
              }
            : r
        )
      );
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  const obtenerResenaPorId = (id) => {
    const nid = Number(id);
    return resenas.find((r) => r.id === nid);
  };

  const obtenerResenasPorPelicula = async (movieId, filtros = {}) => {
    try {
      if (usingBackend) {
        // 1) si es numérico, usarlo directo
        const idNum = Number(movieId);
        if (Number.isInteger(idNum) && idNum > 0) {
          const response = await reviewsAPI.getAll({
            movie_id: idNum,
            ...filtros,
          });
          return response?.data || response?.rows || response || [];
        }

        // 2) si NO es numérico, intentar resolverlo por búsqueda de título
        const term = String(movieId || "").trim();
        if (term) {
          const movies = await moviesAPI.search(term);
          const firstId =
            (Array.isArray(movies) && movies[0]?.id) ||
            (movies?.data &&
              Array.isArray(movies.data) &&
              movies.data[0]?.id) ||
            null;
          if (firstId) {
            const response = await reviewsAPI.getAll({
              movie_id: Number(firstId),
              ...filtros,
            });
            return response?.data || response?.rows || response || [];
          }
        }
        // 3) no se pudo resolver → sin request inválido
        return [];
      }
      // modo local
      return resenas.filter((r) => String(r.movie_id) === String(movieId));
    } catch (err) {
      console.error("Error obteniendo reseñas por película:", err);
      setError(handleApiError(err));
      return [];
    }
  };

  const obtenerResenasPorUsuario = async (userId, filtros = {}) => {
    try {
      if (usingBackend) {
        const resp = await reviewsAPI.getByUser(userId, filtros);
        return resp.data || resp.rows || resp || [];
      }
      return resenas.filter((r) => r.user_id === Number(userId));
    } catch (err) {
      setError(handleApiError(err));
      return [];
    }
  };

  const aplicarFiltros = async (filtros = {}) => {
    try {
      if (usingBackend /* && (filtros.genero || filtros.calificacion || filtros.usuario || filtros.pelicula || filtros.tags?.length > 0 || filtros.fechaPublicacion) */) {
        // Usar backend para filtros complejos
        const filtrosBackend = {};
        if (filtros.genero) filtrosBackend.genre = filtros.genero;
        if (filtros.calificacion)
          filtrosBackend.min_rating = parseInt(filtros.calificacion);
        if (filtros.contieneEspoilers !== undefined)
          filtrosBackend.has_spoilers = filtros.contieneEspoilers;
        if (filtros.fechaPublicacion)
          filtrosBackend.date_range = filtros.fechaPublicacion;
        if (Array.isArray(filtros.tags) && filtros.tags.length > 0)
          filtrosBackend.tags = JSON.stringify(filtros.tags);

        const resp = await reviewsAPI.filter(filtrosBackend);
        let rows = resp.data || resp.rows || resp || [];

        if (filtros.pelicula) {
          rows = rows.filter((r) => {
            const t = r.movie_title || r.titulo || r.title || "";
            return t.toLowerCase().startsWith(filtros.pelicula.toLowerCase());
          });
        }
        if (filtros.usuario) {
          rows = rows.filter((r) => {
            const u = r.user_name || r.usuario || "";
            return (
              u && u.toLowerCase().startsWith(filtros.usuario.toLowerCase())
            );
          });
        }
        if (!filtros.contieneEspoilers)
          rows = rows.filter((r) => !r.has_spoilers);

        return rows;
      }
      // local
      return aplicarFiltrosLocal(resenas, filtros);
    } catch (err) {
      return aplicarFiltrosLocal(resenas, filtros);
    }
  };

  const aplicarFiltrosLocal = (list, filtros) => {
    if (!Array.isArray(list)) return [];
    let rows = [...list];

    if (filtros.pelicula) {
      rows = rows.filter((r) => {
        const t = r.movie_title || r.titulo || r.title || "";
        return t.toLowerCase().startsWith(filtros.pelicula.toLowerCase());
      });
    }
    if (filtros.usuario) {
      rows = rows.filter((r) => {
        const u = r.user_name || r.usuario || "";
        return u && u.toLowerCase().startsWith(filtros.usuario.toLowerCase());
      });
    }
    if (filtros.calificacion) {
      const exact = Number(filtros.calificacion);
      rows = rows.filter(
        (r) => Number(r.calificacion || r.rating || 0) === exact
      );
    }
    if (filtros.genero) {
      rows = rows.filter((r) => {
        const g = r.movie_genre || r.genero || r.genre || "";
        return g === filtros.genero;
      });
    }
    if (Array.isArray(filtros.tags) && filtros.tags.length > 0) {
      rows = rows.filter(
        (r) => r.tags && filtros.tags.some((tag) => r.tags.includes(tag))
      );
    }
    if (filtros.soloMeGusta) {
      rows = rows.filter((r) => r.megusta);
    }
    if (filtros.fechaPublicacion) {
      const now = new Date();
      let start = null;
      switch (filtros.fechaPublicacion) {
        case "hoy":
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "esta-semana":
          start = new Date(now);
          start.setDate(now.getDate() - 7);
          break;
        case "este-mes":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "este-año":
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          start = null;
          break;
      }
      if (start) {
        rows = rows.filter(
          (r) => new Date(r.created_at || r.fechaResena) >= start
        );
      }
    }
    if (!filtros.contieneEspoilers) {
      rows = rows.filter((r) => !r.has_spoilers && !r.contieneEspoilers);
    }
    return rows;
  };

  const aplicarOrdenamiento = (list, orden) => {
    if (!Array.isArray(list)) return [];
    const rows = [...list];

    rows.sort((a, b) => {
      switch (orden) {
        case "fecha-desc":
          return (
            new Date(b.created_at || b.fechaResena || 0) -
            new Date(a.created_at || a.fechaResena || 0)
          );
        case "fecha-asc":
          return (
            new Date(a.created_at || a.fechaResena || 0) -
            new Date(b.created_at || b.fechaResena || 0)
          );
        case "calificacion-desc":
          return (
            (b.rating || b.calificacion || 0) -
            (a.rating || a.calificacion || 0)
          );
        case "calificacion-asc":
          return (
            (a.rating || a.calificacion || 0) -
            (b.rating || b.calificacion || 0)
          );
        case "likes-desc":
          return (
            (b.likes_count || b.likes || 0) - (a.likes_count || a.likes || 0)
          );
        case "likes-asc":
          return (
            (a.likes_count || a.likes || 0) - (b.likes_count || b.likes || 0)
          );
        case "titulo-asc": {
          const ta = a.movie_title || a.titulo || a.title || "";
          const tb = b.movie_title || b.titulo || b.title || "";
          return ta.localeCompare(tb);
        }
        case "titulo-desc": {
          const ta = a.movie_title || a.titulo || a.title || "";
          const tb = b.movie_title || b.titulo || b.title || "";
          return tb.localeCompare(ta);
        }
        case "usuario-asc": {
          const ua = a.user_name || a.usuario || "";
          const ub = b.user_name || b.usuario || "";
          return ua.localeCompare(ub);
        }
        default:
          return 0;
      }
    });
    return rows;
  };

  const obtenerNombreUsuario = (userId) => {
    const nombres = {
      1: "Admin",
      2: "Juan Pérez",
      3: "María García",
      4: "Carlos López",
      5: "Ana Martín",
      6: "Luis Rodríguez",
    };
    return nombres[userId] || `Usuario ${userId}`;
  };

  // refs para funciones estables
  const funcionesRef = useRef({});
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

  const funcionesEstables = useMemo(
    () => ({
      agregarResena: (...a) => funcionesRef.current.agregarResena(...a),
      actualizarResena: (...a) => funcionesRef.current.actualizarResena(...a),
      eliminarResena: (...a) => funcionesRef.current.eliminarResena(...a),
      toggleLikeResena: (...a) => funcionesRef.current.toggleLikeResena(...a),
      recargarResenasDesdeBackend: (...a) =>
        funcionesRef.current.recargarResenasDesdeBackend(...a),
      agregarComentario: (...a) => funcionesRef.current.agregarComentario(...a),
      eliminarComentario: (...a) =>
        funcionesRef.current.eliminarComentario(...a),
      obtenerResenaPorId: (...a) =>
        funcionesRef.current.obtenerResenaPorId(...a),
      obtenerResenasPorPelicula: (...a) =>
        funcionesRef.current.obtenerResenasPorPelicula(...a),
      obtenerResenasPorUsuario: (...a) =>
        funcionesRef.current.obtenerResenasPorUsuario(...a),
      obtenerNombreUsuario: (...a) =>
        funcionesRef.current.obtenerNombreUsuario(...a),
      aplicarFiltros: (...a) => funcionesRef.current.aplicarFiltros(...a),
      aplicarOrdenamiento: (...a) =>
        funcionesRef.current.aplicarOrdenamiento(...a),
    }),
    []
  );

  const valor = useMemo(
    () => ({
      resenas,
      cargando,
      filtrosActivos,
      ordenamientoActual,
      usuarioActual,
      usingBackend,
      error,
      setFiltrosActivos,
      setOrdenamientoActual,
      setUsuarioActual,
      setError,
      ...funcionesEstables,
      reviewsAPI,
      usersAPI,
      moviesAPI,
    }),
    [
      resenas,
      cargando,
      filtrosActivos,
      ordenamientoActual,
      usuarioActual,
      usingBackend,
      error,
      funcionesEstables,
    ]
  );

  return (
    <ContextoResenas.Provider value={valor}>
      {children}
    </ContextoResenas.Provider>
  );
};

export default ContextoResenas;
