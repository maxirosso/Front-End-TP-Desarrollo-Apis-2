import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import PeliculaDetalle from '../../pages/PeliculaDetalle';
import { useResenas } from '../../contextos/ContextoResenas';

vi.mock('../../contextos/ContextoResenas');
vi.mock('../../componentes/TarjetaResena/TarjetaResena', () => ({
    default: ({ pelicula }) => <div data-testid="tarjeta-resena">{pelicula.titulo || pelicula.title}</div>,
}));
vi.mock('../../componentes/ModalComentarios/ModalComentarios', () => ({
    default: () => <div data-testid="modal-comentarios">Modal Comentarios</div>,
}));

const mockObtenerResenasPorPelicula = vi.fn();

const baseContext = {
    usuarioActual: 1,
    resenas: [],
    eliminarResena: vi.fn(),
    toggleLikeResena: vi.fn(),
    agregarComentario: vi.fn(),
    obtenerResenasPorPelicula: mockObtenerResenasPorPelicula,
};

describe('PeliculaDetalle', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockObtenerResenasPorPelicula.mockReset();
    });

    it('muestra el spinner de carga al inicio', async () => {
        useResenas.mockReturnValue(baseContext); // <-- agrega esto
        mockObtenerResenasPorPelicula.mockResolvedValueOnce([]);
        render(
            <MemoryRouter initialEntries={['/pelicula/Matrix']}>
                <PeliculaDetalle />
            </MemoryRouter>
        );
        expect(screen.getByText(/Cargando reseñas de la película/i)).toBeInTheDocument();
        // await waitFor(() => {
        //     expect(screen.getByText(/No hay reseñas para "Matrix"/i)).toBeInTheDocument();
        // });
    });

    // it('muestra mensaje de estado vacío si no hay reseñas', async () => {
    //     useResenas.mockReturnValue(baseContext); // <-- mockea el contexto antes de renderizar
    //     mockObtenerResenasPorPelicula.mockResolvedValueOnce([]);
    //     render(
    //         <MemoryRouter initialEntries={['/pelicula/Matrix']}>
    //             <PeliculaDetalle />
    //         </MemoryRouter>
    //     );
    //     // Espera a que desaparezca el spinner antes de buscar el mensaje vacío
    //     await waitFor(() => {
    //         expect(screen.queryByText(/Cargando reseñas/i)).not.toBeInTheDocument();
    //         expect(screen.getByText(/No hay reseñas/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Sé el primero en escribir una reseña/i)).toBeInTheDocument();
    //         expect(screen.getByRole('link', { name: /Escribir primera reseña/i })).toBeInTheDocument();
    //         expect(screen.getByRole('link', { name: /Volver al inicio/i })).toBeInTheDocument();
    //     });
    // });

    //   it('muestra los datos y la lista de reseñas de la película', async () => {
    //     const mockResenas = [
    //       { id: 1, titulo: 'Matrix', calificacion: 5, likes: 2, año: 1999, genero: 'Sci-Fi', imagenUrl: 'matrix.jpg' },
    //       { id: 2, titulo: 'Matrix Reloaded', calificacion: 4, likes: 1, año: 2003, genero: 'Sci-Fi', imagenUrl: 'matrix2.jpg' }
    //     ];
    //     mockObtenerResenasPorPelicula.mockResolvedValueOnce(mockResenas);

    //     render(
    //       <MemoryRouter initialEntries={['/pelicula/Matrix']}>
    //         <PeliculaDetalle />
    //       </MemoryRouter>
    //     );

    //     await waitFor(() => {
    //       expect(screen.getByText('Matrix')).toBeInTheDocument();
    //       expect(screen.getByText('Matrix Reloaded')).toBeInTheDocument();
    //       expect(screen.getByText(/Todas las reseñas/i)).toBeInTheDocument();
    //       expect(screen.getAllByTestId('tarjeta-resena')).toHaveLength(2);
    //       expect(screen.getByText(/Promedio/i)).toBeInTheDocument();
    //       expect(screen.getByText(/Reseñas/i)).toBeInTheDocument();
    //       expect(screen.getByText(/Likes/i)).toBeInTheDocument();
    //       expect(screen.getByRole('link', { name: /✏️ Escribir reseña/i })).toBeInTheDocument();
    //     });
    //   });

    //   it('muestra el modal de comentarios cuando se selecciona una reseña', async () => {
    //     const mockResenas = [
    //       { id: 1, titulo: 'Matrix', calificacion: 5, likes: 2, año: 1999, genero: 'Sci-Fi', imagenUrl: 'matrix.jpg' }
    //     ];
    //     mockObtenerResenasPorPelicula.mockResolvedValueOnce(mockResenas);

    //     render(
    //       <MemoryRouter initialEntries={['/pelicula/Matrix']}>
    //         <PeliculaDetalle />
    //       </MemoryRouter>
    //     );

    //     // Simula abrir comentarios (llama directamente la función si es necesario)
    //     // Aquí deberías disparar el evento que abre el modal, pero como el componente está mockeado, solo verifica que el modal existe
    //     await waitFor(() => {
    //       expect(screen.getByTestId('tarjeta-resena')).toBeInTheDocument();
    //     });
    //     // Simula que mostrarComentarios y resenaSeleccionada están en true (esto normalmente lo harías con fireEvent)
    //     // Aquí solo verifica que el modal existe si el estado lo permite
    //     // expect(screen.getByTestId('modal-comentarios')).toBeInTheDocument();
    //   });
});