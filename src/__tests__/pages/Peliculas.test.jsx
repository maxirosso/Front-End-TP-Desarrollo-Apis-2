import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Peliculas from '../../pages/Peliculas';
import { useResenas } from '../../contextos/ContextoResenas';

vi.mock('../../contextos/ContextoResenas');

const peliculasEjemplo = [
    {
        id: 1,
        title: "El Padrino",
        year: 1972,
        genre: "Drama",
        director: "Francis Ford Coppola",
        poster_url: "https://via.placeholder.com/300x450/2C3E50/ECF0F1?text=El+Padrino",
        description: "Una saga épica sobre una familia mafiosa italiana en América"
    }
];

describe('Peliculas', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra el spinner de carga al inicio', () => {
        useResenas.mockReturnValue({
            moviesAPI: { getAll: vi.fn() },
            usingBackend: false
        });

        render(
            <MemoryRouter>
                <Peliculas />
            </MemoryRouter>
        );

        expect(screen.getByText(/Cargando películas/i)).toBeInTheDocument();
    });

    // it('muestra las películas de ejemplo en modo offline', async () => {
    //     useResenas.mockReturnValue({
    //         moviesAPI: { getAll: vi.fn() },
    //         usingBackend: false
    //     });

    //     render(
    //         <MemoryRouter>
    //             <Peliculas />
    //         </MemoryRouter>
    //     );

    //     await waitFor(() => {
    //         expect(screen.getByText('El Padrino')).toBeInTheDocument();
    //         expect(screen.getByText(/Francis Ford Coppola/i)).toBeInTheDocument();
    //         expect(screen.getAllByText(/Drama/i).length).toBeGreaterThan(0); // Cambia aquí
    //         expect(screen.getByText(/Una saga épica/i)).toBeInTheDocument();
    //         expect(screen.getByText(/✏️ Escribir Reseña/i)).toBeInTheDocument();
    //         expect(screen.getByText(/📖 Ver Reseñas/i)).toBeInTheDocument();
    //     });
    // });

    // it('muestra mensaje de error si ocurre un fallo y no hay películas', async () => {
    //     useResenas.mockReturnValue({
    //         moviesAPI: { getAll: vi.fn().mockRejectedValue(new Error('Error')) },
    //         usingBackend: true
    //     });

    //     render(
    //         <MemoryRouter>
    //             <Peliculas />
    //         </MemoryRouter>
    //     );

    //     await waitFor(() => {
    //         // Verifica el mensaje de error dinámico
    //         // expect(screen.getByText(/Error al cargar las películas/i)).toBeInTheDocument();
    //         // Verifica el botón para reintentar
    //         expect(screen.getByText(/Intentar de nuevo/i)).toBeInTheDocument();
    //     });
    // });
    it('muestra el mensaje de "No hay películas disponibles" si la lista está vacía y no hay error', async () => {
        useResenas.mockReturnValue({
            moviesAPI: { getAll: vi.fn().mockResolvedValue([]) },
            usingBackend: true
        });

        render(
            <MemoryRouter>
                <Peliculas />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/No hay películas disponibles/i)).toBeInTheDocument();
            expect(screen.getByText(/Parece que no hay películas en el catálogo/i)).toBeInTheDocument();
        });
    });
});