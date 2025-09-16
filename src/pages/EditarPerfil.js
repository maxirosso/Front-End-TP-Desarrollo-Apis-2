import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResenas } from '../contextos/ContextoResenas';
import './EditarPerfil.css';

const EditarPerfil = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { usuarioActual, usersAPI, usingBackend } = useResenas();
  
  const [datosFormulario, setDatosFormulario] = useState({
    name: '',
    email: '',
    bio: '',
    profile_image: '',
    profileImageFile: null
  });
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});

  // Función para generar imagen placeholder simple (muy pequeña)
  const generarImagenPlaceholder = (texto) => {
    // En lugar de generar imagen, usar solo texto que se renderizará con CSS
    return `placeholder:${texto}`;
  };

  // Función para renderizar imagen de perfil
  const renderizarImagenPerfil = (imagenUrl, userId, className) => {
    if (!imagenUrl || imagenUrl.startsWith('placeholder:')) {
      const texto = imagenUrl ? imagenUrl.replace('placeholder:', '') : `U${userId}`;
      return (
        <div 
          className={`${className} placeholder-perfil`}
          style={{
            background: 'linear-gradient(135deg, #2C3E50, #34495E)',
            color: '#ECF0F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            borderRadius: '50%'
          }}
        >
          {texto}
        </div>
      );
    }
    
    return <img src={imagenUrl} alt="Foto de perfil" className={className} />;
  };

  const redimensionarImagen = (file, maxWidth = 50, maxHeight = 50, quality = 0.1) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Hacer imagen cuadrada para foto de perfil
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        
        // Dibujar imagen cuadrada redimensionada
        ctx.drawImage(img, startX, startY, size, size, 0, 0, maxWidth, maxHeight);
        
        // Convertir a base64 con máxima compresión
        const dataURL = canvas.toDataURL('image/jpeg', quality);
        
        console.log('🔍 Imagen redimensionada:', {
          dimensiones: `${maxWidth}x${maxHeight}`,
          calidad: quality,
          tamaño: dataURL.length + ' caracteres'
        });
        
        resolve(dataURL);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const cargarDatosUsuario = useCallback(async () => {
    setCargando(true);
    const targetUserId = userId ? parseInt(userId) : usuarioActual;
    
    try {
      if (usingBackend) {
        const userData = await usersAPI.getById(targetUserId);
        setDatosFormulario({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          profile_image: userData.profile_image || generarImagenPlaceholder(`U${targetUserId}`),
          profileImageFile: null
        });
      } else {
        // Datos mock para modo offline
        const targetUserId = userId ? parseInt(userId) : usuarioActual;
        const mockUser = {
          name: targetUserId === 1 ? 'Admin' : 
                targetUserId === 2 ? 'Juan Pérez' :
                targetUserId === 3 ? 'María García' :
                targetUserId === 4 ? 'Carlos López' :
                targetUserId === 5 ? 'Ana Martín' :
                targetUserId === 6 ? 'Luis Rodríguez' : `Usuario ${targetUserId}`,
          email: targetUserId === 1 ? 'admin@moviereviews.com' :
                 targetUserId === 2 ? 'juan@example.com' :
                 targetUserId === 3 ? 'maria@example.com' :
                 targetUserId === 4 ? 'carlos@example.com' :
                 targetUserId === 5 ? 'ana@example.com' :
                 targetUserId === 6 ? 'luis@example.com' : `usuario${targetUserId}@example.com`,
          bio: targetUserId === 1 ? 'Administrador del sistema de reseñas' :
               targetUserId === 2 ? 'Amante del cine y crítico ocasional' :
               targetUserId === 3 ? 'Especialista en ciencia ficción' :
               targetUserId === 4 ? 'Crítico profesional de cine' :
               targetUserId === 5 ? 'Fan de películas de acción' :
               targetUserId === 6 ? 'Cinéfilo y coleccionista' : 'Amante del cine',
          profile_image: generarImagenPlaceholder(`U${targetUserId}`)
        };
        
        setDatosFormulario({
          name: mockUser.name,
          email: mockUser.email,
          bio: mockUser.bio,
          profile_image: mockUser.profile_image,
          profileImageFile: null
        });
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      alert('Error al cargar los datos del perfil');
    } finally {
      setCargando(false);
    }
  }, [userId, usuarioActual, usingBackend, usersAPI]);

  // Verificar que el usuario solo pueda editar su propio perfil
  useEffect(() => {
    const targetUserId = userId ? parseInt(userId) : usuarioActual;
    
    if (targetUserId !== usuarioActual) {
      navigate('/usuario'); // Redirigir si intenta editar otro perfil
      return;
    }
    
    cargarDatosUsuario();
  }, [userId, usuarioActual, navigate, cargarDatosUsuario]);

  const manejarCambioImagen = async (evento) => {
    const archivo = evento.target.files[0];
    if (archivo) {
      // Validar que sea una imagen
      if (!archivo.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 5MB');
        return;
      }
      
      try {
        // Redimensionar y comprimir imagen
        const imagenComprimida = await redimensionarImagen(archivo);
        
        // Validar que la imagen no sea demasiado grande para la base de datos
        if (imagenComprimida.length > 400) { // Muy estricto
          // Intentar compresión ultra agresiva
          console.warn('⚠️ Primera compresión demasiado grande, intentando ultra compresión...');
          const imagenUltraComprimida = await redimensionarImagen(archivo, 30, 30, 0.05);
          
          if (imagenUltraComprimida.length > 400) {
            alert('La imagen es demasiado compleja. Por favor usa una imagen más simple con menos detalles.');
            return;
          }
          
          console.log('✅ Imagen ultra comprimida:', imagenUltraComprimida.length, 'caracteres');
          setDatosFormulario(prev => ({
            ...prev,
            profile_image: imagenUltraComprimida,
            profileImageFile: archivo
          }));
        } else {
          console.log('✅ Imagen comprimida correctamente:', imagenComprimida.length, 'caracteres');
          setDatosFormulario(prev => ({
            ...prev,
            profile_image: imagenComprimida,
            profileImageFile: archivo
          }));
        }
      } catch (error) {
        console.error('Error procesando imagen:', error);
        alert('Error al procesar la imagen. Inténtalo de nuevo.');
      }
    }
  };

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

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.name.trim()) {
      nuevosErrores.name = 'El nombre es obligatorio';
    }

    if (!datosFormulario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(datosFormulario.email)) {
      nuevosErrores.email = 'El email no tiene un formato válido';
    }

    if (datosFormulario.bio && datosFormulario.bio.length > 500) {
      nuevosErrores.bio = 'La biografía no puede exceder 500 caracteres';
    }

    // Validar que la imagen no sea demasiado grande para la base de datos
    if (datosFormulario.profile_image && 
        !datosFormulario.profile_image.startsWith('placeholder:') && 
        datosFormulario.profile_image.length > 400) {
      nuevosErrores.profile_image = 'La imagen es demasiado grande. Intenta con una imagen más simple.';
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
      const datosActualizacion = {
        name: datosFormulario.name.trim(),
        email: datosFormulario.email.trim(),
        bio: datosFormulario.bio.trim(),
        profile_image: datosFormulario.profile_image
      };

      // Debug: mostrar tamaño de la imagen
      if (datosActualizacion.profile_image && !datosActualizacion.profile_image.startsWith('placeholder:')) {
        console.log('📏 Tamaño de imagen base64:', datosActualizacion.profile_image.length, 'caracteres');
        
        // Si la imagen es demasiado grande, no enviarla
        if (datosActualizacion.profile_image.length > 400) {
          console.warn('⚠️ Imagen demasiado grande, omitiendo del envío');
          alert('La imagen es demasiado grande. Guardando perfil sin cambiar la foto.');
          delete datosActualizacion.profile_image;
        }
      }

      if (usingBackend) {
        const targetUserId = userId ? parseInt(userId) : usuarioActual;
        await usersAPI.update(targetUserId, datosActualizacion);
        alert('¡Perfil actualizado exitosamente! 🎉');
      } else {
        // En modo offline, solo mostrar confirmación
        alert('¡Perfil actualizado exitosamente! 🎉 (Modo offline)');
      }

      // Redirigir al perfil del usuario
      const targetUserId = userId ? parseInt(userId) : usuarioActual;
      navigate(`/usuario/${targetUserId}`);
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Hubo un problema al actualizar el perfil. Probá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="pagina-editar-perfil">
        <div className="contenedor-editar-perfil">
          <div className="estado-carga">
            <h2>Cargando datos del perfil...</h2>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-editar-perfil">
      <div className="contenedor-editar-perfil">
        <header className="encabezado-editar-perfil">
          <h1 className="titulo-editar-perfil">Editar mi Perfil</h1>
          <p className="subtitulo-editar-perfil">
            Actualiza tu información personal y foto de perfil
          </p>
        </header>

        <form className="formulario-editar-perfil" onSubmit={manejarEnvio}>
          {/* Foto de perfil */}
          <section className="seccion-foto-perfil">
            <h3 className="subtitulo-seccion">Foto de Perfil</h3>
            <div className="contenedor-imagen-perfil">
              <div className="contenedor-imagen">
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarCambioImagen}
                  className="entrada-archivo"
                  disabled={enviando}
                  id="profile-image-upload"
                />
                <label htmlFor="profile-image-upload" className="boton-subir-imagen">
                  📷 Cambiar Foto
                </label>
                <div className="vista-previa-perfil">
                  {renderizarImagenPerfil(
                    datosFormulario.profile_image || generarImagenPlaceholder(`U${userId ? parseInt(userId) : usuarioActual}`),
                    userId ? parseInt(userId) : usuarioActual,
                    "imagen-perfil-previa"
                  )}
                  {datosFormulario.profileImageFile && (
                    <button 
                      type="button"
                      onClick={() => setDatosFormulario(prev => ({...prev, profile_image: '', profileImageFile: null}))}
                      className="boton-remover-imagen"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {errores.profile_image && <span className="mensaje-error">{errores.profile_image}</span>}
            </div>
          </section>

          {/* Información personal */}
          <section className="seccion-informacion">
            <h3 className="subtitulo-seccion">Información Personal</h3>
            
            <div className="campo-formulario">
              <label className="etiqueta-campo">Nombre *</label>
              <input
                type="text"
                value={datosFormulario.name}
                onChange={(e) => manejarCambioEntrada('name', e.target.value)}
                className={`entrada-texto ${errores.name ? 'error' : ''}`}
                placeholder="Tu nombre completo"
                disabled={enviando}
              />
              {errores.name && <span className="mensaje-error">{errores.name}</span>}
            </div>

            <div className="campo-formulario">
              <label className="etiqueta-campo">Email *</label>
              <input
                type="email"
                value={datosFormulario.email}
                onChange={(e) => manejarCambioEntrada('email', e.target.value)}
                className={`entrada-texto ${errores.email ? 'error' : ''}`}
                placeholder="tu@email.com"
                disabled={enviando}
              />
              {errores.email && <span className="mensaje-error">{errores.email}</span>}
            </div>

            <div className="campo-formulario">
              <label className="etiqueta-campo">Biografía</label>
              <textarea
                value={datosFormulario.bio}
                onChange={(e) => manejarCambioEntrada('bio', e.target.value)}
                className={`entrada-textarea ${errores.bio ? 'error' : ''}`}
                placeholder="Cuéntanos un poco sobre ti y tus gustos cinematográficos..."
                rows={4}
                maxLength={500}
                disabled={enviando}
              />
              <div className="info-textarea">
                <span className={`contador-caracteres ${datosFormulario.bio.length > 450 ? 'cerca-limite' : ''}`}>
                  {datosFormulario.bio.length}/500 caracteres
                </span>
              </div>
              {errores.bio && <span className="mensaje-error">{errores.bio}</span>}
            </div>
          </section>

          {/* Botones de acción */}
          <div className="botones-editar-perfil">
            <button 
              type="button" 
              className="boton-cancelar"
              onClick={() => navigate(`/usuario/${userId ? parseInt(userId) : usuarioActual}`)}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="boton-guardar"
              disabled={enviando}
            >
              {enviando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;