import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Navigate, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import ProtectedRoute from '../../componentes/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../../contextos/ContextoAuth';

vi.mock('../../contextos/ContextoAuth');
vi.mock('../../componentes/LoadingSpinner/LoadingSpinner', () => ({
  default: () => <div data-testid="spinner">Cargando...</div>,
}));

const mockAuth = {
  estaAutenticado: vi.fn(),
  tieneRol: vi.fn(),
  tienePermiso: vi.fn(),
  cargando: false,
  usuario: { role: 'user' },
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el spinner si está cargando', () => {
    useAuth.mockReturnValue({ ...mockAuth, cargando: true });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

//   it('redirige al login si no está autenticado', () => {
//     useAuth.mockReturnValue({ ...mockAuth, estaAutenticado: () => false });
//     render(
//       <MemoryRouter>
//         <ProtectedRoute>
//           <div>Contenido protegido</div>
//         </ProtectedRoute>
//       </MemoryRouter>
//     );
//     expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
//   });

  it('muestra acceso denegado si no tiene el rol requerido', () => {
    useAuth.mockReturnValue({
      ...mockAuth,
      estaAutenticado: () => true,
      tieneRol: () => false,
      usuario: { role: 'user' },
    });
    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="admin">
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText(/Acceso Denegado/i)).toBeInTheDocument();
    expect(screen.getByText(/Rol requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu rol actual/i)).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('muestra acceso denegado si no tiene el permiso requerido', () => {
    useAuth.mockReturnValue({
      ...mockAuth,
      estaAutenticado: () => true,
      tieneRol: () => true,
      tienePermiso: () => false,
    });
    render(
      <MemoryRouter>
        <ProtectedRoute requiredPermission="editar">
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText(/Acceso Denegado/i)).toBeInTheDocument();
    expect(screen.getByText(/Permiso requerido/i)).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('muestra el contenido si pasa todas las verificaciones', () => {
    useAuth.mockReturnValue({
      ...mockAuth,
      estaAutenticado: () => true,
      tieneRol: () => true,
      tienePermiso: () => true,
    });
    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="user" requiredPermission="editar">
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});