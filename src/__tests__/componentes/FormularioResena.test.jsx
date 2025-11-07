import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormularioResena from '../../componentes/FormularioResena/FormularioResena';

describe('FormularioResena', () => {
  const onCrearResena = vi.fn();
  const onCerrar = vi.fn();

  beforeEach(() => {
    onCrearResena.mockClear();
    onCerrar.mockClear();
  });

//   it('renderiza todos los campos principales', () => {
//     render(<FormularioResena onCrearResena={onCrearResena} onCerrar={onCerrar} />);
//     expect(screen.getByText(/Nueva Reseña/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Título de la Película/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Año/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Género/i)).toBeInTheDocument();
//     expect(screen.getByText(/Tu Calificación/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/¿Cuándo la viste\?/i)).toBeInTheDocument();
//     expect(screen.getByText(/Tu Reseña/i)).toBeInTheDocument();
//     expect(screen.getByText(/Tags/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /Publicar Reseña/i })).toBeInTheDocument();
//   });

  it('muestra errores si se intenta enviar el formulario vacío', () => {
    render(<FormularioResena onCrearResena={onCrearResena} onCerrar={onCerrar} />);
    fireEvent.click(screen.getByRole('button', { name: /Publicar Reseña/i }));
    expect(screen.getByText(/El título de la película es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/Ingresa un año válido/i)).toBeInTheDocument();
    expect(screen.getByText(/Debes dar una calificación/i)).toBeInTheDocument();
    expect(screen.getByText(/Indica cuándo viste la película/i)).toBeInTheDocument();
    expect(screen.getByText(/La reseña debe tener al menos 10 caracteres/i)).toBeInTheDocument();
  });

  it('permite seleccionar estrellas de calificación', () => {
    render(<FormularioResena onCrearResena={onCrearResena} onCerrar={onCerrar} />);
    const estrellas = screen.getAllByRole('button', { name: '★' });
    fireEvent.click(estrellas[3]); // Click en la cuarta estrella
    expect(screen.getByText(/4\/5 estrellas/i)).toBeInTheDocument();
  });

  it('permite seleccionar tags', () => {
    render(<FormularioResena onCrearResena={onCrearResena} onCerrar={onCerrar} />);
    const tagBtn = screen.getByRole('button', { name: /Acción/i });
    fireEvent.click(tagBtn);
    expect(tagBtn.className).toContain('activo');
  });

  it('llama a onCerrar al hacer click en Cancelar o en el botón de cerrar', () => {
    render(<FormularioResena onCrearResena={onCrearResena} onCerrar={onCerrar} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(onCerrar).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /✕/i }));
    expect(onCerrar).toHaveBeenCalledTimes(2);
  });

  it('muestra contador de caracteres en textarea', () => {
    render(<FormularioResena onCrearResena={onCrearResena} onCerrar={onCerrar} />);
    const textarea = screen.getByPlaceholderText(/Comparte tu opinión/i);
    fireEvent.change(textarea, { target: { value: '1234567890' } });
    expect(screen.getByText(/10\/1000 caracteres/i)).toBeInTheDocument();
  });

  it('permite seleccionar y deseleccionar el checkbox de "Me gustó"', () => {
    render(<FormularioResena onCrearResena={onCrearResena} onCerrar={onCerrar} />);
    const checkbox = screen.getByLabelText(/Me gustó esta película/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('permite seleccionar y deseleccionar el checkbox de "contiene spoilers"', () => {
    render(<FormularioResena onCrearResena={onCrearResena} onCerrar={onCerrar} />);
    const checkbox = screen.getByLabelText(/Esta reseña contiene spoilers/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});