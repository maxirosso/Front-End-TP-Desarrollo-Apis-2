import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CrearResena from '../../pages/CrearResena';
import { ProveedorResenas } from '../../contextos/ContextoResenas';
import { ProveedorAuth } from '../../contextos/ContextoAuth';

// Mock del contexto si CrearResena lo usa
// vi.mock('../../contextos/ContextoResenas', () => ({
//   useResenas: () => ({
//     agregarResena: vi.fn(),
//     usuarioActual: 1,
//     moviesAPI: { getAll: vi.fn().mockResolvedValue([]) },
//     cargando: false
//   })
// }));

// vi.mock('../../contextos/ContextoResenas', async () => {
//   const actual = await import('../../contextos/ContextoResenas');
//   return {
//     ...actual,
//     useResenas: () => ({
//       agregarResena: vi.fn(),
//       usuarioActual: 1,
//       moviesAPI: { getAll: vi.fn().mockResolvedValue([]) },
//       cargando: false
//     }),
//     ProveedorResenas: actual.ProveedorResenas // <-- agrega esto
//   };
// });

vi.mock('../../contextos/ContextoResenas', async () => {
  const actual = await import('../../contextos/ContextoResenas');
  return {
    ...actual,
    useResenas: () => ({
      agregarResena: vi.fn(),
      actualizarResena: vi.fn(), // <-- agrega esto
      reviewsAPI: {},            // <-- agrega esto
      usuarioActual: 1,
      moviesAPI: { getAll: vi.fn().mockResolvedValue([]) },
      cargando: false
    }),
    ProveedorResenas: actual.ProveedorResenas
  };
});

describe('CrearResena', () => {
it('renderiza 5 estrellas para calificar', () => {
  render(
    <MemoryRouter>
      <ProveedorAuth>
        <ProveedorResenas>
          <CrearResena />
        </ProveedorResenas>
      </ProveedorAuth>
    </MemoryRouter>
  );
  const estrellas = screen.getAllByRole('button', { name: /★/i });
  expect(estrellas).toHaveLength(5);
});
  it('permite seleccionar una calificación haciendo click en una estrella', () => {
    render(
      <MemoryRouter>
        <ProveedorAuth>
          <ProveedorResenas>
            <CrearResena />
          </ProveedorResenas>
        </ProveedorAuth>
      </MemoryRouter>
    );
    const estrellas = screen.getAllByRole('button', { name: /★/i });
    fireEvent.click(estrellas[2]); // Click en la tercera estrella
    expect(screen.getByText(/3\/5 estrellas/i)).toBeInTheDocument();
  });

  it('permite deseleccionar la calificación haciendo click dos veces en la misma estrella', () => {
    render(
      <MemoryRouter>
        <ProveedorAuth>
          <ProveedorResenas>

            <CrearResena />
          </ProveedorResenas>
        </ProveedorAuth>
      </MemoryRouter>
    );
    const estrellas = screen.getAllByRole('button', { name: /★/i });
    fireEvent.click(estrellas[1]); // Click en la segunda estrella
    expect(screen.getByText(/2\/5 estrellas/i)).toBeInTheDocument();
    fireEvent.click(estrellas[1]); // Click de nuevo en la segunda estrella
    expect(screen.getByText(/Sin estrellas/i)).toBeInTheDocument();
  });

  it('muestra el formulario para escribir reseña', () => {
    render(
      <MemoryRouter>
        <ProveedorAuth>
          <ProveedorResenas>
            <CrearResena />
          </ProveedorResenas>
        </ProveedorAuth>
      </MemoryRouter>
    );
    // Busca el textarea por label "Tu Reseña *" o por placeholder
    expect(screen.getByText(/Tu Reseña */i)).toBeInTheDocument();
    // Alternativa si el label no funciona:
    // expect(screen.getByPlaceholderText(/Comparte tu opinión/i)).toBeInTheDocument();

    // El botón debe decir "Publicar Reseña"
    expect(screen.getByRole('button', { name: /Publicar Reseña/i })).toBeInTheDocument();
  });
});