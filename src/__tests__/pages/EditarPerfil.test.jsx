import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { vi } from 'vitest';
import EditarPerfil from '../../pages/EditarPerfil';
import { useResenas } from '../../contextos/ContextoResenas';

vi.mock('../../contextos/ContextoResenas');
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useParams: vi.fn(),
    };
});

const mockNavigate = vi.fn();
const mockUserId = '2';

describe('EditarPerfil', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        useParams.mockReturnValue({ userId: mockUserId });
    });

    it('muestra el formulario de edición de perfil', async () => {
        useResenas.mockReturnValue({
            usuarioActual: 2,
            usersAPI: {},
            usingBackend: false,
        });

        render(
            <MemoryRouter>
                <EditarPerfil />
            </MemoryRouter>
        );

        // Espera el título del formulario
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Editar mi Perfil/i })).toBeInTheDocument();
        });
    });

      it('muestra el formulario con datos del usuario', async () => {
        useResenas.mockReturnValue({
          usuarioActual: 2,
          usersAPI: {},
          usingBackend: false,
        });

        render(
          <MemoryRouter>
            <EditarPerfil />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByRole('heading', { name: /Editar mi Perfil/i })).toBeInTheDocument();
          expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/Biografía/i)).toBeInTheDocument();
          expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
          expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
        });
      });

      it('valida el formulario y muestra errores', async () => {
        useResenas.mockReturnValue({
          usuarioActual: 2,
          usersAPI: {},
          usingBackend: false,
        });

        render(
          <MemoryRouter>
            <EditarPerfil />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'noemail' } });
        fireEvent.click(screen.getByRole('button', { name: /Guardar Cambios/i }));

        expect(await screen.findByText(/El nombre es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/El email no tiene un formato válido/i)).toBeInTheDocument();
      });

      it('redirige si el usuario intenta editar otro perfil', async () => {
        useResenas.mockReturnValue({
          usuarioActual: 99,
          usersAPI: {},
          usingBackend: false,
        });

        render(
          <MemoryRouter>
            <EditarPerfil />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/usuario');
        });
      });

      it('redirige al perfil después de guardar', async () => {
        const mockUpdate = vi.fn().mockResolvedValue({});
        useResenas.mockReturnValue({
          usuarioActual: 2,
          usersAPI: { update: mockUpdate },
          usingBackend: true,
        });

        render(
          <MemoryRouter>
            <EditarPerfil />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Nuevo Nombre' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'nuevo@email.com' } });
        fireEvent.click(screen.getByRole('button', { name: /Guardar Cambios/i }));

        await waitFor(() => {
          expect(mockUpdate).toHaveBeenCalled();
          expect(mockNavigate).toHaveBeenCalledWith('/usuario/2');
        });
      });
});