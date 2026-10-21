
import { describe, it, expect, vi, beforeEach } from "vitest";

const { createUserMock } = vi.hoisted(() => ({
  createUserMock: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      admin: {
        createUser: createUserMock,
      },
    },
  })),
}));

import { registerUserInSupabase } from "../services/authService.js";

const validUser = {
  nombre: "Usuario Prueba",
  email: "prueba@example.com",
  password: "ClaveSegura123!",
};

describe("Servicio de registro Supabase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envía los datos correctos a Supabase", async () => {
    createUserMock.mockResolvedValue({
      data: {
        user: {
          id: "user-123",
          email: validUser.email,
        },
      },
      error: null,
    });

    const result = await registerUserInSupabase(validUser);

    expect(createUserMock).toHaveBeenCalledWith({
      email: validUser.email,
      password: validUser.password,
      user_metadata: {
        nombre: validUser.nombre,
      },
      email_confirm: true,
    });

    expect(result.user.id).toBe("user-123");
  });

  it("normaliza nombre y correo electrónico", async () => {
    createUserMock.mockResolvedValue({
      data: {
        user: { id: "user-456" },
      },
      error: null,
    });

    await registerUserInSupabase({
      ...validUser,
      nombre: "  Usuario Prueba  ",
      email: "  prueba@example.com  ",
    });

    expect(createUserMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "prueba@example.com",
        user_metadata: {
          nombre: "Usuario Prueba",
        },
      })
    );
  });

  it("identifica correctamente un correo duplicado", async () => {
    createUserMock.mockResolvedValue({
      data: { user: null },
      error: {
        message: "A user with this email address has already been registered",
        code: "email_exists",
      },
    });

    await expect(
      registerUserInSupabase(validUser)
    ).rejects.toMatchObject({
      code: "EMAIL_CONFLICT",
    });
  });

  it("maneja errores internos de Supabase", async () => {
    createUserMock.mockResolvedValue({
      data: { user: null },
      error: {
        message: "Database temporarily unavailable",
        code: "unexpected_failure",
      },
    });

    await expect(
      registerUserInSupabase(validUser)
    ).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
    });
  });
});
