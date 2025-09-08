import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Usuario = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al perfil del usuario actual (ID 1 por defecto)
    // En una app real, esto vendría del contexto de autenticación
    const usuarioActual = 1;
    navigate(`/usuario/${usuarioActual}`);
  }, [navigate]);

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
