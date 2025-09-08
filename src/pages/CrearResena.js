import { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import './CrearResena.css';
import { useSubmit } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { getReview } from '../apis/reviews';

export const loader = async ({ params }) => {
  const { id } = params;
  if(!id) return { reviewData : null };
  const reviewData = await getReview(id);
  return { reviewData };
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const nuevaResena = {
    titulo: formData.get('titulo'),
    año: formData.get('año'),
    calificacion: formData.get('calificacion'),
    fechaVisionado: formData.get('fechaVisionado'),
    textoResena: formData.get('textoResena'),
    megusta: formData.get('megusta') === 'true',
    contieneEspoilers: formData.get('contieneEspoilers') === 'true',
    esSpoilerFree: formData.get('esSpoilerFree') === 'true',
    genero: formData.get('genero'),
    tags: formData.getAll('tags')
  };

  // Aquí puedes realizar la lógica para guardar la nueva reseña
  console.log(nuevaResena);
  return redirect('/');
}

const CrearResena = () => {
  const { reviewData } = useLoaderData();
  const navigate = useNavigate();
  const submit = useSubmit();

  const [datosFormulario, setDatosFormulario] = useState({
    titulo: '',
    año: '',
    calificacion: 0,
    fechaVisionado: '',
    textoResena: '',
    megusta: false,
    contieneEspoilers: false,
    esSpoilerFree: true,
    genero: '',
    tags: []
  });

  const [calificacionHover, setCalificacionHover] = useState(0);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const tagsDisponibles = [
    'Spoiler Free', 'Acción', 'Drama', 'Comedia', 'Terror', 'Romance',
    'Ciencia Ficción', 'Thriller', 'Familiar', 'Animación', 'Documental',
    'Obra Maestra', 'Decepcionante', 'Sobrevalorada', 'Infravalorada'
  ];

  const manejarCambioEntrada = (campo, valor) => {
    setDatosFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));

    // Limpiar error específico cuando el usuario empiece a corregir
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: null }));
    }
  };

  const manejarCambioTag = (tag) => {
    setDatosFormulario(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.titulo.trim()) {
      nuevosErrores.titulo = 'El título de la película es obligatorio';
    }

    if (!datosFormulario.año || datosFormulario.año < 1900 || datosFormulario.año > new Date().getFullYear() + 5) {
      nuevosErrores.año = 'Ingresa un año válido';
    }

    if (datosFormulario.calificacion === 0) {
      nuevosErrores.calificacion = 'Debes dar una calificación a la película';
    }

    if (!datosFormulario.fechaVisionado) {
      nuevosErrores.fechaVisionado = 'Indica cuándo viste la película';
    }

    if (!datosFormulario.textoResena.trim() || datosFormulario.textoResena.length < 10) {
      nuevosErrores.textoResena = 'La reseña debe tener al menos 10 caracteres';
    }

    if (datosFormulario.textoResena.length > 1000) {
      nuevosErrores.textoResena = 'La reseña no puede exceder 1000 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const formData = new FormData();
    formData.append('titulo', datosFormulario.titulo);
    formData.append('año', datosFormulario.año);
    formData.append('calificacion', datosFormulario.calificacion);
    formData.append('fechaVisionado', datosFormulario.fechaVisionado);
    formData.append('textoResena', datosFormulario.textoResena);
    formData.append('megusta', datosFormulario.megusta);
    formData.append('contieneEspoilers', datosFormulario.contieneEspoilers);
    formData.append('esSpoilerFree', datosFormulario.esSpoilerFree);
    formData.append('genero', datosFormulario.genero);
    datosFormulario.tags.forEach(tag => formData.append('tags', tag));
    submit(formData, { method: 'post' });
  };

  const generarEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <button
          key={i}
          type="button"
          className={`estrella-seleccionable ${i <= (calificacionHover || datosFormulario.calificacion) ? 'activa' : ''
            }`}
          onClick={() => manejarCambioEntrada('calificacion', i)}
          onMouseEnter={() => setCalificacionHover(i)}
          onMouseLeave={() => setCalificacionHover(0)}
        >
          ★
        </button>
      );
    }
    return estrellas;
  };

  return (
    <div className="pagina-crear-resena">
      <div className="contenedor-crear-resena">
        <header className="encabezado-crear-resena">
          <h1 className="titulo-crear-resena">Nueva Reseña</h1>
          <p className="subtitulo-crear-resena">
            Comparte tu opinión sobre una película y ayuda a otros cinéfilos a descubrir nuevas joyas
          </p>
        </header>

        <form className="formulario-crear-resena" onSubmit={manejarEnvio}>
          {/* Información de la película */}
          <section className="seccion-pelicula">
            <h3 className="subtitulo-seccion">Información de la Película</h3>

            <div className="grupo-campos">
              <div className="campo-formulario">
                <label className="etiqueta-campo">Título de la Película *</label>
                <input
                  type="text"
                  value={datosFormulario.titulo}
                  onChange={(e) => manejarCambioEntrada('titulo', e.target.value)}
                  className={`entrada-texto ${errores.titulo ? 'error' : ''}`}
                  placeholder="Ej: El Padrino"
                  disabled={enviando}
                />
                {errores.titulo && <span className="mensaje-error">{errores.titulo}</span>}
              </div>

              <div className="campo-formulario">
                <label className="etiqueta-campo">Año *</label>
                <input
                  type="number"
                  value={datosFormulario.año}
                  onChange={(e) => manejarCambioEntrada('año', e.target.value)}
                  className={`entrada-numero ${errores.año ? 'error' : ''}`}
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  disabled={enviando}
                />
                {errores.año && <span className="mensaje-error">{errores.año}</span>}
              </div>
            </div>

            <div className="campo-formulario">
              <label className="etiqueta-campo">Género</label>
              <select
                value={datosFormulario.genero}
                onChange={(e) => manejarCambioEntrada('genero', e.target.value)}
                className="entrada-select"
                disabled={enviando}
              >
                <option value="">Seleccionar género</option>
                <option value="accion">Acción</option>
                <option value="drama">Drama</option>
                <option value="comedia">Comedia</option>
                <option value="terror">Terror</option>
                <option value="romance">Romance</option>
                <option value="ciencia-ficcion">Ciencia Ficción</option>
                <option value="thriller">Thriller</option>
                <option value="animacion">Animación</option>
                <option value="documental">Documental</option>
              </select>
            </div>
          </section>

          {/* Calificación */}
          <section className="seccion-calificacion">
            <h3 className="subtitulo-seccion">Tu Calificación *</h3>
            <div className="contenedor-estrellas">
              {generarEstrellas()}
              <span className="texto-calificacion">
                {datosFormulario.calificacion > 0 ? `${datosFormulario.calificacion}/5 estrellas` : 'Selecciona tu calificación'}
              </span>
            </div>
            {errores.calificacion && <span className="mensaje-error">{errores.calificacion}</span>}
          </section>

          {/* Fecha de visionado */}
          <section className="seccion-fecha">
            <div className="campo-formulario">
              <label className="etiqueta-campo">¿Cuándo la viste? *</label>
              <input
                type="date"
                value={datosFormulario.fechaVisionado}
                onChange={(e) => manejarCambioEntrada('fechaVisionado', e.target.value)}
                className={`entrada-fecha ${errores.fechaVisionado ? 'error' : ''}`}
                max={new Date().toISOString().split('T')[0]}
                disabled={enviando}
              />
              {errores.fechaVisionado && <span className="mensaje-error">{errores.fechaVisionado}</span>}
            </div>
          </section>

          {/* Reseña */}
          <section className="seccion-resena">
            <h3 className="subtitulo-seccion">Tu Reseña *</h3>
            <div className="campo-formulario">
              <textarea
                value={datosFormulario.textoResena}
                onChange={(e) => manejarCambioEntrada('textoResena', e.target.value)}
                className={`entrada-textarea ${errores.textoResena ? 'error' : ''}`}
                placeholder="Comparte tu opinión sobre la película..."
                rows={8}
                maxLength={1000}
                disabled={enviando}
              />
              <div className="info-textarea">
                <span className={`contador-caracteres ${datosFormulario.textoResena.length > 900 ? 'cerca-limite' : ''}`}>
                  {datosFormulario.textoResena.length}/1000 caracteres
                </span>
              </div>
              {errores.textoResena && <span className="mensaje-error">{errores.textoResena}</span>}
            </div>
          </section>

          {/* Tags */}
          <section className="seccion-tags">
            <h3 className="subtitulo-seccion">Tags</h3>
            <div className="contenedor-tags">
              {tagsDisponibles.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-boton ${datosFormulario.tags.includes(tag) ? 'activo' : ''}`}
                  onClick={() => manejarCambioTag(tag)}
                  disabled={enviando}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Opciones adicionales */}
          <section className="seccion-opciones">
            <div className="campo-checkbox">
              <label className="etiqueta-checkbox">
                <input
                  type="checkbox"
                  checked={datosFormulario.megusta}
                  onChange={(e) => manejarCambioEntrada('megusta', e.target.checked)}
                  disabled={enviando}
                />
                <span className="checkbox-personalizado"></span>
                Me gustó esta película ❤️
              </label>
            </div>

            <div className="campo-checkbox">
              <label className="etiqueta-checkbox">
                <input
                  type="checkbox"
                  checked={datosFormulario.contieneEspoilers}
                  onChange={(e) => {
                    manejarCambioEntrada('contieneEspoilers', e.target.checked);
                    if (e.target.checked) {
                      manejarCambioEntrada('esSpoilerFree', false);
                    }
                  }}
                  disabled={enviando}
                />
                <span className="checkbox-personalizado"></span>
                Esta reseña contiene spoilers ⚠️
              </label>
            </div>
          </section>

          {/* Botones de acción */}
          <div className="botones-crear-resena">
            <button
              type="button"
              className="boton-cancelar"
              onClick={() => navigate('/')}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="boton-publicar"
              disabled={enviando}
            >
              {enviando ? 'Publicando...' : 'Publicar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearResena;
