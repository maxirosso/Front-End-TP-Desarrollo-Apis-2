import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResenas } from '../../contextos/ContextoResenas';
import './SelectorUsuario.css';

const SelectorUsuario = () => {
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const { usersAPI } = useResenas();
  const navigate = useNavigate();

  const usuarios = [
    { id: 1, name: "usuario_actual", emoji: "👤" },
    { id: 2, name: "scifi_lover", emoji: "🚀" },
    { id: 3, name: "cinema_critic", emoji: "🎭" },
    { id: 4, name: "action_fan", emoji: "💥" }
  ];

  const cambiarUsuario = (userId) => {
    navigate(`/usuario/${userId}`);
    setMostrarSelector(false);
  };

  return (
    <div className="selector-usuario">
      <button 
        onClick={() => setMostrarSelector(!mostrarSelector)}
        className="btn-selector-usuario"
        title="Cambiar usuario (para testing)"
      >
        👤 Cambiar Usuario
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
                className="item-usuario"
              >
                <span className="emoji-usuario">{usuario.emoji}</span>
                <span className="nombre-usuario">{usuario.name}</span>
                <span className="id-usuario">ID: {usuario.id}</span>
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
