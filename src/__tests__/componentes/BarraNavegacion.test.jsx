import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import BarraNavegacion from '../../componentes/BarraNavegacion/BarraNavegacion';

// 🔹 Mock de SelectorUsuario (para no depender del contexto real)
vi.mock('../../componentes/SelectorUsuario/SelectorUsuario', () => ({
  default: () => <div data-testid="selector-usuario">Mock SelectorUsuario</div>,
}));

// 🔹 Spy de useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('BarraNavegacion', () => {
  it('renderiza el logo y el nombre de la aplicación', () => {
    render(
      <MemoryRouter>
        <BarraNavegacion />
      </MemoryRouter>
    );

    expect(screen.getByText(/cineTrack/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cineTrack/i })).toHaveAttribute('href', '/');
  });

  it('renderiza los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <BarraNavegacion />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /USUARIO/i })).toHaveAttribute('href', '/usuario');
    expect(screen.getByRole('link', { name: /FILMS/i })).toHaveAttribute('href', '/peliculas');
    expect(screen.getByRole('link', { name: /ESCRIBIR RESEÑA/i })).toHaveAttribute('href', '/crear');
  });

  it('actualiza el input de búsqueda cuando el usuario escribe', () => {
    render(
      <MemoryRouter>
        <BarraNavegacion />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscá tu película favorita/i);
    fireEvent.change(input, { target: { value: 'Matrix' } });

    expect(input.value).toBe('Matrix');
  });

  it('navega al buscar cuando el input no está vacío', () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <BarraNavegacion />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscá tu película favorita/i);
    const form = input.closest('form'); // más seguro que usar role

    fireEvent.change(input, { target: { value: 'Inception' } });
    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledWith('/?busqueda=Inception');
  });

  it('no navega al buscar si el input está vacío', () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <BarraNavegacion />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscá tu película favorita/i);
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.submit(form);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renderiza el SelectorUsuario', () => {
    render(
      <MemoryRouter>
        <BarraNavegacion />
      </MemoryRouter>
    );

    expect(screen.getByTestId('selector-usuario')).toBeInTheDocument();
  });
});
