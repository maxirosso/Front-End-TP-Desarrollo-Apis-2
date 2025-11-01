import React from 'react';
import { render, act } from '@testing-library/react';
import { ProveedorAuth, useAuth } from '../../contextos/ContextoAuth';
import { vi } from 'vitest';

// Mocks de dependencias externas
vi.mock('../../services/api', () => ({
  authAPI: {
    login: vi.fn(),
  },
}));
vi.mock('../../utils/auth', () => ({
  saveToken: vi.fn(),
  getToken: vi.fn(),
  saveUser: vi.fn(),
  getUser: vi.fn(),
  clearAuth: vi.fn(),
  isTokenExpired: vi.fn(),
  decodeJWT: vi.fn(),
  hasRole: vi.fn(),
  hasPermission: vi.fn(),
  isAdmin: vi.fn(),
  isModerator: vi.fn(),
  isAdminOrModerator: vi.fn(),
  canEditResource: vi.fn(),
  canDeleteResource: vi.fn(),
  getFullName: vi.fn(),
  getUserInitials: vi.fn(),
  formatRole: vi.fn(),
  ROLES: { admin: 'admin', user: 'user' },
}));

// Importa los mocks para usarlos directamente
import * as authUtils from '../../utils/auth';
import { authAPI } from '../../services/api';

const mockUser = { id: 1, role: 'user', name: 'Test User' };
const mockToken = 'mock-token';

function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="usuario">{auth.usuario ? auth.usuario.name : 'null'}</span>
      <span data-testid="token">{auth.token || 'null'}</span>
      <span data-testid="cargando">{auth.cargando ? 'true' : 'false'}</span>
      <span data-testid="error">{auth.error || 'null'}</span>
      <button data-testid="login" onClick={() => auth.login({ email: 'test', password: '123' })}>Login</button>
      <button data-testid="logout" onClick={auth.logout}>Logout</button>
    </div>
  );
}

describe('ContextoAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authUtils.getToken.mockReturnValue(null);
    authUtils.getUser.mockReturnValue(null);
    authUtils.isTokenExpired.mockReturnValue(false);
    authUtils.decodeJWT.mockReturnValue(mockUser);
  });

  it('inicializa sin usuario ni token', () => {
    const { getByTestId } = render(
      <ProveedorAuth>
        <TestComponent />
      </ProveedorAuth>
    );
    expect(getByTestId('usuario').textContent).toBe('null');
    expect(getByTestId('token').textContent).toBe('null');
    expect(getByTestId('cargando').textContent).toBe('false');
  });

  it('login exitoso actualiza usuario y token', async () => {
    authAPI.login.mockResolvedValue({ access_token: mockToken });
    authUtils.decodeJWT.mockReturnValue(mockUser);

    const { getByTestId } = render(
      <ProveedorAuth>
        <TestComponent />
      </ProveedorAuth>
    );

    await act(async () => {
      await getByTestId('login').click();
    });

    expect(getByTestId('usuario').textContent).toBe('Test User');
    expect(getByTestId('token').textContent).toBe(mockToken);
    expect(getByTestId('error').textContent).toBe('null');
  });

  it('login fallido muestra error', async () => {
  authAPI.login.mockRejectedValue(new Error('Error al iniciar sesión'));

  const { getByTestId } = render(
    <ProveedorAuth>
      <TestComponent />
    </ProveedorAuth>
  );

  await act(async () => {
    getByTestId('login').click();
  });

  // Espera a que el error se muestre en el DOM
  expect(getByTestId('error').textContent).toBe('Error al iniciar sesión');
  expect(getByTestId('usuario').textContent).toBe('null');
});

  it('logout limpia usuario y token', async () => {
    authAPI.login.mockResolvedValue({ access_token: mockToken });
    authUtils.decodeJWT.mockReturnValue(mockUser);

    const { getByTestId } = render(
      <ProveedorAuth>
        <TestComponent />
      </ProveedorAuth>
    );

    await act(async () => {
      await getByTestId('login').click();
    });

    expect(getByTestId('usuario').textContent).toBe('Test User');
    await act(async () => {
      getByTestId('logout').click();
    });
    expect(getByTestId('usuario').textContent).toBe('null');
    expect(getByTestId('token').textContent).toBe('null');
  });

  it('estaAutenticado retorna true si usuario y token válidos', () => {
    authUtils.getToken.mockReturnValue(mockToken);
    authUtils.getUser.mockReturnValue(mockUser);
    authUtils.isTokenExpired.mockReturnValue(false);

    let ctx;
    function TestAuth() {
      ctx = useAuth();
      return null;
    }
    render(
      <ProveedorAuth>
        <TestAuth />
      </ProveedorAuth>
    );
    expect(ctx.estaAutenticado()).toBe(true);
  });

  it('tieneRol y tienePermiso llaman helpers', () => {
    authUtils.hasRole.mockReturnValue(true);
    authUtils.hasPermission.mockReturnValue(true);

    let ctx;
    function TestAuth() {
      ctx = useAuth();
      return null;
    }
    render(
      <ProveedorAuth>
        <TestAuth />
      </ProveedorAuth>
    );
    expect(ctx.tieneRol('user')).toBe(true);
    expect(ctx.tienePermiso('editar')).toBe(true);
  });
});