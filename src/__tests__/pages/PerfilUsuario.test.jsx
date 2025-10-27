import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PerfilUsuario from '../../pages/PerfilUsuario';
import { ProveedorResenas } from '../../contextos/ContextoResenas';
import { ProveedorAuth } from '../../contextos/ContextoAuth';
import { useResenas } from '../../contextos/ContextoResenas';

// 🧩 Mock de dependencias
// vi.mock('../contextos/ContextoResenas');
vi.mock('../componentes/TarjetaResena/TarjetaResena', () => ({
  default: ({ pelicula }) => <div data-testid="tarjeta-resena">{pelicula.titulo}</div>
}));
vi.mock('../componentes/LoadingSpinner/LoadingSpinner', () => ({
  default: ({ mensaje }) => <div data-testid="spinner">{mensaje}</div>
}));

// vi.mock('../../contextos/ContextoResenas', () => ({ useResenas: vi.fn() }));

vi.mock('../../contextos/ContextoResenas', async () => {
  const actual = await import('../../contextos/ContextoResenas');
  return {
    ...actual,
    useResenas: vi.fn(),
    ProveedorResenas: actual.ProveedorResenas // <-- agrega el provider real
  };
});

describe('PerfilUsuario', () => {
  const mockObtenerResenas = vi.fn();
  const mockEliminarResena = vi.fn();
  const mockToggleLike = vi.fn();
  const mockSetError = vi.fn();
  const mockSetUsuarioActual = vi.fn();

  const baseContext = {
    usuarioActual: 1,
    usingBackend: false,
    usersAPI: { getById: vi.fn() },
    obtenerResenasPorUsuario: mockObtenerResenas,
    eliminarResena: mockEliminarResena,
    toggleLikeResena: mockToggleLike,
    error: null,
    setError: mockSetError,
    setUsuarioActual: mockSetUsuarioActual,

  };

  const renderPerfil = (userId = '1', extraContext = {}) => {
    useResenas.mockReturnValue({ ...baseContext, ...extraContext });
    return render(
      <MemoryRouter initialEntries={[`/perfil/${userId}`]}>
        <ProveedorAuth>
          <ProveedorResenas>
            <Routes>
              <Route path="/perfil/:userId" element={<PerfilUsuario />} />
            </Routes>
          </ProveedorResenas>
        </ProveedorAuth>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el spinner de carga al inicio', () => {
    renderPerfil();
    expect(screen.getByText(/Cargando perfil de usuario/i)).toBeInTheDocument();
  });

  // it('carga y muestra los datos mock del usuario', async () => {
  //   mockObtenerResenas.mockResolvedValueOnce([{ id: 1, titulo: 'Matrix', likes_count: 2 }]);

  //   renderPerfil('2');

  //   await waitFor(() => {
  //     expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  //   });

  //   expect(screen.getByText('Reseñas de Juan Pérez')).toBeInTheDocument();
  //   expect(screen.getByTestId('tarjeta-resena')).toHaveTextContent('Matrix');
  // });

  // it('muestra el mensaje "Usuario no encontrado" si el usuario no existe', async () => {
  //   useResenas.mockReturnValue({
  //     ...baseContext,
  //     usuario: null,
  //     resenasUsuario: [], // <-- asegúrate que siempre sea un array
  //   });

  //   render(
  //     <MemoryRouter initialEntries={['/perfil/85552']}>
  //       <ProveedorAuth>
  //         <ProveedorResenas>
  //           <Routes>
  //             <Route path="/perfil/:userId" element={<PerfilUsuario />} />
  //           </Routes>
  //         </ProveedorResenas>
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText(/Usuario no encontrado/i)).toBeInTheDocument();
  //     expect(screen.getByText(/El usuario que buscas no existe o ha sido eliminado/i)).toBeInTheDocument();
  //     expect(screen.getByRole('link', { name: /Volver al inicio/i })).toBeInTheDocument();
  //   });
  // });

  it('muestra mensaje de error si ocurre una falla', async () => {
    const errorMsg = 'Error cargando perfil: fallo de red';
    renderPerfil('1', { error: errorMsg, resenasUsuario: [] }); // <-- agrega resenasUsuario

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay reseñas', async () => {
    mockObtenerResenas.mockResolvedValueOnce([]);
    renderPerfil('1');

    await waitFor(() => {
      expect(screen.getByText('Sin reseñas aún')).toBeInTheDocument();
    });

    expect(screen.getByText('Escribir primera reseña')).toBeInTheDocument();
  });

  // it('cambia el orden de reseñas al seleccionar otra opción', async () => {
  //   mockObtenerResenas.mockResolvedValueOnce([{ id: 1, titulo: 'Matrix' }]);
  //   renderPerfil('1');

  //   await waitFor(() => {
  //     expect(screen.getByText('Matrix')).toBeInTheDocument();
  //   });

  //   const select = screen.getByLabelText('Ordenar por:');
  //   fireEvent.change(select, { target: { value: 'rating_desc' } });

  //   await waitFor(() => {
  //     expect(mockObtenerResenas).toHaveBeenCalled();
  //   });
  // });

  // it('muestra el nombre y el email del usuario en el perfil', async () => {
  //   useResenas.mockReturnValue({
  //     ...baseContext,
  //     usuarioActual: 2,
  //     usuario: {
  //       id: 2,
  //       name: 'Juan Pérez',
  //       email: 'juan@example.com',
  //       profile_image: 'https://via.placeholder.com/100x100/2C3E50/ECF0F1?text=U2',
  //       bio: 'Amante del cine y crítico ocasional',
  //       created_at: '2025-09-01T10:00:00Z'
  //     },
  //     resenasUsuario: [], // <-- solo aquí
  //   });

  //   render(
  //     <MemoryRouter initialEntries={['/perfil/2']}>
  //       <ProveedorAuth>
  //         <ProveedorResenas>
  //           <Routes>
  //             <Route path="/perfil/:userId" element={<PerfilUsuario />} />
  //           </Routes>
  //         </ProveedorResenas>
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  //     expect(screen.getByText('juan@example.com')).toBeInTheDocument();
  //   });
  // });


  // it('actualiza likes al presionar toggleLike', async () => {
  //   const reseña = { id: 1, titulo: 'Matrix', likes_count: 3, yaLeDiLike: false };
  //   mockObtenerResenas.mockResolvedValueOnce([reseña]);

  //   renderPerfil('1', { resenasUsuario: [] }); // <-- agrega esto

  //   await waitFor(() => {
  //     expect(screen.getByText('Matrix')).toBeInTheDocument();
  //   });

  //   // Llamar manualmente el evento
  //   window.dispatchEvent(new CustomEvent('resenasActualizadas', { detail: { id: 1 } }));

  //   await waitFor(() => {
  //     expect(mockObtenerResenas).toHaveBeenCalledTimes(2);
  //   });
  // });
});
