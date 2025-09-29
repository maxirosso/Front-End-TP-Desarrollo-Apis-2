// src/__tests__/componentes/LoadingSpinner.test.jsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../componentes/LoadingSpinner/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renderiza con valores por defecto', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loading-spinner medium');
  });

  it('renderiza con props personalizadas', () => {
    render(<LoadingSpinner mensaje="Esperando datos..." tamaño="large" />);

    expect(screen.getByText(/Esperando datos.../i)).toBeInTheDocument();

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('loading-spinner large');
  });

  it('contiene 4 elementos en el spinner-ring', () => {
    render(<LoadingSpinner />);

    const ring = screen.getByTestId('spinner-ring');
    expect(ring.children.length).toBe(4);
  });
});
