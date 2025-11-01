import React from "react";
import { render, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeAll, afterEach } from "vitest";
import { ProveedorResenas, useResenas } from "../../contextos/ContextoResenas";


// --- Mocks externos ---
vi.mock("../../contextos/ContextoAuth", () => ({
  useAuth: () => ({ usuario: { id: 1, user_id: 1 } }),
}));

vi.mock("../../services/api", () => ({
  reviewsAPI: {
    getAll: vi.fn().mockResolvedValue({ data: [] }),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    filter: vi.fn().mockResolvedValue({ data: [] }),
    getByUser: vi.fn().mockResolvedValue({ data: [] }),
  },
  usersAPI: {},
  moviesAPI: {
    getAll: vi.fn().mockResolvedValue([]),
    search: vi.fn().mockResolvedValue([]),
  },
  handleApiError: (err) => err.message || "Error",
  checkBackendHealth: vi.fn().mockResolvedValue(false), // forzar modo local
}));

// mock localStorage
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

function HookTester({ onReady }) {
  const ctx = useResenas();
  onReady(ctx);
  return null;
}

describe("ContextoResenas - modo local", () => {
  it("inicializa el contexto correctamente", async () => {
    let ctx;
    render(
      <ProveedorResenas>
        <HookTester onReady={(c) => (ctx = c)} />
      </ProveedorResenas>
    );
    expect(ctx.usuarioActual).toBe(1);
    expect(Array.isArray(ctx.resenas)).toBe(true);
    expect(ctx.usingBackend).toBe(false);
  });

  // it("agrega, actualiza y elimina reseñas", async () => {
  //   let ctx;
  //   render(
  //     <ProveedorResenas>
  //       <HookTester onReady={(c) => (ctx = c)} />
  //     </ProveedorResenas>
  //   );

  //   // agregar reseña
  //   await act(async () => {
  //     await ctx.agregarResena({
  //       titulo: "Matrix",
  //       calificacion: 5,
  //       textoResena: "Excelente película con más de 20 caracteres.",
  //       año: 1999,
  //       genero: "Sci-Fi",
  //     });
  //   });
  //   expect(ctx.resenas.length).toBe(1);
  //   expect(ctx.resenas[0].titulo).toBe("Matrix");

  //   const id = ctx.resenas[0].id;

  //   // actualizar
  //   await act(async () => {
  //     await ctx.actualizarResena(id, { titulo: "Matrix Reloaded" });
  //   });
  //   expect(ctx.resenas[0].titulo).toBe("Matrix Reloaded");

  //   // eliminar
  //   await act(async () => {
  //     await ctx.eliminarResena(id);
  //   });
  //   expect(ctx.resenas.length).toBe(0);
  // });

  // it("maneja likes correctamente", async () => {
  //   let ctx;
  //   render(
  //     <ProveedorResenas>
  //       <HookTester onReady={(c) => (ctx = c)} />
  //     </ProveedorResenas>
  //   );

  //   await act(async () => {
  //     await ctx.agregarResena({
  //       titulo: "TestLike",
  //       calificacion: 5,
  //       textoResena: "Texto con más de 20 caracteres.",
  //       año: 2023,
  //     });
  //   });

  //   const id = ctx.resenas[0].id;
  //   expect(ctx.resenas[0].yaLeDiLike).toBe(false);

  //   await act(async () => {
  //     await ctx.toggleLikeResena(id);
  //   });
  //   expect(ctx.resenas[0].yaLeDiLike).toBe(true);
  //   expect(ctx.resenas[0].likes).toBe(1);

  //   await act(async () => {
  //     await ctx.toggleLikeResena(id);
  //   });
  //   expect(ctx.resenas[0].yaLeDiLike).toBe(false);
  //   expect(ctx.resenas[0].likes).toBe(0);
  // });

  // it("agrega y elimina comentarios correctamente", async () => {
  //   let ctx;
  //   render(
  //     <ProveedorResenas>
  //       <HookTester onReady={(c) => (ctx = c)} />
  //     </ProveedorResenas>
  //   );

  //   await act(async () => {
  //     await ctx.agregarResena({
  //       titulo: "ComentarioTest",
  //       calificacion: 4,
  //       textoResena: "Texto de prueba largo con comentarios.",
  //     });
  //   });

  //   const id = ctx.resenas[0].id;

  //   await act(async () => {
  //     await ctx.agregarComentario(id, "Muy buena!");
  //   });
  //   expect(ctx.resenas[0].comentarios.length).toBe(1);

  //   const commentId = ctx.resenas[0].comentarios[0].id;

  //   await act(async () => {
  //     await ctx.eliminarComentario(id, commentId);
  //   });
  //   expect(ctx.resenas[0].comentarios.length).toBe(0);
  // });

  // it("obtiene reseña por id y usuario", async () => {
  //   let ctx;
  //   render(
  //     <ProveedorResenas>
  //       <HookTester onReady={(c) => (ctx = c)} />
  //     </ProveedorResenas>
  //   );

  //   await act(async () => {
  //     await ctx.agregarResena({
  //       titulo: "Matrix",
  //       calificacion: 5,
  //       textoResena: "Excelente película con más de 20 caracteres.",
  //       año: 1999,
  //     });
  //   });

  //   const id = ctx.resenas[0].id;
  //   const porId = ctx.obtenerResenaPorId(id);
  //   expect(porId.titulo).toBe("Matrix");

  //   const porUsuario = await ctx.obtenerResenasPorUsuario(1);
  //   expect(porUsuario.length).toBe(1);
  // });
  // it("filtra reseñas localmente", async () => {
  //   let ctx;
  //   render(
  //     <ProveedorResenas>
  //       <HookTester onReady={(c) => (ctx = c)} />
  //     </ProveedorResenas>
  //   );

  //   // 🧩 Agregamos dos reseñas al contexto
  //   await act(async () => {
  //     await ctx.agregarResena({
  //       titulo: "Matrix",
  //       calificacion: 5,
  //       textoResena: "Texto largo de prueba con más de 20 caracteres.",
  //       genero: "Sci-Fi",
  //     });
  //     await ctx.agregarResena({
  //       titulo: "Titanic",
  //       calificacion: 4,
  //       textoResena: "Otra reseña con más de 20 caracteres.",
  //       genero: "Drama",
  //     });
  //   });

  //   // 🧠 Filtramos directamente usando la función local pura
  //   const filtradas = ctx.aplicarFiltrosLocal(ctx.resenas, {
  //     pelicula: "Matrix",
  //     calificacion: 5,
  //   });

  //   // 🧾 Validamos el resultado
  //   expect(filtradas.length).toBe(1);
  //   expect(filtradas[0].titulo).toBe("Matrix");
  // });

  it("ordena reseñas correctamente", async () => {
    let ctx;
    render(
      <ProveedorResenas>
        <HookTester onReady={(c) => (ctx = c)} />
      </ProveedorResenas>
    );

    await act(async () => {
      await ctx.agregarResena({
        titulo: "Zeta",
        calificacion: 3,
        textoResena: "Texto uno largo.",
      });
      await ctx.agregarResena({
        titulo: "Alpha",
        calificacion: 5,
        textoResena: "Texto dos largo.",
      });
    });

    const ordenadas = ctx.aplicarOrdenamiento(ctx.resenas, "titulo-asc");
    expect(ordenadas[0].titulo).toBe("Alpha");
  });

  it("devuelve el nombre correcto de usuario", async () => {
    let ctx;
    render(
      <ProveedorResenas>
        <HookTester onReady={(c) => (ctx = c)} />
      </ProveedorResenas>
    );

    expect(ctx.obtenerNombreUsuario(1)).toBe("Admin");
    expect(ctx.obtenerNombreUsuario(99)).toBe("Usuario 99");
  });
});
