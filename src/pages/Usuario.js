import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';

const Usuario = () => {
  const navigate = useNavigate();
  const { usuarioActual } = useResenas();

  useEffect(() => {
    // Redirigir al perfil del usuario actual (desde el contexto)
    navigate(`/usuario/${usuarioActual}`);
  }, [navigate, usuarioActual]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      Redirigiendo a tu perfil...
    </div>
  );
};

export default Usuario;
