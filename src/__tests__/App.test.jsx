import React from 'react';

import { render, screen } from '@testing-library/react';
import App from '../App.jsx';
test('renderiza el título principal', () => {
  render(<App />);
  expect(screen.getByText(/Cargando las reseñas más copadas.../i)).toBeInTheDocument();
});