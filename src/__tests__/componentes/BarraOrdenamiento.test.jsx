import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BarraOrdenamiento from '../../componentes/BarraOrdenamiento/BarraOrdenamiento';

describe('BarraOrdenamiento', () => {
  it('muestra el contador de reseñas correctamente', () => {
    const { rerender } = render(
      <BarraOrdenamiento
        ordenamientoActual="fecha-desc"
        totalResenas={0}
        onCambiarOrdenamiento={() => {}}
      />
    );
    expect(screen.getByText(/No hay reseñas/i)).toBeInTheDocument();

    rerender(
      <BarraOrdenamiento
        ordenamientoActual="fecha-desc"
        totalResenas={1}
        onCambiarOrdenamiento={() => {}}
      />
    );
    expect(screen.getByText(/1 reseña encontrada/i)).toBeInTheDocument();

    rerender(
      <BarraOrdenamiento
        ordenamientoActual="fecha-desc"
        totalResenas={5}
        onCambiarOrdenamiento={() => {}}
      />
    );
    expect(screen.getByText(/5 reseñas encontradas/i)).toBeInTheDocument();
  });

  it('muestra la etiqueta e ícono del ordenamiento actual', () => {
    render(
      <BarraOrdenamiento
        ordenamientoActual="calificacion-desc"
        totalResenas={3}
        onCambiarOrdenamiento={() => {}}
      />
    );

    // Buscamos el botón que contiene la etiqueta visible
    const boton = screen.getByRole('button', { name: /Mejor puntuación primero/i });
    expect(boton).toBeInTheDocument();

    // Validamos también el ícono
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('abre y cierra el menú de opciones al hacer clic en el botón', () => {
    render(
      <BarraOrdenamiento
        ordenamientoActual="fecha-desc"
        totalResenas={3}
        onCambiarOrdenamiento={() => {}}
      />
    );

    // Al inicio no debería estar visible ninguna opción extra
    expect(screen.queryByRole('button', { name: /Más viejitas primero/i })).not.toBeInTheDocument();

    // Abrir menú
    fireEvent.click(screen.getByRole('button', { name: /Más nuevitas primero/i }));
    expect(screen.getByRole('button', { name: /Más viejitas primero/i })).toBeInTheDocument();

    // Cerrar menú haciendo clic en otra opción
    fireEvent.click(screen.getByRole('button', { name: /Más viejitas primero/i }));
  });

  it('llama a onCambiarOrdenamiento al seleccionar una opción', () => {
    const mockCambiar = vi.fn();
    render(
      <BarraOrdenamiento
        ordenamientoActual="fecha-desc"
        totalResenas={2}
        onCambiarOrdenamiento={mockCambiar}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Más nuevitas primero/i }));
    fireEvent.click(screen.getByRole('button', { name: /Más viejitas primero/i }));

    expect(mockCambiar).toHaveBeenCalledWith('fecha-asc');
  });

  it('cambia el ordenamiento desde el select en vista móvil', () => {
    const mockCambiar = vi.fn();
    render(
      <BarraOrdenamiento
        ordenamientoActual="fecha-desc"
        totalResenas={2}
        onCambiarOrdenamiento={mockCambiar}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'likes-desc' } });

    expect(mockCambiar).toHaveBeenCalledWith('likes-desc');
  });
});
