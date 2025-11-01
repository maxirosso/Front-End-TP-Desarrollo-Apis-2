import React from 'react';
import { render, act } from '@testing-library/react';
import { ProveedorResenas, useResenas } from '../../contextos/ContextoResenas';
import { vi } from 'vitest';

// Mock dependencias externas
vi.mock('../../contextos/ContextoAuth', () => ({
  useAuth: () => ({ usuario: { id: 1, user_id: 1 } }),
}));
vi.mock('../../services/api', () => ({
  reviewsAPI: {
    getAll: vi.fn().mockResolvedValue({ data: [] }),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    filter: vi.fn().mockResolvedValue({ data: [] }),
    getByUser: vi.fn().mockResolvedValue({ data: [] }),
  },
  usersAPI: {},
  moviesAPI: {
    getAll: vi.fn().mockResolvedValue([]),
    search: vi.fn().mockResolvedValue([]),
  },
  handleApiError: (err) => err.message || 'Error',
  checkBackendHealth: vi.fn().mockResolvedValue(false),
}));

function TestComponent() {
  const ctx = useResenas();
  return (
    <div>
      <span data-testid="usuario-actual">{ctx.usuarioActual}</span>
      <span data-testid="cantidad-resenas">{ctx.resenas.length}</span>
      <button data-testid="agregar" onClick={() => ctx.agregarResena({
        titulo: 'Test',
        calificacion: 5,
        textoResena: 'Esta es una reseña de prueba con más de 20 caracteres.',
        año: 2023,
        genero: 'Drama'
      })}>Agregar</button>
    </div>
  );
}

describe('ContextoResenas', () => {
  it('provee usuarioActual y resenas', () => {
    const { getByTestId } = render(
      <ProveedorResenas>
        <TestComponent />
      </ProveedorResenas>
    );
    expect(getByTestId('usuario-actual').textContent).toBe('1');
    expect(getByTestId('cantidad-resenas').textContent).toBe('0');
  });


});