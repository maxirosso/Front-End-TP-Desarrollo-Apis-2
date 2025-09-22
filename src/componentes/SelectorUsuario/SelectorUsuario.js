import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResenas } from '../../contextos/ContextoResenas';
import './SelectorUsuario.css';

const SelectorUsuario = () => {
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const { setUsuarioActual, usuarioActual } = useResenas();
  const navigate = useNavigate();

  const usuarios = [
    { id: 1, name: "Admin", emoji: "👤" },
    { id: 2, name: "Juan Pérez", emoji: "🚀" },
    { id: 3, name: "María García", emoji: "🎭" },
    { id: 4, name: "Carlos López", emoji: "💥" },
    { id: 5, name: "Ana Martín", emoji: "🎬" },
    { id: 6, name: "Luis Rodríguez", emoji: "🎞️" }
  ];

  const cambiarUsuario = (userId) => {
    setUsuarioActual(userId); // Actualizar usuario actual en el contexto
    navigate(`/usuario/${userId}`);
    setMostrarSelector(false);
  };

  const usuarioActualData = usuarios.find(u => u.id === usuarioActual) || usuarios[0];

  return (
    <div className="selector-usuario">
      <button 
        onClick={() => setMostrarSelector(!mostrarSelector)}
        className="btn-selector-usuario"
        title="Cambiar usuario (para testing)"
      >
        {usuarioActualData.emoji} {usuarioActualData.name}
      </button>
      
      {mostrarSelector && (
        <>
          <div 
            className="overlay-selector"
            onClick={() => setMostrarSelector(false)}
          ></div>
          <div className="dropdown-usuarios">
            <div className="header-dropdown">
              <h4>Seleccionar Usuario</h4>
              <span className="info-testing">(Para testing)</span>
            </div>
            {usuarios.map(usuario => (
              <button
                key={usuario.id}
                onClick={() => cambiarUsuario(usuario.id)}
                className={`item-usuario ${usuario.id === usuarioActual ? 'activo' : ''}`}
              >
                <span className="emoji-usuario">{usuario.emoji}</span>
                <span className="nombre-usuario">{usuario.name}</span>
                <span className="id-usuario">ID: {usuario.id}</span>
                {usuario.id === usuarioActual && <span className="indicador-activo">●</span>}
              </button>
            ))}
            <div className="footer-dropdown">
              <small>
                💡 También puedes ir directamente a: <br/>
                <code>/usuario/1</code>, <code>/usuario/2</code>, etc.
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectorUsuario;
