import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import Usuario from '../../pages/Usuario';
import { useResenas } from '../../contextos/ContextoResenas';

vi.mock('../../contextos/ContextoResenas');
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('Usuario', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra el mensaje de redirección', () => {
        useResenas.mockReturnValue({ usuarioActual: 42 });
        const mockNavigate = vi.fn();
        useNavigate.mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <Usuario />
            </MemoryRouter>
        );
        expect(screen.getByText(/Redirigiendo a tu perfil/i)).toBeInTheDocument();
    });

    it('llama a navigate con el perfil del usuario actual', () => {
        const mockNavigate = vi.fn();
        useNavigate.mockReturnValue(mockNavigate); // <-- agrega esto
        useResenas.mockReturnValue({ usuarioActual: 99 });

        render(
            <MemoryRouter>
                <Usuario />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/usuario/99');
    });
});