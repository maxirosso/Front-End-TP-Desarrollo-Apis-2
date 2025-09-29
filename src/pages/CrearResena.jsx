import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResenas } from "../contextos/ContextoResenas";

export default function CrearResena() {
  const navigate = useNavigate();
  const { agregarResena } = useResenas();

  const [datosFormulario, setDatosFormulario] = useState({
    tituloResenia: "",
    textoResena: "",
    calificacion: 0,
    tags: [],
    contieneSpoilers: false,
  });

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const manejarCambioEntrada = (campo, valor) => {
    setDatosFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const manejarToggleTag = (tag) => {
    setDatosFormulario((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const erroresValidacion = validarFormulario();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    setErrores({});
    setEnviando(true);

    try {
      await agregarResena(datosFormulario);
      navigate("/");
    } catch (error) {
      console.error("Error al enviar reseña:", error);
    } finally {
      setEnviando(false);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!datosFormulario.tituloResenia.trim()) {
      nuevosErrores.tituloResenia = "El título de la reseña es obligatorio";
    }
    if (datosFormulario.calificacion === 0) {
      nuevosErrores.calificacion = "La calificación es obligatoria";
    }
    if (datosFormulario.textoResena.trim().length < 10) {
      nuevosErrores.textoResena =
        "La reseña debe tener al menos 10 caracteres";
    }
    return nuevosErrores;
  };

  const tagsDisponibles = [
    "Sin Spoilers",
    "Acción",
    "Drama",
    "Comedia",
    "Terror",
    "Romance",
    "Ciencia Ficción",
    "Thriller",
    "Familiar",
    "Animación",
    "Documental",
    "Obra Maestra",
    "Una Decepción",
    "Sobrevalorada",
    "Infravalorada",
    "Imperdible",
  ];

  return (
    <div className="pagina-crear-resena">
      <div className="contenedor-crear-resena">
        <header className="encabezado-crear-resena">
          <h1 className="titulo-crear-resena">Escribir mi Reseña</h1>
          <p className="subtitulo-crear-resena">
            Compartí tu opinión sobre una peli y ayudá a otros cinéfilos a
            descubrir nuevas joyitas
          </p>
        </header>

        <form className="formulario-crear-resena" onSubmit={manejarSubmit}>
          <h2 className="subtitulo-formulario">Detalles de la Reseña</h2>

          {/* Campo título de reseña */}
          <section className="seccion-fecha">
            <div className="campo-formulario">
              <label className="etiqueta-campo" htmlFor="titulo-resena">
                Titulo de reseña
              </label>
              <input
                id="titulo-resena"
                type="text"
                value={datosFormulario.tituloResenia}
                onChange={(e) =>
                  manejarCambioEntrada("tituloResenia", e.target.value)
                }
                className={`entrada-fecha ${
                  errores.tituloResenia ? "error" : ""
                }`}
                disabled={enviando}
              />
              {errores.tituloResenia && (
                <span className="mensaje-error">{errores.tituloResenia}</span>
              )}
            </div>
          </section>

          {/* Calificación */}
          <section className="seccion-calificacion">
            <h3 className="subtitulo-seccion">Tu Calificación *</h3>
            <div className="contenedor-estrellas">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button
                  key={estrella}
                  type="button"
                  className={`estrella-seleccionable ${
                    datosFormulario.calificacion >= estrella ? "activa" : ""
                  }`}
                  onClick={() =>
                    manejarCambioEntrada("calificacion", estrella)
                  }
                  disabled={enviando}
                >
                  ★
                </button>
              ))}
              <span className="texto-calificacion">
                {datosFormulario.calificacion > 0
                  ? `${datosFormulario.calificacion} estrellas`
                  : "Sin estrellas"}
              </span>
              {errores.calificacion && (
                <span className="mensaje-error">{errores.calificacion}</span>
              )}
            </div>
          </section>

          {/* Reseña */}
          <section className="seccion-resena">
            <h3 className="subtitulo-seccion">Tu Reseña *</h3>
            <div className="campo-formulario">
              <label className="etiqueta-campo" htmlFor="texto-resena">
                Tu Reseña *
              </label>
              <textarea
                id="texto-resena"
                value={datosFormulario.textoResena}
                onChange={(e) =>
                  manejarCambioEntrada("textoResena", e.target.value)
                }
                className={`entrada-textarea ${
                  errores.textoResena ? "error" : ""
                }`}
                placeholder="Comparte tu opinión sobre la película..."
                rows={8}
                maxLength={1000}
                disabled={enviando}
              />
              <div className="info-textarea">
                <span className="contador-caracteres">
                  {datosFormulario.textoResena.length}/1000 caracteres
                </span>
              </div>
              {errores.textoResena && (
                <span className="mensaje-error">{errores.textoResena}</span>
              )}
            </div>
          </section>

          {/* Tags */}
          <section className="seccion-tags">
            <h3 className="subtitulo-seccion">Tags</h3>
            <div className="contenedor-tags">
              {tagsDisponibles.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-boton ${
                    datosFormulario.tags.includes(tag) ? "seleccionado" : ""
                  }`}
                  onClick={() => manejarToggleTag(tag)}
                  disabled={enviando}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Checkbox spoilers */}
          <section className="seccion-opciones">
            <div className="campo-checkbox">
              <label className="etiqueta-checkbox" htmlFor="spoilers">
                <input
                  id="spoilers"
                  type="checkbox"
                  checked={datosFormulario.contieneSpoilers}
                  onChange={(e) =>
                    manejarCambioEntrada("contieneSpoilers", e.target.checked)
                  }
                  disabled={enviando}
                />
                <span className="checkbox-personalizado" />
                Esta reseña contiene spoilers ⚠️
              </label>
            </div>
          </section>

          {/* Botones */}
          <div className="botones-crear-resena">
            <button
              type="button"
              className="boton-cancelar"
              onClick={() => navigate("/")}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="boton-publicar"
              disabled={enviando}
            >
              {enviando ? "Publicando..." : "Publicar Reseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
