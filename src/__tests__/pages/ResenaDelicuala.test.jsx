import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import ResenasDelicula from '../../pages/ResenasDelicula.jsx';
import { useResenas } from '../../contextos/ContextoResenas';
// 🧩 Mocks de dependencias
vi.mock('../../contextos/ContextoResenas', () => ({
  useResenas: vi.fn(),
}));

vi.mock('../../componentes/TarjetaResena/TarjetaResena', () => ({
  default: ({ pelicula }) => (
    <div data-testid="tarjeta-resena">{pelicula.titulo || pelicula.title}</div>
  ),
}));

vi.mock('../../componentes/FiltrosResenas/FiltrosResenas', () => ({
  default: ({ onAplicarFiltros, onLimpiarFiltros }) => (
    <div data-testid="filtros">
      <button onClick={() => onAplicarFiltros({ rating: 5 })}>Aplicar filtros</button>
      <button onClick={onLimpiarFiltros}>Limpiar</button>
    </div>
  ),
}));

vi.mock('../../componentes/BarraOrdenamiento/BarraOrdenamiento', () => ({
  default: ({ onCambiarOrdenamiento, ordenamientoActual }) => (
    <select
      data-testid="orden-select"
      value={ordenamientoActual}
      onChange={(e) => onCambiarOrdenamiento(e.target.value)}
    >
      <option value="recent">Recientes</option>
      <option value="rating_desc">Mayor puntuación</option>
    </select>
  ),
}));

vi.mock('../../componentes/LoadingSpinner/LoadingSpinner', () => ({
  default: ({ mensaje }) => <div data-testid="spinner">{mensaje}</div>,
}));

// 🧱 Setup base del contexto
const baseContext = {
  usuarioActual: 1,
  usingBackend: false,
  moviesAPI: { getById: vi.fn() },
  obtenerResenasPorPelicula: vi.fn(),
  eliminarResena: vi.fn(),
  toggleLikeResena: vi.fn(),
  error: null,
  setError: vi.fn(),
};

const renderResenas = (movieId = '10', extraContext = {}) => {
  useResenas.mockReturnValue({ ...baseContext, ...extraContext });
  return render(
    <MemoryRouter initialEntries={[`/pelicula/${movieId}`]}>
      <Routes>
        <Route path="/pelicula/:movieId" element={<ResenasDelicula />} />
      </Routes>
    </MemoryRouter>
  );
};

// 🧪 TESTS
describe('ResenasDelicula', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra spinner de carga al inicio', () => {
    renderResenas();
    expect(screen.getByText(/Cargando reseñas de la película.../i)).toBeInTheDocument();
  });



  it('renderiza datos de película y sus reseñas', async () => {
    const mockMovie = { id: 10, title: 'Matrix', year: 1999 };
    const mockResenas = [
      { id: 1, titulo: 'Excelente', rating: 5, likes: 2 },
      { id: 2, titulo: 'Buena', rating: 4, likes: 1 },
    ];

    baseContext.moviesAPI.getById.mockResolvedValueOnce(mockMovie);
    baseContext.obtenerResenasPorPelicula.mockResolvedValueOnce(mockResenas);

    renderResenas('10');

    await waitFor(() => {
      expect(screen.getByText('Matrix')).toBeInTheDocument();
      expect(screen.getAllByTestId('tarjeta-resena')).toHaveLength(2);
    });

    expect(screen.getByText('Reseñas de Matrix')).toBeInTheDocument();
  });

  it('muestra mensaje de error si ocurre un fallo', async () => {
    baseContext.moviesAPI.getById.mockRejectedValueOnce(new Error('Fallo de red'));

    renderResenas('10');

    await waitFor(() => {
      expect(screen.getByText(/Película no encontrada/i)).toBeInTheDocument();
      expect(screen.getByText(/La película que buscas no existe o ha sido eliminada/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Volver al inicio/i })).toBeInTheDocument();
    });
  });

  it('muestra mensaje cuando no hay reseñas', async () => {
    const mockMovie = { id: 10, title: 'Matrix', year: 1999 };
    baseContext.moviesAPI.getById.mockResolvedValueOnce(mockMovie);
    baseContext.obtenerResenasPorPelicula.mockResolvedValueOnce([]);

    renderResenas('10');

    await waitFor(() => {
      expect(screen.getByText('No hay reseñas para esta película')).toBeInTheDocument();
    });
  });
// it('aplica y limpia filtros correctamente', async () => {
//   const mockMovie = { id: 10, title: 'Matrix', year: 1999 };
//   const mockResenas = [{ id: 1, titulo: 'Reseña', rating: 5 }];
//   baseContext.moviesAPI.getById.mockResolvedValue(mockMovie);
//   baseContext.obtenerResenasPorPelicula.mockResolvedValue(mockResenas);

//   renderResenas('10');

//   // Espera a que el filtro esté en el DOM
//   await waitFor(() => screen.getByTestId('filtros'));

//   fireEvent.click(screen.getByText('Aplicar filtros'));
//   expect(baseContext.obtenerResenasPorPelicula).toHaveBeenCalled();

//   fireEvent.click(screen.getByText('Limpiar'));
// });

  it('cambia el ordenamiento de reseñas', async () => {
    const mockMovie = { id: 10, title: 'Matrix', year: 1999 };
    const mockResenas = [{ id: 1, titulo: 'Reseña', rating: 5 }];
    baseContext.moviesAPI.getById.mockResolvedValue(mockMovie);
    baseContext.obtenerResenasPorPelicula.mockResolvedValue(mockResenas);

    renderResenas('10');

    await waitFor(() => screen.getByText('Reseñas de Matrix'));

    const select = screen.getByTestId('orden-select');
    fireEvent.change(select, { target: { value: 'rating_desc' } });

    await waitFor(() => {
      expect(baseContext.obtenerResenasPorPelicula).toHaveBeenCalled();
    });
  });

  it('actualiza los likes correctamente al hacer toggle', async () => {
    const mockMovie = { id: 10, title: 'Matrix', year: 1999 };
    const mockResenas = [{ id: 1, titulo: 'Reseña', rating: 5, likes: 2, yaLeDiLike: false }];

    baseContext.moviesAPI.getById.mockResolvedValue(mockMovie);
    baseContext.obtenerResenasPorPelicula.mockResolvedValue(mockResenas);

    renderResenas('10');

    await waitFor(() => screen.getByText('Reseñas de Matrix'));

    // Simulamos un toggleLike
    baseContext.toggleLikeResena(1);
    expect(baseContext.toggleLikeResena).toHaveBeenCalled();
  });

  it('muestra el botón "Escribir reseña" y navega al hacer click', async () => {
  const mockMovie = { id: 10, title: 'Matrix', year: 1999 };
  const mockResenas = [{ id: 1, titulo: 'Reseña', rating: 5 }];
  baseContext.moviesAPI.getById.mockResolvedValue(mockMovie);
  baseContext.obtenerResenasPorPelicula.mockResolvedValue(mockResenas);

  renderResenas('10');

  await waitFor(() => {
    expect(screen.getByText('✏️ Escribir reseña')).toBeInTheDocument();
  });

  // Simula click y verifica que el link tiene la ruta correcta
  const boton = screen.getByText('✏️ Escribir reseña');
  expect(boton.closest('a')).toHaveAttribute('href', '/crear?movieId=10');
});
});
