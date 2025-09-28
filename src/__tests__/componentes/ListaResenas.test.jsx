import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FiltrosResenas from '../../componentes/FiltrosResenas/FiltrosResenas';

describe('FiltrosResenas', () => {
  const baseProps = {
    filtros: {},
    onAplicarFiltros: vi.fn(),
    onLimpiarFiltros: vi.fn(),
  };

  it('llama a onAplicarFiltros al cambiar la calificación', () => {
    const onAplicarFiltros = vi.fn();
    render(<FiltrosResenas {...baseProps} onAplicarFiltros={onAplicarFiltros} />);

    // Seleccionamos el select asociado al label "Calificación"
    const calificacionLabel = screen.getByText(/Calificación/i);
    const calificacionSelect = calificacionLabel.closest('div').querySelector('select');

    fireEvent.change(calificacionSelect, { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Aplicar filtros/i }));

    expect(onAplicarFiltros).toHaveBeenCalled();
  });

  it('muestra filtros avanzados al hacer clic en "Más filtros"', () => {
    render(<FiltrosResenas {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Más filtros/i }));

    // Encontramos el label "Género" y su select asociado
    const generoLabel = screen.getAllByText(/Género/i)[0];
    const generoSelect = generoLabel.closest('div').querySelector('select');

    expect(generoSelect).toBeInTheDocument();
    expect(screen.getByText(/Tags/i)).toBeInTheDocument();
    expect(screen.getByText(/Solo películas que me gustaron/i)).toBeInTheDocument();
  });

  it('muestra el resumen de filtros activos', () => {
    render(
      <FiltrosResenas
        {...baseProps}
        filtros={{
          pelicula: 'Matrix',
          usuario: 'Neo',
          calificacion: '5',
        }}
      />
    );

    // Buscamos el bloque que contiene el resumen
    const resumen = screen.getByText(/Filtros activos:/i).closest('div');

    expect(resumen).toHaveTextContent(/5 estrellas/i);
    expect(resumen).toHaveTextContent(/Película: "Matrix"/i);
    expect(resumen).toHaveTextContent(/Usuario: "Neo"/i);
  });
});
