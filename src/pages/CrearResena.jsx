import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ContextoResenas from '../contextos/ContextoResenas';
import SelectorPelicula from '../componentes/SelectorPelicula/SelectorPelicula';
import { TAGS_DISPONIBLES } from '../constants/tags'; // ✅ Importar tags compartidos
import './CrearResena.css';

const CrearResena = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Para edición
  const [searchParams] = useSearchParams(); // Para crear nueva con datos de película

  // ✅ SOLUCION: Extraer TODO el contexto pero guardar funciones en useRef para evitar re-renders
  const contextoCompleto = useContext(ContextoResenas);
  
  // Guardar funciones en refs (no causan re-renders)
  const funcionesRef = useRef({});
  funcionesRef.current = {
    agregarResena: contextoCompleto.agregarResena,
    actualizarResena: contextoCompleto.actualizarResena,
    reviewsAPI: contextoCompleto.reviewsAPI
  };
  
  // Extraer solo valores primitivos (sí causan re-renders pero solo cuando cambian de verdad)
  const { usuarioActual, /* usingBackend */ } = contextoCompleto;
  
  // Usar las funciones desde el ref
  const agregarResena = (...args) => {
    return funcionesRef.current.agregarResena(...args);
  };
  const actualizarResena = (...args) => {
    return funcionesRef.current.actualizarResena(...args);
  };
  // const reviewsAPI = funcionesRef.current.reviewsAPI;

  const esEdicion = !!id;
  const movieIdFromUrl = searchParams.get('movieId');
  const tituloFromUrl = searchParams.get('titulo');
  const yearFromUrl = searchParams.get('year');
  const genreFromUrl = searchParams.get('genre');
  const directorFromUrl = searchParams.get('director');
  const posterFromUrl = searchParams.get('poster');
  const descriptionFromUrl = searchParams.get('description');

  const [datosFormulario, setDatosFormulario] = useState({
    tituloResenia: '', // ✅ Agregar título de reseña
    titulo: tituloFromUrl || '',
    año: yearFromUrl || '',
    poster: posterFromUrl || '',
    posterFile: null, // Para almacenar el archivo de imagen
    calificacion: 0,
    fechaVisionado: '',
    textoResena: '',
    megusta: false,
    contieneEspoilers: false,
    esSpoilerFree: true,
    genero: genreFromUrl || '',
    tags: []
  });

  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(movieIdFromUrl ? {
    id: movieIdFromUrl,
    title: tituloFromUrl,
    year: yearFromUrl,
    genre: genreFromUrl,
    director: directorFromUrl,
    poster_url: posterFromUrl,
    description: descriptionFromUrl
  } : null);
  // const [modoCrearNueva, setModoCrearNueva] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(esEdicion);

  const [calificacionHover, setCalificacionHover] = useState(0);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Cargar datos para edición - VERSION SIMPLIFICADA PARA DEBUG
  useEffect(() => {
    if (esEdicion && id) {
      const cargarDatosResena = async () => {
        setCargandoDatos(true);

        try {
          const resenaId = parseInt(id, 10);
          const response = await fetch(`http://localhost:8080/reviews/${resenaId}`);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const resena = await response.json();

          if (resena) {
            // Convertir fecha ISO a formato YYYY-MM-DD para el input
            let fechaFormateada = '';
            if (resena.created_at) {
              const fecha = new Date(resena.created_at);
              fechaFormateada = fecha.toISOString().split('T')[0];
            }

            setDatosFormulario({
              tituloResenia: resena.title || '',
              titulo: resena.movie_title || '',
              año: resena.year || '',
              poster: resena.movie_poster || resena.poster_url || '',
              calificacion: resena.rating || 0,
              fechaVisionado: fechaFormateada,
              textoResena: resena.body || '',
              megusta: false,
              contieneEspoilers: resena.has_spoilers || false,
              esSpoilerFree: !resena.has_spoilers,
              genero: resena.movie_genre || resena.genre || '',
              tags: resena.tags || []
            });

            // Solo establecer película si tenemos los datos completos
            if (resena.movie_id && resena.movie_title) {
              setPeliculaSeleccionada({
                id: resena.movie_id,
                title: resena.movie_title,
                year: resena.year,
                genre: resena.movie_genre || resena.genre,
                director: resena.movie_director,
                poster_url: resena.movie_poster || resena.poster_url,
                description: resena.movie_description
              });
            }
          }

        } catch (error) {
          console.error('Error al cargar la reseña:', error);
          alert('Error al cargar la reseña: ' + error.message);
        } finally {
          setCargandoDatos(false);
        }
      };

      cargarDatosResena();
    }
  }, [id, esEdicion]);

  // ✅ Usar tags compartidos en lugar de definir aquí
  const tagsDisponibles = TAGS_DISPONIBLES;

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

  // const redimensionarImagen = (file, maxWidth = 300, maxHeight = 450, quality = 0.8) => {
  //   return new Promise((resolve) => {
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');
  //     const img = new Image();

  //     img.onload = () => {
  //       // Calcular nuevas dimensiones manteniendo aspecto
  //       let { width, height } = img;

  //       if (width > height) {
  //         if (width > maxWidth) {
  //           height = (height * maxWidth) / width;
  //           width = maxWidth;
  //         }
  //       } else {
  //         if (height > maxHeight) {
  //           width = (width * maxHeight) / height;
  //           height = maxHeight;
  //         }
  //       }

  //       canvas.width = width;
  //       canvas.height = height;

  //       // Dibujar imagen redimensionada
  //       ctx.drawImage(img, 0, 0, width, height);

  //       // Convertir a base64 con compresión
  //       const dataURL = canvas.toDataURL('image/jpeg', quality);
  //       resolve(dataURL);
  //     };

  //     img.src = URL.createObjectURL(file);
  //   });
  // };

  // const manejarCambioImagen = async (evento) => {
  //   const archivo = evento.target.files[0];
  //   if (archivo) {
  //     // Validar que sea una imagen
  //     if (!archivo.type.startsWith('image/')) {
  //       alert('Por favor selecciona un archivo de imagen válido');
  //       return;
  //     }

  //     // Validar tamaño (máximo 5MB)
  //     if (archivo.size > 5 * 1024 * 1024) {
  //       alert('La imagen es demasiado grande. Máximo 5MB');
  //       return;
  //     }

  //     try {
  //       // Redimensionar y comprimir imagen
  //       const imagenComprimida = await redimensionarImagen(archivo);

  //       setDatosFormulario(prev => ({
  //         ...prev,
  //         poster: imagenComprimida,
  //         posterFile: archivo
  //       }));
  //     } catch (error) {
  //       console.error('Error procesando imagen:', error);
  //       alert('Error al procesar la imagen. Inténtalo de nuevo.');
  //     }
  //   }
  // };

  const manejarCambioTag = (tag) => {
    setDatosFormulario(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const manejarSeleccionPelicula = (pelicula) => {
    setPeliculaSeleccionada(pelicula);
    // setModoCrearNueva(false);

    if (pelicula) {
      // Auto-llenar datos del formulario con info de la película
      setDatosFormulario(prev => ({
        ...prev,
        titulo: pelicula.title || '',
        año: pelicula.year || '',
        genero: pelicula.genre || prev.genero
      }));
    }
  };

  const manejarCrearNueva = () => {
    // setModoCrearNueva(true);
    setPeliculaSeleccionada(null);
    // Limpiar campos auto-llenados
    setDatosFormulario(prev => ({
      ...prev,
      titulo: '',
      año: '',
      poster: '',
      posterFile: null,
      genero: ''
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.titulo.trim()) {
      nuevosErrores.titulo = 'El título de la película es obligatorio';
      console.log('❌ Error: título vacío');
    }

    if (!datosFormulario.año || datosFormulario.año < 1900 || datosFormulario.año > new Date().getFullYear() + 5) {
      nuevosErrores.año = 'Ingresa un año válido';
      console.log('❌ Error: año inválido', datosFormulario.año);
    }

    // ✅ VALIDACIÓN: La calificación debe ser entre 1 y 5 (ahora opcional)
    if (datosFormulario.calificacion && (datosFormulario.calificacion < 1 || datosFormulario.calificacion > 5)) {
      nuevosErrores.calificacion = 'La calificación debe estar entre 1 y 5 estrellas';
      console.log('❌ Error: calificación inválida', datosFormulario.calificacion);
    }

    // ✅ FIX: Hacer la fecha de visionado opcional
    // if (!datosFormulario.fechaVisionado) {
    //   nuevosErrores.fechaVisionado = 'Indica cuándo viste la película';
    // }

    if (!datosFormulario.textoResena.trim() || datosFormulario.textoResena.length < 10) {
      nuevosErrores.textoResena = 'La reseña debe tener al menos 10 caracteres';
      console.log('❌ Error: reseña muy corta', datosFormulario.textoResena.length);
    }

    if (datosFormulario.textoResena.length > 1000) {
      nuevosErrores.textoResena = 'La reseña no puede exceder 1000 caracteres';
      console.log('❌ Error: reseña muy larga', datosFormulario.textoResena.length);
    }

    // Validar que la imagen no sea demasiado grande para la base de datos
    if (datosFormulario.poster && datosFormulario.poster.length > 50000) {
      nuevosErrores.poster = 'La imagen es demasiado grande. Intenta con una imagen más pequeña.';
      console.log('❌ Error: imagen muy grande');
    }

    setErrores(nuevosErrores);
    const esValido = Object.keys(nuevosErrores).length === 0;
    console.log(esValido ? '✅ Formulario válido' : '❌ Formulario inválido', nuevosErrores);
    return esValido;
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);

    try {
      const datosResena = {
        tituloResena: datosFormulario.tituloResenia,
        // Usar datos de película seleccionada o del formulario
        titulo: peliculaSeleccionada ? peliculaSeleccionada.title : datosFormulario.titulo,
        año: peliculaSeleccionada ? peliculaSeleccionada.year : parseInt(datosFormulario.año),
        imagenUrl: peliculaSeleccionada ?
          peliculaSeleccionada.poster_url :
          (datosFormulario.poster || `https://via.placeholder.com/120x180/2C3E50/ECF0F1?text=${encodeURIComponent(datosFormulario.titulo)}`),
        calificacion: datosFormulario.calificacion,
        usuario: `usuario_${usuarioActual}`, // Usar usuario actual del contexto
        user_id: usuarioActual, // Para el backend
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
        genero: peliculaSeleccionada ? peliculaSeleccionada.genre : datosFormulario.genero,
        tags: datosFormulario.tags,
        contieneEspoilers: datosFormulario.contieneEspoilers,
        likes: 0,
        yaLeDiLike: false,
        // Agregar ID de película seleccionada para el backend
        movie_id: peliculaSeleccionada ? peliculaSeleccionada.id : null
      };

      if (esEdicion) {
        // Modo edición
        await actualizarResena(id, datosResena); // ✅ Cambiar de editarResena a actualizarResena
        alert('¡Reseña actualizada exitosamente! 🎉');
      } else {
        // Modo creación
        datosResena.id = Date.now();
        datosResena.fechaResena = new Date().toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        await agregarResena(datosResena);
        alert('¡Reseña creada exitosamente! 🎉');
      }

      // Redirigir al inicio
      navigate('/');

    } catch (error) {
      console.error('💥 Error al crear reseña:', error);
      console.log('Datos de reseña enviados:', datosFormulario);
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
          className={`estrella-seleccionable ${i <= (calificacionHover || datosFormulario.calificacion) ? 'activa' : ''
            }`}
          onClick={() => {
            if (datosFormulario.calificacion === i) {
              setCalificacionHover(0)
              manejarCambioEntrada('calificacion', 0)
            } else {
              manejarCambioEntrada('calificacion', i)
            }

          }}
          onMouseEnter={() => setCalificacionHover(i)}
          onMouseLeave={() => setCalificacionHover(0)}
        >
          ★
        </button>
      );
    }
    return [
      ...estrellas
    ];
  };

  if (cargandoDatos) {
    return (
      <div className="pagina-crear-resena">
        <div className="contenedor-crear-resena">
          <div className="estado-carga">
            <h2>Cargando datos de la reseña...</h2>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-crear-resena">
      <div className="contenedor-crear-resena">
        <header className="encabezado-crear-resena">
          <h1 className="titulo-crear-resena">
            {cargandoDatos ? 'Cargando datos de la reseña...' :
              esEdicion ? 'Editar mi Reseña' : 'Escribir mi Reseña'}
          </h1>
          <p className="subtitulo-crear-resena">
            {cargandoDatos ? 'Por favor espera mientras cargamos los datos de tu reseña' :
              esEdicion
                ? 'Modificá tu reseña para mejorarla o corregir algún detalle'
                : 'Compartí tu opinión sobre una peli y ayudá a otros cinéfilos a descubrir nuevas joyitas'
            }
          </p>
        </header>

        {cargandoDatos ? (
          <div className="cargando-datos">
            <div className="spinner"></div>
            <p>Cargando datos de la reseña...</p>
          </div>
        ) : (
          <form className="formulario-crear-resena" onSubmit={manejarEnvio}>
            {/* Titulo de la reseña */}
            <h2 className="subtitulo-formulario">Detalles de la Reseña</h2>
            {/* Fecha de visionado */}
            <section className="seccion-fecha">
              <div className="campo-formulario">
                <label className="etiqueta-campo">Titulo de reseña</label>
                <input
                  type="text"
                  value={datosFormulario.tituloResenia}
                  onChange={(e) => manejarCambioEntrada('tituloResenia', e.target.value)}
                  className={`entrada-fecha ${errores.tituloResenia ? 'error' : ''}`}
                  disabled={enviando}
                />
                {errores.tituloResenia && <span className="mensaje-error">{errores.tituloResenia}</span>}
              </div>
            </section>

            {/* Información de la película */}
            <section className="seccion-pelicula">
              <h3 className="subtitulo-seccion">Seleccionar Película</h3>

              <div className="campo-formulario">
                <label className="etiqueta-campo">Película *</label>
                <SelectorPelicula
                  peliculaSeleccionada={peliculaSeleccionada}
                  onSeleccionarPelicula={manejarSeleccionPelicula}
                  onCrearNueva={manejarCrearNueva}
                  disabled={enviando}
                />
                {errores.titulo && <span className="mensaje-error">{errores.titulo}</span>}
              </div>


              {/* <div className="campo-formulario">
                <label className="etiqueta-campo">Género</label>
                <select
                  value={datosFormulario.genero}
                  onChange={(e) => manejarCambioEntrada('genero', e.target.value)}
                  className="entrada-select"
                  disabled={enviando}
                >
                  <option value="">Seleccionar género</option>
                  <option value="Acción">Acción</option>
                  <option value="Drama">Drama</option>
                  <option value="Comedia">Comedia</option>
                  <option value="Terror">Terror</option>
                  <option value="Romance">Romance</option>
                  <option value="Ciencia Ficción">Ciencia Ficción</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Animación">Animación</option>
                  <option value="Fantasía">Fantasía</option>
                  <option value="Musical">Musical</option>
                  <option value="Crimen">Crimen</option>
                </select>
              </div> */}
            </section>

            {/* Calificación */}
            <section className="seccion-calificacion">
              <h3 className="subtitulo-seccion">Tu Calificación (Opcional)</h3>
              <div className="contenedor-estrellas">
                {generarEstrellas()}
                <span className="texto-calificacion">
                  {datosFormulario.calificacion > 0 ? `${datosFormulario.calificacion}/5 estrellas` : 'Sin estrellas'}
                </span>
              </div>
              {errores.calificacion && <span className="mensaje-error">{errores.calificacion}</span>}
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
                  maxLength={150}
                  disabled={enviando}
                />
                <div className="info-textarea">
                  <span className={`contador-caracteres ${datosFormulario.textoResena.length > 900 ? 'cerca-limite' : ''}`}>
                    {datosFormulario.textoResena.length}/150 caracteres
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
                {enviando
                  ? (esEdicion ? 'Actualizando...' : 'Publicando...')
                  : (esEdicion ? 'Actualizar Reseña' : 'Publicar Reseña')
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CrearResena;