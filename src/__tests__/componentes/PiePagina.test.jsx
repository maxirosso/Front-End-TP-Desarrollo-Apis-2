// src/__tests__/componentes/PiePagina.test.jsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PiePagina from '../../componentes/PiePagina/PiePagina';

describe('PiePagina', () => {
  it('renderiza los enlaces principales', () => {
    render(<PiePagina />);

    expect(screen.getByRole('button', { name: /Sobre nosotros/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Términos y condiciones/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ayuda/i })).toBeInTheDocument();
  });

  it('muestra el texto de copyright', () => {
    render(<PiePagina />);
    expect(
      screen.getByText(/© cineTrack - Todos los derechos reservados\./i)
    ).toBeInTheDocument();
  });

  it('contiene exactamente 3 botones de enlace', () => {
    render(<PiePagina />);
    const botones = screen.getAllByRole('button');
    expect(botones).toHaveLength(3);
  });
});
