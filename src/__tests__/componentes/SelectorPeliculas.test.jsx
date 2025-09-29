// src/__tests__/componentes/SelectorPelicula.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectorPelicula from '../../componentes/SelectorPelicula/SelectorPelicula';

// Mock del servicio de películas
vi.mock('../../services/api', () => ({
  moviesAPI: {
    getAll: vi.fn().mockResolvedValue([
      { id: 1, title: 'Matrix', year: 1999, genre: 'Sci-Fi' },
      { id: 2, title: 'Inception', year: 2010, genre: 'Sci-Fi' },
    ]),
  },
}));

describe('SelectorPelicula', () => {
  let onSeleccionar, onCrear;

  beforeEach(() => {
    onSeleccionar = vi.fn();
    onCrear = vi.fn();
  });

  it('renderiza con placeholder por defecto', () => {
    render(<SelectorPelicula onSeleccionarPelicula={onSeleccionar} onCrearNueva={onCrear} />);
    expect(screen.getByPlaceholderText(/Buscá tu película favorita/i)).toBeInTheDocument();
  });

  it('muestra sugerencias al escribir en el input', async () => {
    render(<SelectorPelicula onSeleccionarPelicula={onSeleccionar} onCrearNueva={onCrear} />);

    const input = screen.getByPlaceholderText(/Buscá tu película favorita/i);
    fireEvent.change(input, { target: { value: 'Ma' } });

    await waitFor(() => {
      expect(screen.getByText(/Matrix/i)).toBeInTheDocument();
    });
  });

  it('llama a onSeleccionarPelicula al hacer clic en una sugerencia', async () => {
    render(<SelectorPelicula onSeleccionarPelicula={onSeleccionar} onCrearNueva={onCrear} />);

    const input = screen.getByPlaceholderText(/Buscá tu película favorita/i);
    fireEvent.change(input, { target: { value: 'Matrix' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Matrix/i));
    });

    expect(onSeleccionar).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Matrix' })
    );
  });

  it('muestra botón "Cambiar" cuando hay película seleccionada', () => {
    render(
      <SelectorPelicula
        peliculaSeleccionada={{ id: 1, title: 'Matrix', year: 1999, genre: 'Sci-Fi' }}
        onSeleccionarPelicula={onSeleccionar}
        onCrearNueva={onCrear}
      />
    );

    expect(screen.getByText(/Cambiar/i)).toBeInTheDocument();
  });

  it('muestra opción para crear nueva película cuando no hay coincidencia exacta', async () => {
    render(<SelectorPelicula onSeleccionarPelicula={onSeleccionar} onCrearNueva={onCrear} />);

    const input = screen.getByPlaceholderText(/Buscá tu película favorita/i);
    fireEvent.change(input, { target: { value: 'Avatar' } });

    await waitFor(() => {
      expect(screen.getByText(/Agregar "Avatar"/i)).toBeInTheDocument();
    });
  });

  it('llama a onCrearNueva al hacer clic en "Agregar nueva"', async () => {
    render(<SelectorPelicula onSeleccionarPelicula={onSeleccionar} onCrearNueva={onCrear} />);

    const input = screen.getByPlaceholderText(/Buscá tu película favorita/i);
    fireEvent.change(input, { target: { value: 'Avatar' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Agregar "Avatar"/i));
    });

    expect(onCrear).toHaveBeenCalled();
  });
});
