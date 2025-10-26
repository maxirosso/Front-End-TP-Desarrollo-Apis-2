import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListaResenas from '../../componentes/ListaResenas/ListaResenas';
import { ProveedorAuth } from '../../contextos/ContextoAuth';
import { ProveedorResenas } from '../../contextos/ContextoResenas';

const reseñasMock = [
  {
    id: 1,
    titulo: "El Padrino",
    año: 1972,
    imagenUrl: "https://via.placeholder.com/120x180/2C3E50/ECF0F1?text=El+Padrino",
    calificacion: 5,
    usuario: "usuario_actual",
    fechaResena: "15 de marzo, 2024",
    fechaVisionado: "10 de marzo, 2024",
    textoResena: "Una obra maestra absoluta del cine. La narrativa de Coppola es impecable, combinando drama familiar con elementos del crimen de manera magistral. Cada escena está cuidadosamente construida, y las actuaciones de Brando y Pacino son legendarias. Es imposible no quedar cautivado por la complejidad de los personajes y la profundidad de la historia.",
    megusta: true,
    likes: 24,
    yaLeDiLike: true,
    comentarios: [
      { id: 1, usuario: "otro_usuario", texto: "Totalmente de acuerdo, es una obra maestra", fecha: "16 de marzo, 2024" }
    ],
    tags: ["Obra Maestra", "Drama", "Spoiler Free"],
    contieneEspoilers: false,
    genero: "drama"
  }
];

describe('ListaResenas', () => {
  it('renderiza la lista de reseñas', async () => {
    render(
      <MemoryRouter>
        <ProveedorAuth>
          <ProveedorResenas>
            <ListaResenas reseñasExternas={reseñasMock} />
          </ProveedorResenas>
        </ProveedorAuth>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/El Padrino/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje si no hay reseñas', async () => {
    render(
      <MemoryRouter>
        <ProveedorAuth>
          <ProveedorResenas>
            <ListaResenas reseñasExternas={[]} />
          </ProveedorResenas>
        </ProveedorAuth>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/No se encontraron reseñas/i)).toBeInTheDocument();
    });
  });

  it('renderiza una reseña real', async () => {
  render(
    <MemoryRouter>
      <ProveedorAuth>
        <ProveedorResenas>
          <ListaResenas reseñasExternas={[
            {
              id: 1,
              titulo: "El Padrino",
              textoResena: "Obra maestra",
              usuario: "usuario_actual",
              calificacion: 5,
              genero: "drama",
              tags: [],
              megusta: true,
              contieneEspoilers: false,
              fechaResena: "2024-03-15",
              likes: 10,
              yaLeDiLike: false,
              comentarios: [],
              imagenUrl: "",
              fechaVisionado: "",
            }
          ]} />
        </ProveedorResenas>
      </ProveedorAuth>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText(/El Padrino/i)).toBeInTheDocument();
    expect(screen.getByText(/Obra maestra/i)).toBeInTheDocument();
  });
  });
});