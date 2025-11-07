import React, { useState, useEffect, useRef } from "react";
import { moviesAPI } from "../../services/api";
import "./SelectorPelicula.css";

const SelectorPelicula = ({
  peliculaSeleccionada,
  onSeleccionarPelicula,
  onCrearNueva,
  disabled = false,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [peliculas, setPeliculas] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarFormularioNueva, setMostrarFormularioNueva] = useState(false);
  const inputRef = useRef(null);
  const sugerenciasRef = useRef(null);

  // Cargar películas cuando el componente se monta
  useEffect(() => {
    cargarPeliculas();
  }, []);

  // Manejar clicks fuera del componente
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (
        sugerenciasRef.current &&
        !sugerenciasRef.current.contains(event.target)
      ) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, []);

  const cargarPeliculas = async () => {
    try {
      setCargando(true);
      const response = await moviesAPI.getAll();
      setPeliculas(response || []);
    } catch (error) {
      console.error("Error cargando películas:", error);
      setPeliculas([]);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setMostrarSugerencias(valor.length > 0);

    // Si hay una película seleccionada y se cambia la búsqueda, deseleccionar
    if (peliculaSeleccionada) {
      onSeleccionarPelicula(null);
    }
  };

  const manejarSeleccionPelicula = (pelicula) => {
    setBusqueda(pelicula.title);
    setMostrarSugerencias(false);
    setMostrarFormularioNueva(false);
    onSeleccionarPelicula(pelicula);
  };

  const manejarCrearNueva = () => {
    setMostrarFormularioNueva(true);
    setMostrarSugerencias(false);
    onCrearNueva && onCrearNueva();
  };

  const filtrarPeliculas = () => {
    if (!busqueda) return [];

    return peliculas
      .filter(
        (pelicula) =>
          pelicula.title &&
          pelicula.title.toLowerCase().includes(busqueda.toLowerCase())
      )
      .slice(0, 8); // Máximo 8 sugerencias
  };

  const peliculasFiltradas = filtrarPeliculas();
  const hayCoincidenciaExacta = peliculasFiltradas.some(
    (p) => p.title.toLowerCase() === busqueda.toLowerCase()
  );

  return (
    <div className="selector-pelicula" ref={sugerenciasRef}>
      <div className="campo-busqueda">
        <input
          ref={inputRef}
          type="text"
          value={busqueda}
          onChange={manejarCambioBusqueda}
          onFocus={() => busqueda && setMostrarSugerencias(true)}
          placeholder="Buscá tu película favorita..."
          className={`entrada-busqueda ${
            peliculaSeleccionada ? "seleccionada" : ""
          }`}
          disabled={disabled}
        />

        {cargando && (
          <div className="icono-carga">
            <div className="spinner-pequeno"></div>
          </div>
        )}

        {peliculaSeleccionada && <div className="icono-seleccionada">✅</div>}
      </div>

      {/* Película seleccionada */}
      {peliculaSeleccionada && !mostrarFormularioNueva && (
        <div className="pelicula-seleccionada">
          <div className="poster-grande">
            <img
              src={
                peliculaSeleccionada.poster_url ||
                "https://via.placeholder.com/140x210/1a1f2e/e5e7eb?text=Sin+Póster"
              }
              alt={peliculaSeleccionada.title}
              className="poster-imagen"
            />
          </div>

          <div className="contenido-derecha">
            <div className="cabecera-pelicula">
              <h3 className="titulo-pelicula">{peliculaSeleccionada.title}</h3>
              <button
                type="button"
                onClick={() => {
                  setBusqueda("");
                  onSeleccionarPelicula(null);
                }}
                className="boton-cambiar"
              >
                Cambiar
              </button>
            </div>

            <p className="info-secundaria">
              {peliculaSeleccionada.year && (
                <span className="chip-meta">{peliculaSeleccionada.year}</span>
              )}
              <span className="chip-meta">
                {peliculaSeleccionada.genre || "Sin género"}
              </span>
              {peliculaSeleccionada.director && (
                <span className="chip-meta">
                  Dir. {peliculaSeleccionada.director}
                </span>
              )}
            </p>

            {peliculaSeleccionada.description && (
              <p className="descripcion-corta">
                {peliculaSeleccionada.description.substring(0, 160)}
                {peliculaSeleccionada.description.length > 160 && "..."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sugerencias */}
      {mostrarSugerencias && !peliculaSeleccionada && (
        <div className="sugerencias">
          {peliculasFiltradas.length > 0 ? (
            <>
              {peliculasFiltradas.map((pelicula) => (
                <div
                  key={pelicula.id}
                  className="sugerencia-pelicula"
                  onClick={() => manejarSeleccionPelicula(pelicula)}
                >
                  <img
                    src={
                      pelicula.poster_url ||
                      "https://via.placeholder.com/40x60/34495e/ecf0f1?text=SP"
                    }
                    alt={pelicula.title}
                    className="poster-mini"
                  />
                  <div className="info-sugerencia">
                    <div className="titulo-sugerencia">{pelicula.title}</div>
                    <div className="detalle-sugerencia">
                      {pelicula.year} • {pelicula.genre || "Sin género"}
                    </div>
                  </div>
                  <div className="icono-seleccionar">→</div>
                </div>
              ))}

              {!hayCoincidenciaExacta && busqueda.length > 2 && (
                <div className="separador-sugerencias">
                  <span>¿No encontrás tu película?</span>
                </div>
              )}
            </>
          ) : (
            <div className="sin-resultados">
              <div className="icono-sin-resultados">🎬</div>
              <div>No encontramos "{busqueda}"</div>
            </div>
          )}

          {!hayCoincidenciaExacta && busqueda.length > 2 && (
            <div className="opcion-crear-nueva" onClick={manejarCrearNueva}>
              <div className="icono-agregar">+</div>
              <div className="texto-crear">
                <div className="titulo-crear">Agregar "{busqueda}"</div>
                <div className="subtitulo-crear">Crear nueva película</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectorPelicula;
