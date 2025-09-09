import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import './CrearResena.css';

const CrearResena = () => {
  const navigate = useNavigate();
  const { agregarResena } = useResenas();

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
    'Sin Spoilers', 'Acción', 'Drama', 'Comedia', 'Terror', 'Romance', 
    'Ciencia Ficción', 'Thriller', 'Familiar', 'Animación', 'Documental',
    'Obra Maestra', 'Una Decepción', 'Sobrevalorada', 'Infravalorada', 'Imperdible'
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

    setEnviando(true);

    try {
      console.log('🔍 DATOS DEL FORMULARIO:', datosFormulario);
      
      const nuevaResena = {
        id: Date.now(),
        titulo: datosFormulario.titulo,
        año: parseInt(datosFormulario.año),
        imagenUrl: `https://via.placeholder.com/120x180/2C3E50/ECF0F1?text=${encodeURIComponent(datosFormulario.titulo)}`,
        calificacion: datosFormulario.calificacion,
        usuario: 'usuario_actual',
        fechaResena: new Date().toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        fechaVisionado: datosFormulario.fechaVisionado ? new Date(datosFormulario.fechaVisionado).toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }) : new Date().toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        textoResena: datosFormulario.textoResena,
        megusta: datosFormulario.megusta,
        genero: datosFormulario.genero,
        tags: datosFormulario.tags,
        contieneEspoilers: datosFormulario.contieneEspoilers,
        likes: 0,
        yaLeDiLike: false,
        comentarios: []
      };

      console.log('🔍 NUEVA RESEÑA A ENVIAR:', nuevaResena);

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      agregarResena(nuevaResena);
      
      // Mostrar mensaje de éxito y navegar
      alert('¡Reseña creada exitosamente!');
      navigate('/');
      
    } catch (error) {
      console.error('Error al crear reseña:', error);
      alert('Uh, hubo un problema al crear la reseña. Probá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const generarEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <button
          key={i}
          type="button"
          className={`estrella-seleccionable ${
            i <= (calificacionHover || datosFormulario.calificacion) ? 'activa' : ''
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
          <h1 className="titulo-crear-resena">Escribir mi Reseña</h1>
          <p className="subtitulo-crear-resena">
            Compartí tu opinión sobre una peli y ayudá a otros cinéfilos a descubrir nuevas joyitas
          </p>
        </header>

        <form className="formulario-crear-resena" onSubmit={manejarEnvio}>
          {/* Información de la película */}
          <section className="seccion-pelicula">
            <h3 className="subtitulo-seccion">Info de la Peli</h3>
            
            <div className="grupo-campos">
              <div className="campo-formulario">
                <label className="etiqueta-campo">Título de la Peli *</label>
                <input
                  type="text"
                  value={datosFormulario.titulo}
                  onChange={(e) => manejarCambioEntrada('titulo', e.target.value)}
                  className={`entrada-texto ${errores.titulo ? 'error' : ''}`}
                  placeholder="Ej: El Padrino, Relatos Salvajes, etc."
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
