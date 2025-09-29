// src/__tests__/componentes/ModalComentarios.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModalComentarios from '../../componentes/ModalComentarios/ModalComentarios';

// 🔹 Mock del contexto
vi.mock('../../contextos/ContextoResenas', () => ({
  useResenas: () => ({
    agregarComentario: vi.fn(),
    eliminarComentario: vi.fn(),
    usuarioActual: 2,
    reviewsAPI: null,
    usingBackend: false,
  }),
}));

const baseResena = {
  id: 1,
  movie_title: 'Matrix',
  year: 1999,
  user_name: 'Neo',
  rating: 5,
  body: 'Excelente película de ciencia ficción.',
  comentarios: [],
};

describe('ModalComentarios', () => {
  let onCerrar;

  beforeEach(() => {
    onCerrar = vi.fn();
  });

  it('renderiza título, autor y resumen de la reseña', () => {
    render(<ModalComentarios resena={baseResena} onCerrar={onCerrar} />);
    expect(screen.getByText(/Matrix \(1999\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Reseña de Neo/i)).toBeInTheDocument();
    expect(screen.getByText(/Excelente película/i)).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay comentarios', () => {
    render(<ModalComentarios resena={baseResena} onCerrar={onCerrar} />);
    expect(
      screen.getByText(/Aún no hay comentarios. ¡Sé el primero en comentar!/i)
    ).toBeInTheDocument();
  });

  it('muestra comentarios existentes', () => {
    const resenaConComentarios = {
      ...baseResena,
      comentarios: [
        { id: 101, usuario: 'Juan Pérez', comment: 'Muy buena reseña', fecha: '2025-09-28' },
      ],
    };
    render(<ModalComentarios resena={resenaConComentarios} onCerrar={onCerrar} />);
    expect(screen.getByText(/Muy buena reseña/i)).toBeInTheDocument();
    expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument();
  });

  it('permite escribir y enviar un nuevo comentario en modo local', async () => {
    render(<ModalComentarios resena={baseResena} onCerrar={onCerrar} />);
    const textarea = screen.getByPlaceholderText(/Escribe tu comentario/i);
    fireEvent.change(textarea, { target: { value: 'Nuevo comentario!' } });

    const button = screen.getByRole('button', { name: /Comentar/i });
    fireEvent.click(button);

    // Esperamos a que el estado se actualice y se limpie el textarea
    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  it('llama a onCerrar al hacer clic en el overlay o botón ✕', () => {
    render(<ModalComentarios resena={baseResena} onCerrar={onCerrar} />);

    // Botón cerrar
    fireEvent.click(screen.getByRole('button', { name: '✕' }));
    expect(onCerrar).toHaveBeenCalled();

    // Overlay (seleccionamos por clase en lugar de role)
    const overlay = document.querySelector('.overlay-modal-comentarios');
    fireEvent.click(overlay);
    expect(onCerrar).toHaveBeenCalled();
  });
});
