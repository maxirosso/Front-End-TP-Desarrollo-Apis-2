import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Importa el router

import Inicio from '../pages/Inicio';

test('muestra el botón para crear reseña', () => {
  render(
      <MemoryRouter>
          <Inicio />
      </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: /escribir reseña/i })).toBeInTheDocument();
});

