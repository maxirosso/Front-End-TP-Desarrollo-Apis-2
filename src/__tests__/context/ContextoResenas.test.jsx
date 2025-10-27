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

//   it('agrega una reseña en modo local', async () => {
//     const { getByTestId } = render(
//       <ProveedorResenas>
//         <TestComponent />
//       </ProveedorResenas>
//     );
//     await act(async () => {
//       getByTestId('agregar').click();
//     });
//     expect(Number(getByTestId('cantidad-resenas').textContent)).toBe(1);
//   });

//   it('actualiza y elimina una reseña en modo local', async () => {
//     let ctx;
//     function TestCrud() {
//       ctx = useResenas();
//       return <button data-testid="crud" />;
//     }
//     render(
//       <ProveedorResenas>
//         <TestCrud />
//       </ProveedorResenas>
//     );
//     // Agregar
//     await act(async () => {
//       await ctx.agregarResena({
//         titulo: 'Test',
//         calificacion: 5,
//         textoResena: 'Esta es una reseña de prueba con más de 20 caracteres.',
//         año: 2023,
//         genero: 'Drama'
//       });
//     });
//     expect(ctx.resenas.length).toBe(1);
//     // Actualizar
//     await act(async () => {
//       await ctx.actualizarResena(ctx.resenas[0].id, { titulo: 'Editado' });
//     });
//     expect(ctx.resenas[0].titulo).toBe('Editado');
//     // Eliminar
//     await act(async () => {
//       await ctx.eliminarResena(ctx.resenas[0].id);
//     });
//     expect(ctx.resenas.length).toBe(0);
//   });

//   it('toggleLikeResena cambia el estado de like', async () => {
//     let ctx;
//     function TestLike() {
//       ctx = useResenas();
//       return <button data-testid="like" />;
//     }
//     render(
//       <ProveedorResenas>
//         <TestLike />
//       </ProveedorResenas>
//     );
//     // Agregar reseña
//     await act(async () => {
//       await ctx.agregarResena({
//         titulo: 'Test',
//         calificacion: 5,
//         textoResena: 'Esta es una reseña de prueba con más de 20 caracteres.',
//         año: 2023,
//         genero: 'Drama'
//       });
//     });
//     const id = ctx.resenas[0].id;
//     expect(ctx.resenas[0].yaLeDiLike).toBe(false);
//     await act(async () => {
//       await ctx.toggleLikeResena(id);
//     });
//     expect(ctx.resenas[0].yaLeDiLike).toBe(true);
//     await act(async () => {
//       await ctx.toggleLikeResena(id);
//     });
//     expect(ctx.resenas[0].yaLeDiLike).toBe(false);
//   });
});