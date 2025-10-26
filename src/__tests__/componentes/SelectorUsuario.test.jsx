import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import SelectorUsuario from '../../componentes/SelectorUsuario/SelectorUsuario';

// Mock del contexto
vi.mock('../../contextos/ContextoResenas.jsx', () => ({
    useResenas: () => ({
        usuarioActual: 2,
        setUsuarioActual: vi.fn(),
    }),
}));
// Mock de useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('SelectorUsuario', () => {
    it('muestra el usuario actual en el botón', () => {
        render(
            <MemoryRouter>
                <SelectorUsuario />
            </MemoryRouter>
        );
        expect(screen.getByRole('button', { name: /Juan Pérez/i })).toBeInTheDocument();
        expect(screen.getByText(/🚀/)).toBeInTheDocument();
    });

    it('muestra el selector de usuarios al hacer click en el botón', () => {
        render(
            <MemoryRouter>
                <SelectorUsuario />
            </MemoryRouter>
        );
        const btn = screen.getByRole('button', { name: /Juan Pérez/i });
        fireEvent.click(btn);
        expect(screen.getByText(/Seleccionar Usuario/i)).toBeInTheDocument();
        expect(screen.getByText(/(Para testing)/i)).toBeInTheDocument();
        expect(screen.getAllByRole('button').length).toBeGreaterThan(1); // Hay varios usuarios
    });

    it('cierra el selector al hacer click en el overlay', () => {
        render(
            <MemoryRouter>
                <SelectorUsuario />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByRole('button', { name: /Juan Pérez/i }));
        expect(screen.getByText(/Seleccionar Usuario/i)).toBeInTheDocument();
        fireEvent.click(document.querySelector('.overlay-selector'));
        expect(screen.queryByText(/Seleccionar Usuario/i)).not.toBeInTheDocument();
    });

    // it('cambia el usuario al hacer click en otro usuario', () => {
    //     const setUsuarioActual = vi.fn();
    //     vi.mocked(require('../../contextos/ContextoResenas').useResenas).mockReturnValue({
    //         usuarioActual: 2,
    //         setUsuarioActual,
    //     });
    //     render(
    //         <MemoryRouter>
    //             <SelectorUsuario />
    //         </MemoryRouter>
    //     );
    //     fireEvent.click(screen.getByRole('button', { name: /Juan Pérez/i }));
    //     const btnMaria = screen.getByRole('button', { name: /María García/i });
    //     fireEvent.click(btnMaria);
    //     expect(setUsuarioActual).toHaveBeenCalledWith(3);
    // });

    it('muestra el indicador activo en el usuario seleccionado', () => {
        render(
            <MemoryRouter>
                <SelectorUsuario />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByRole('button', { name: /Juan Pérez/i }));
        const activo = screen.getByText(/●/);
        expect(activo).toBeInTheDocument();
    });

    it('muestra el footer con rutas de usuario', () => {
        render(
            <MemoryRouter>
                <SelectorUsuario />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByRole('button', { name: /Juan Pérez/i }));
        expect(screen.getByText(/\/usuario\/1/)).toBeInTheDocument();
        expect(screen.getByText(/\/usuario\/2/)).toBeInTheDocument();
    });
});