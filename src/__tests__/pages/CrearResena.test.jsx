import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CrearResena from "../../pages/CrearResena";
import { ProveedorResenas, useResenas } from "../../contextos/ContextoResenas";

// Mock de contexto
vi.mock("../../contextos/ContextoResenas", async () => {
  const actual = await vi.importActual("../../contextos/ContextoResenas");
  return {
    ...actual,
    useResenas: vi.fn(),
  };
});

function renderCrearResena() {
  return render(
    <MemoryRouter>
      <ProveedorResenas>
        <CrearResena />
      </ProveedorResenas>
    </MemoryRouter>
  );
}

describe("CrearResena", () => {
  let mockAgregarResena;

  beforeEach(() => {
    mockAgregarResena = vi.fn().mockResolvedValue({});
    useResenas.mockReturnValue({ agregarResena: mockAgregarResena });
  });

  it("renderiza el formulario con campos principales", () => {
    renderCrearResena();

    expect(
      screen.getByRole("heading", { name: /escribir mi reseña/i })
    ).toBeInTheDocument();

    // Campo de título
    expect(screen.getByLabelText(/titulo de reseña/i)).toBeInTheDocument();

    // Campo de reseña
    expect(screen.getByLabelText(/tu reseña \*/i)).toBeInTheDocument();

    // Botón de publicar
    expect(
      screen.getByRole("button", { name: /publicar reseña/i })
    ).toBeInTheDocument();
  });

  it("permite escribir en el campo de título", () => {
    renderCrearResena();

    const inputTitulo = screen.getByLabelText(/titulo de reseña/i);
    fireEvent.change(inputTitulo, { target: { value: "Mi reseña épica" } });

    expect(inputTitulo.value).toBe("Mi reseña épica");
  });

  it("muestra errores si el formulario está incompleto", async () => {
    renderCrearResena();

    const submit = screen.getByRole("button", { name: /publicar reseña/i });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(
        screen.getByText(/el título de la reseña es obligatorio/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/la calificación es obligatoria/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/la reseña debe tener al menos 10 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it("permite seleccionar tags", () => {
    renderCrearResena();

    const tag = screen.getByRole("button", { name: /acción/i });
    fireEvent.click(tag);

    expect(tag).toHaveClass("seleccionado");
  });

  it("llama a agregarResena y navega al enviar correctamente", async () => {
    renderCrearResena();

    // Completar título
    fireEvent.change(screen.getByLabelText(/titulo de reseña/i), {
      target: { value: "Mi reseña" },
    });

    // Seleccionar calificación
    fireEvent.click(screen.getAllByText("★")[2]);

    // Escribir reseña
    fireEvent.change(screen.getByLabelText(/tu reseña \*/i), {
      target: { value: "Esta peli fue genial, me encantó." },
    });

    // Enviar
    fireEvent.click(screen.getByRole("button", { name: /publicar reseña/i }));

    await waitFor(() => {
      expect(mockAgregarResena).toHaveBeenCalledTimes(1);
      expect(mockAgregarResena).toHaveBeenCalledWith(
        expect.objectContaining({
          tituloResenia: "Mi reseña",
          calificacion: 3,
          textoResena: "Esta peli fue genial, me encantó.",
        })
      );
    });
  });
});
