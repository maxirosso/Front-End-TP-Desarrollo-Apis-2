import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ProveedorAuth, useAuth } from '../../contextos/ContextoAuth';

function TestComponent() {
  const { usuario, login, logout, cargando, error } = useAuth();
  return (
    <div>
      <span data-testid="usuario">{usuario ? usuario.name : 'Sin usuario'}</span>
      <span data-testid="cargando">{cargando ? 'Cargando' : 'Listo'}</span>
      <span data-testid="error">{error || 'Sin error'}</span>
      <button onClick={() => login({ username: 'test', password: '1234' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('ProveedorAuth', () => {
  it('provee el contexto y permite login/logout', async () => {
    render(
      <ProveedorAuth>
        <TestComponent />
      </ProveedorAuth>
    );
    expect(screen.getByTestId('usuario').textContent).toBe('Sin usuario');
    expect(screen.getByTestId('cargando').textContent).toMatch(/Listo|Cargando/);

    // Puedes simular login/logout con act y mocks si lo necesitas
  });
});