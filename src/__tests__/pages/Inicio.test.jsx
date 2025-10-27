import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Inicio from '../../pages/Inicio';
import { useResenas } from '../../contextos/ContextoResenas';

vi.mock('../../contextos/ContextoResenas');
vi.mock('../../componentes/TarjetaResena/TarjetaResena', () => ({
  default: ({ pelicula }) => <div data-testid="tarjeta-resena">{pelicula.titulo || pelicula.title}</div>,
}));
vi.mock('../../componentes/FiltrosResenas/FiltrosResenas', () => ({
  default: () => <div data-testid="filtros">Filtros</div>,
}));
vi.mock('../../componentes/BarraOrdenamiento/BarraOrdenamiento', () => ({
  default: () => <div data-testid="ordenamiento">Ordenamiento</div>,
}));
vi.mock('../../componentes/ModalComentarios/ModalComentarios', () => ({
  default: () => <div data-testid="modal-comentarios">Modal Comentarios</div>,
}));

const baseContext = {
  resenas: [],
  cargando: false,
  filtrosActivos: {},
  ordenamientoActual: 'recent',
  usuarioActual: 1,
  setFiltrosActivos: vi.fn(),
  setOrdenamientoActual: vi.fn(),
  eliminarResena: vi.fn(),
  toggleLikeResena: vi.fn(),
  agregarComentario: vi.fn(),
  aplicarFiltros: vi.fn().mockResolvedValue([]),
  aplicarOrdenamiento: vi.fn((resenas) => resenas),
  usingBackend: false,
};

describe('Inicio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el spinner de carga al inicio', () => {
    useResenas.mockReturnValue({ ...baseContext, cargando: true });
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cargando las reseñas más copadas/i)).toBeInTheDocument();
  });

  it('muestra el hero con el título principal y los botones', () => {
    useResenas.mockReturnValue(baseContext);
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Descubrí, Reseñá, Compartí/i })).toBeInTheDocument();
    expect(screen.getByText(/Sumate a la comunidad cinéfila/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Escribir mi Reseña/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver todas las Pelis/i })).toBeInTheDocument();
  });

  it('muestra mensaje de estado vacío si no hay reseñas', async () => {
    useResenas.mockReturnValue({ ...baseContext, resenas: [], cargando: false });
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/No encontramos ninguna reseña/i)).toBeInTheDocument();
      expect(screen.getByText(/Probá ajustando los filtros/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Escribir la primera reseña/i })).toBeInTheDocument();
    });
  });

//   it('muestra la lista de reseñas si hay datos', async () => {
//     const mockResenas = [
//       { id: 1, titulo: 'Matrix', movie_title: 'Matrix', usuario: 'Neo', calificacion: 5 },
//       { id: 2, titulo: 'Blade Runner', movie_title: 'Blade Runner', usuario: 'Deckard', calificacion: 4 }
//     ];
//     useResenas.mockReturnValue({
//       ...baseContext,
//       resenas: mockResenas,
//       aplicarFiltros: vi.fn().mockResolvedValue(mockResenas),
//       aplicarOrdenamiento: vi.fn((resenas) => resenas),
//     });

//     render(
//       <MemoryRouter>
//         <Inicio />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId('tarjeta-resena')).toBeInTheDocument();
//       expect(screen.getByText('Matrix')).toBeInTheDocument();
//       expect(screen.getByText('Blade Runner')).toBeInTheDocument();
//     });
//   });

  it('muestra el título de resultados si hay filtro activo', () => {
    useResenas.mockReturnValue({
      ...baseContext,
      filtrosActivos: { pelicula: 'Matrix' },
      resenas: [],
    });
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );
    expect(screen.getByText(/Resultados para: "Matrix"/i)).toBeInTheDocument();
  });
});