import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Recomendaciones from '../../pages/Recomendaciones';
import { ProveedorAuth } from '../../contextos/ContextoAuth';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    usuario: { id: 1, name: 'Test', role: 'user', image_url: null, email: 'claqueta_critica' },
    estaAutenticado: () => true,
    logout: vi.fn(),
    getFullName: () => 'Test User',
    getUserInitials: () => 'TU',
    formatRole: () => 'Usuario'
  })
}));

const mockPeliculas = [
  { id: 1, title: 'Matrix', genre: 'ciencia-ficcion', poster_url: '', ratingPromedio: 4.5 },
  { id: 2, title: 'Titanic', genre: 'drama', poster_url: '', ratingPromedio: 4.2 },
  { id: 3, title: 'Mad Max', genre: 'accion', poster_url: '', ratingPromedio: 4.0 },
  { id: 4, title: 'Her', genre: 'romance', poster_url: '', ratingPromedio: 3.8 }
];

const mockResenas = [
  { id: 1, movie_id: 1, rating: 5, textoResena: 'Obra maestra', usuario: 'Juan', created_at: '2025-10-01' },
  { id: 2, movie_id: 2, rating: 4, textoResena: 'Muy emotiva', usuario: 'Ana', created_at: '2025-09-15' },
  { id: 3, movie_id: 3, rating: 4, textoResena: 'Acción sin parar', usuario: 'Luis', created_at: '2025-09-20' },
  { id: 4, movie_id: 4, rating: 3, textoResena: 'Bonita historia', usuario: 'Sofía', created_at: '2025-08-10' }
];

vi.mock('../../contextos/ContextoResenas', () => ({
  useResenas: () => ({
    usuarioActual: 1,
    resenas: mockResenas,
    moviesAPI: { getAll: vi.fn().mockResolvedValue(mockPeliculas) },
    cargando: false
  }),
}));

describe('Recomendaciones', () => {
  // it('muestra el loader cuando cargando es true', () => {
  //   vi.mocked(require('../../contextos/ContextoResenas').useResenas).mockReturnValue({
  //     usuarioActual: 1,
  //     resenas: [],
  //     moviesAPI: { getAll: vi.fn().mockResolvedValue([]) },
  //     cargando: true
  //   });
  //   render(
  //     <MemoryRouter>
  //       <ProveedorAuth>
  //         <Recomendaciones />
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );
  //   expect(screen.getByText(/Generando recomendaciones/i)).toBeInTheDocument();
  // });

  // it('renderiza películas populares y reseñas destacadas', async () => {
  //   render(
  //     <MemoryRouter>
  //       <ProveedorAuth>
  //         <Recomendaciones />
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText(/Más Populares/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Matrix/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Titanic/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Mad Max/i)).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText(/Reseñas Destacadas/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Obra maestra/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Muy emotiva/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Acción sin parar/i)).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText(/Recomendaciones por Género/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Ciencia Ficción/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Drama/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Acción/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Romance/i)).toBeInTheDocument();
  //   });
  // });

  it('muestra los botones de CTA', async () => {
    render(
      <MemoryRouter>
        <ProveedorAuth>
          <Recomendaciones />
        </ProveedorAuth>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/¿No encuentras lo que buscas?/i)).toBeInTheDocument();
      expect(screen.getByText(/Ver Todas las Películas/i)).toBeInTheDocument();
      expect(screen.getByText(/Escribir Reseña/i)).toBeInTheDocument();
    });
  });

  // it('muestra los iconos correctos para cada género', async () => {
  //   render(
  //     <MemoryRouter>
  //       <ProveedorAuth>
  //         <Recomendaciones />
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );
  //   await waitFor(() => {
  //     expect(screen.getByText(/🚀 Ciencia Ficción/i)).toBeInTheDocument();
  //     expect(screen.getByText(/🎭 Drama/i)).toBeInTheDocument();
  //     expect(screen.getByText(/💥 Acción/i)).toBeInTheDocument();
  //     expect(screen.getByText(/💕 Romance/i)).toBeInTheDocument();
  //   });
  // });

  // it('muestra el rating promedio en cada película popular', async () => {
  //   render(
  //     <MemoryRouter>
  //       <ProveedorAuth>
  //         <Recomendaciones />
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );
  //   await waitFor(() => {
  //     expect(screen.getByText(/⭐ 4.5/i)).toBeInTheDocument();
  //     expect(screen.getByText(/⭐ 4.2/i)).toBeInTheDocument();
  //     expect(screen.getByText(/⭐ 4.0/i)).toBeInTheDocument();
  //     expect(screen.getByText(/⭐ 3.8/i)).toBeInTheDocument();
  //   });
  // });

  // // Nuevos tests

  // it('muestra el enlace de ver reseñas en cada película popular', async () => {
  //   render(
  //     <MemoryRouter>
  //       <ProveedorAuth>
  //         <Recomendaciones />
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );
  //   await waitFor(() => {
  //     const links = screen.getAllByText(/Ver Reseñas/i);
  //     expect(links.length).toBeGreaterThanOrEqual(4);
  //     expect(links[0].closest('a')).toHaveAttribute('href');
  //   });
  // });

  it('muestra el mensaje de CTA correctamente', async () => {
    render(
      <MemoryRouter>
        <ProveedorAuth>
          <Recomendaciones />
        </ProveedorAuth>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Explora todo nuestro catálogo/i)).toBeInTheDocument();
      expect(screen.getByText(/contribuye con tus propias reseñas/i)).toBeInTheDocument();
    });
  });

  // it('muestra los mini ratings en recomendaciones por género', async () => {
  //   render(
  //     <MemoryRouter>
  //       <ProveedorAuth>
  //         <Recomendaciones />
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );
  //   await waitFor(() => {
  //     expect(screen.getAllByText(/⭐ 4.5/i).length).toBeGreaterThanOrEqual(1);
  //     expect(screen.getAllByText(/⭐ 4.2/i).length).toBeGreaterThanOrEqual(1);
  //     expect(screen.getAllByText(/⭐ 4.0/i).length).toBeGreaterThanOrEqual(1);
  //     expect(screen.getAllByText(/⭐ 3.8/i).length).toBeGreaterThanOrEqual(1);
  //   });
  // });

  it('muestra la cantidad de reseñas en cada película popular', async () => {
    render(
      <MemoryRouter>
        <ProveedorAuth>
          <Recomendaciones />
        </ProveedorAuth>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByText(/reseñas/i).length).toBeGreaterThanOrEqual(4);
    });
  });

  // it('muestra el póster de cada película popular', async () => {
  //   render(
  //     <MemoryRouter>
  //       <ProveedorAuth>
  //         <Recomendaciones />
  //       </ProveedorAuth>
  //     </MemoryRouter>
  //   );
  //   await waitFor(() => {
  //     const posters = screen.getAllByAltText(/Póster de/i);
  //     expect(posters.length).toBeGreaterThanOrEqual(4);
  //   });
  // });
});

// We recommend installing an extension to run vitest tests.