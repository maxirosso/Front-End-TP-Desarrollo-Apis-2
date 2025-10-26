import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TarjetaResena from '../TarjetaResena/TarjetaResena';
import FormularioResena from '../FormularioResena/FormularioResena';
import FiltrosResenas from '../FiltrosResenas/FiltrosResenas';
import BarraOrdenamiento from '../BarraOrdenamiento/BarraOrdenamiento';
import ModalComentarios from '../ModalComentarios/ModalComentarios';
import './ListaResenas.css';

const ListaResenas = ({reseñasExternas}) => {
  const navigate = useNavigate();
  const [resenas, setResenas] = useState([]);
  const [resenasFiltradas, setResenasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);
  const [resenaParaEditar, setResenaParaEditar] = useState(null);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [ordenamientoActual, setOrdenamientoActual] = useState('fecha-desc');

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

  // Funciones para manejo de datos
  useEffect(() => {
    // Simular carga de datos
    const cargarResenas = async () => {
      setCargando(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setResenas(reseñasExternas  ?? datosPeliculasEjemplo);
      setCargando(false);
    };
    console.log("Cargando reseñas...");
    cargarResenas();
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let resenasProcesadas = [...resenas];

    // Aplicar filtros
    if (filtrosActivos.pelicula) {
      resenasProcesadas = resenasProcesadas.filter(resena =>
        resena.titulo.toLowerCase().includes(filtrosActivos.pelicula.toLowerCase())
      );
    }

    if (filtrosActivos.usuario) {
      resenasProcesadas = resenasProcesadas.filter(resena =>
        resena.usuario.toLowerCase().includes(filtrosActivos.usuario.toLowerCase())
      );
    }

    if (filtrosActivos.calificacion) {
      const calMin = parseInt(filtrosActivos.calificacion);
      resenasProcesadas = resenasProcesadas.filter(resena => resena.calificacion >= calMin);
    }

    if (filtrosActivos.genero) {
      resenasProcesadas = resenasProcesadas.filter(resena => resena.genero === filtrosActivos.genero);
    }

    if (filtrosActivos.tags && filtrosActivos.tags.length > 0) {
      resenasProcesadas = resenasProcesadas.filter(resena =>
        filtrosActivos.tags.some(tag => resena.tags.includes(tag))
      );
    }

    if (filtrosActivos.soloMeGusta) {
      resenasProcesadas = resenasProcesadas.filter(resena => resena.megusta);
    }

    if (!filtrosActivos.contieneEspoilers) {
      resenasProcesadas = resenasProcesadas.filter(resena => !resena.contieneEspoilers);
    }

    // Aplicar ordenamiento
    resenasProcesadas.sort((a, b) => {
      switch (ordenamientoActual) {
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

    setResenasFiltradas(resenasProcesadas);
  }, [resenas, filtrosActivos, ordenamientoActual]);

  // Funciones de manejo de eventos
  const manejarCrearResena = (nuevaResena) => {
    setResenas(prev => [nuevaResena, ...prev]);
  };

  const manejarEliminarResena = (id) => {
    setResenas(prev => prev.filter(resena => resena.id !== id));
  };

  const manejarEditarResena = (resenaParaEditar) => {
    navigate(`/crear-resena/${resenaParaEditar.id}?editar=true`);
  };

  const manejarToggleLike = (id) => {
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

  const manejarAbrirComentarios = (id) => {
    const resena = resenas.find(r => r.id === id);
    setResenaSeleccionada(resena);
    setMostrarComentarios(true);
  };

  const manejarAplicarFiltros = (filtros) => {
    setFiltrosActivos(filtros);
  };

  const manejarLimpiarFiltros = () => {
    setFiltrosActivos({});
  };

  const manejarCambiarOrdenamiento = (ordenamiento) => {
    setOrdenamientoActual(ordenamiento);
  };

  if (cargando) {
    console.log("Cargando reseñas...");
    return (
      <div className="contenedor-cargando">
        <div className="spinner-carga">
          <div className="punto-carga"></div>
          <div className="punto-carga"></div>
          <div className="punto-carga"></div>
        </div>
        <p>Cargando reseñas...</p>
      </div>
    );
  }

  return (
    <section className="lista-resenas">
      <div className="estadisticas-resenas">
        <h2 className="titulo-estadisticas">Reseñas y Calificaciones</h2>
        <p className="descripcion-estadisticas">
          Descubre, crea y comparte opiniones sobre películas
        </p>
        <div className="controles-principales">
          <button 
            className="boton-crear-resena"
            onClick={() => setMostrarFormulario(true)}
          >
            ✏️ Escribir nueva reseña
          </button>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosResenas
        onAplicarFiltros={manejarAplicarFiltros}
        filtrosActivos={filtrosActivos}
        onLimpiarFiltros={manejarLimpiarFiltros}
      />

      {/* Barra de ordenamiento */}
      <BarraOrdenamiento
        onCambiarOrdenamiento={manejarCambiarOrdenamiento}
        ordenamientoActual={ordenamientoActual}
        totalResenas={resenasFiltradas.length}
      />

      {/* Lista de reseñas */}
      <div className="contenedor-resenas-lista">
        {resenasFiltradas.length === 0 ? (
          <div className="estado-vacio">
            <h3>No se encontraron reseñas</h3>
            <p>Intenta ajustar los filtros o crea la primera reseña</p>
          </div>
        ) : (
          resenasFiltradas.map(pelicula => (
            <TarjetaResena 
              key={pelicula.id} 
              pelicula={pelicula}
              onEliminar={manejarEliminarResena}
              onEditar={manejarEditarResena}
              onToggleLike={manejarToggleLike}
              onAbrirComentarios={manejarAbrirComentarios}
            />
          ))
        )}
      </div>

      {/* Modales */}
      {mostrarFormulario && (
        <FormularioResena
          onCrearResena={manejarCrearResena}
          onCerrar={() => {
            setMostrarFormulario(false);
            setResenaParaEditar(null);
          }}
          peliculaSeleccionada={resenaParaEditar}
        />
      )}

      {mostrarComentarios && resenaSeleccionada && (
        <ModalComentarios
          resena={resenaSeleccionada}
          onCerrar={() => {
            setMostrarComentarios(false);
            setResenaSeleccionada(null);
          }}
        />
      )}
    </section>
  );
};

export default ListaResenas;
