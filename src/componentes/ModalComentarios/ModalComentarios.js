import React, { useState } from 'react';
import './ModalComentarios.css';

const ModalComentarios = ({ resena, onCerrar, onAgregarComentario }) => {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [comentarios, setComentarios] = useState(resena.comentarios || []);

  const manejarEnvioComentario = (evento) => {
    evento.preventDefault();
    
    if (!nuevoComentario.trim()) return;

    const comentario = {
      id: Date.now(),
      usuario: 'usuario_actual',
      texto: nuevoComentario.trim(),
      fecha: new Date().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setComentarios(prev => [...prev, comentario]);
    setNuevoComentario('');
    
    // En una aplicación real, aquí se enviaría al backend
    if (onAgregarComentario) {
      onAgregarComentario(resena.id, comentario);
    }
  };

  const manejarEliminarComentario = (comentarioId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      setComentarios(prev => prev.filter(c => c.id !== comentarioId));
    }
  };

  return (
    <div className="overlay-modal-comentarios" onClick={onCerrar}>
      <div className="modal-comentarios" onClick={e => e.stopPropagation()}>
        {/* Encabezado */}
        <header className="encabezado-modal-comentarios">
          <div className="info-pelicula-modal">
            <h3 className="titulo-pelicula-modal">{resena.titulo} ({resena.año})</h3>
            <p className="autor-resena-modal">Reseña de {resena.usuario}</p>
          </div>
          <button className="boton-cerrar-modal" onClick={onCerrar}>✕</button>
        </header>

        {/* Contenido del modal */}
        <div className="contenido-modal-comentarios">
          {/* Resumen de la reseña */}
          <div className="resumen-resena">
            <div className="calificacion-resumen">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`estrella-resumen ${i < resena.calificacion ? 'activa' : ''}`}>
                  ★
                </span>
              ))}
            </div>
            <p className="texto-resena-resumen">
              {resena.textoResena.length > 150 
                ? `${resena.textoResena.substring(0, 150)}...` 
                : resena.textoResena}
            </p>
          </div>

          {/* Lista de comentarios */}
          <div className="seccion-comentarios">
            <h4 className="titulo-comentarios">
              Comentarios ({comentarios.length})
            </h4>
            
            {comentarios.length === 0 ? (
              <div className="sin-comentarios">
                <p>Aún no hay comentarios. ¡Sé el primero en comentar!</p>
              </div>
            ) : (
              <div className="lista-comentarios">
                {comentarios.map(comentario => (
                  <div key={comentario.id} className="comentario">
                    <div className="encabezado-comentario">
                      <span className="usuario-comentario">{comentario.usuario}</span>
                      <span className="fecha-comentario">{comentario.fecha}</span>
                      {comentario.usuario === 'usuario_actual' && (
                        <button 
                          className="boton-eliminar-comentario"
                          onClick={() => manejarEliminarComentario(comentario.id)}
                          title="Eliminar comentario"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <p className="texto-comentario">{comentario.texto}</p>
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
                disabled={!nuevoComentario.trim()}
              >
                Comentar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalComentarios;
