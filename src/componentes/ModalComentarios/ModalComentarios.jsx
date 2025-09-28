import React, { useState, useEffect } from 'react';
import { useResenas } from '../../contextos/ContextoResenas';
import './ModalComentarios.css';

const ModalComentarios = ({ resena, onCerrar }) => {
  const { agregarComentario, eliminarComentario, usuarioActual, reviewsAPI, usingBackend } = useResenas();
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [comentarios, setComentarios] = useState(resena.comentarios || []);
  const [enviando, setEnviando] = useState(false);
  const [cargandoComentarios, setCargandoComentarios] = useState(false);

  // Cargar comentarios del backend cuando se abre el modal
  useEffect(() => {
    const cargarComentarios = async () => {
      if (usingBackend && reviewsAPI) {
        setCargandoComentarios(true);
        try {
          const comentariosBackend = await reviewsAPI.getComments(resena.id);
          setComentarios(comentariosBackend || []);
        } catch (error) {
          console.error('Error cargando comentarios:', error);
          // Usar comentarios locales como fallback
          setComentarios(resena.comentarios || []);
        } finally {
          setCargandoComentarios(false);
        }
      } else {
        setComentarios(resena.comentarios || []);
      }
    };

    cargarComentarios();
  }, [resena.id, usingBackend, reviewsAPI, resena.comentarios]);

  // Función para obtener el nombre del usuario por ID
  const obtenerNombreUsuario = (userId) => {
    const id = Number(userId);
    switch (id) {
      case 1: return 'Admin';
      case 2: return 'Juan Pérez';
      case 3: return 'María García';
      case 4: return 'Carlos López';
      case 5: return 'Ana Martín';
      case 6: return 'Luis Rodríguez';
      default: return `Usuario ${id}`;
    }
  };

  const manejarEnvioComentario = async (evento) => {
    evento.preventDefault();
    
    if (!nuevoComentario.trim() || enviando) return;

    setEnviando(true);
    try {
      if (usingBackend && reviewsAPI) {
        // Usar API del backend directamente
        const comentarioBackend = await reviewsAPI.addComment(resena.id, usuarioActual, nuevoComentario.trim());
        setComentarios(prev => [...prev, comentarioBackend]);
      } else {
        // Modo local/offline - solo llamar al contexto
        await agregarComentario(resena.id, nuevoComentario.trim());
        
        // Recargar comentarios desde el contexto para evitar duplicados
        const comentarioLocal = {
          id: Date.now(),
          usuario: obtenerNombreUsuario(usuarioActual),
          user_name: obtenerNombreUsuario(usuarioActual),
          texto: nuevoComentario.trim(),
          comment: nuevoComentario.trim(),
          fecha: new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          created_at: new Date().toISOString()
        };
        setComentarios(prev => [...prev, comentarioLocal]);
      }
      
      setNuevoComentario('');
    } catch (error) {
      console.error('Error agregando comentario:', error);
      alert('Error al agregar comentario. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const manejarEliminarComentario = async (comentarioId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        if (usingBackend && reviewsAPI) {
          // Usar API del backend directamente
          await reviewsAPI.deleteComment(comentarioId, usuarioActual);
          setComentarios(prev => prev.filter(c => c.id !== comentarioId));
        } else {
          // Modo local/offline - solo llamar al contexto
          await eliminarComentario(resena.id, comentarioId);
          setComentarios(prev => prev.filter(c => c.id !== comentarioId));
        }
      } catch (error) {
        console.error('Error eliminando comentario:', error);
        alert('Error al eliminar comentario: ' + error.message);
      }
    }
  };

  const esComentarioPropio = (comentario) => {
    const usuarioActualNombre = obtenerNombreUsuario(usuarioActual);
    return comentario.usuario === usuarioActualNombre || 
           comentario.user_name === usuarioActualNombre ||
           comentario.usuario === `usuario_${usuarioActual}`;
  };

  return (
    <div className="overlay-modal-comentarios" onClick={onCerrar}>
      <div className="modal-comentarios" onClick={e => e.stopPropagation()}>
        {/* Encabezado */}
        <header className="encabezado-modal-comentarios">
          <div className="info-pelicula-modal">
            <h3 className="titulo-pelicula-modal">
              {resena.movie_title || resena.titulo || resena.title} ({resena.year || resena.año})
            </h3>
            <p className="autor-resena-modal">
              Reseña de {resena.user_name || resena.usuario}
            </p>
          </div>
          <button className="boton-cerrar-modal" onClick={onCerrar}>✕</button>
        </header>

        {/* Contenido del modal */}
        <div className="contenido-modal-comentarios">
          {/* Resumen de la reseña */}
          <div className="resumen-resena">
            <div className="calificacion-resumen">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`estrella-resumen ${i < (resena.rating || resena.calificacion) ? 'activa' : ''}`}>
                  ★
                </span>
              ))}
            </div>
            <p className="texto-resena-resumen">
              {(resena.body || resena.textoResena || '').length > 150 
                ? `${(resena.body || resena.textoResena || '').substring(0, 150)}...` 
                : (resena.body || resena.textoResena || '')}
            </p>
          </div>

          {/* Lista de comentarios */}
          <div className="seccion-comentarios">
            <h4 className="titulo-comentarios">
              Comentarios ({comentarios.length})
            </h4>
            
            {cargandoComentarios ? (
              <div className="cargando-comentarios">
                <p>Cargando comentarios...</p>
              </div>
            ) : comentarios.length === 0 ? (
              <div className="sin-comentarios">
                <p>Aún no hay comentarios. ¡Sé el primero en comentar!</p>
              </div>
            ) : (
              <div className="lista-comentarios">
                {comentarios.map(comentario => (
                  <div key={comentario.id} className="comentario">
                    <div className="encabezado-comentario">
                      <span className="usuario-comentario">
                        {comentario.user_name || comentario.usuario}
                      </span>
                      <span className="fecha-comentario">
                        {comentario.fecha || new Date(comentario.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {esComentarioPropio(comentario) && (
                        <button 
                          className="boton-eliminar-comentario"
                          onClick={() => manejarEliminarComentario(comentario.id)}
                          title="Eliminar comentario"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <p className="texto-comentario">
                      {comentario.comment || comentario.texto}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario para nuevo comentario */}
          <form className="formulario-comentario" onSubmit={manejarEnvioComentario}>
            <div className="entrada-comentario">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe tu comentario sobre esta reseña..."
                className="textarea-comentario"
                rows={3}
                maxLength={500}
                disabled={enviando}
              />
              <div className="info-comentario">
                <span className={`contador-comentario ${nuevoComentario.length > 450 ? 'cerca-limite' : ''}`}>
                  {nuevoComentario.length}/500
                </span>
              </div>
            </div>
            
            <div className="botones-comentario">
              <button 
                type="submit" 
                className="boton-enviar-comentario"
                disabled={!nuevoComentario.trim() || enviando}
              >
                {enviando ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalComentarios;
