
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Simulamos el servicio de Supabase.
// No se crean usuarios reales ni se accede a la base de datos.
vi.mock("../services/authService.js", () => ({
  registerUserInSupabase: vi.fn(),
}));

import { registerUserInSupabase } from "../services/authService.js";
import { app } from "../app.js";

const validUser = {
  nombre: "Usuario Prueba",
  email: "prueba@example.com",
  password: "ClaveSegura123!",
};

describe("POST /auth/register", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("responde 201 y registra un usuario válido", async () => {
    registerUserInSupabase.mockResolvedValue({
      user: {
        id: "test-user-id",
        email: validUser.email,
        created_at: "2026-10-17T12:00:00Z",
      },
    });

    const response = await request(app)
      .post("/auth/register")
      .send(validUser);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.code).toBe("USER_CREATED");
    expect(response.body.data.email).toBe(validUser.email);

    expect(registerUserInSupabase).toHaveBeenCalledWith(
      expect.objectContaining(validUser)
    );
  });

  it("no expone contraseñas ni hashes", async () => {
    registerUserInSupabase.mockResolvedValue({
      user: {
        id: "test-user-id",
        email: validUser.email,
        created_at: "2026-10-17T12:00:00Z",
        password_hash: "HASH_PRIVADO",
      },
    });

    const response = await request(app)
      .post("/auth/register")
      .send(validUser);

    expect(response.status).toBe(201);

    const serialized = JSON.stringify(response.body);

    expect(serialized).not.toContain(validUser.password);
    expect(serialized).not.toContain("HASH_PRIVADO");
    expect(response.body.data).not.toHaveProperty("password");
    expect(response.body.data).not.toHaveProperty("password_hash");
  });

  it("responde 409 ante un email duplicado", async () => {
    const error = new Error("Email duplicado");
    error.code = "EMAIL_CONFLICT";

    registerUserInSupabase.mockRejectedValue(error);

    const response = await request(app)
      .post("/auth/register")
      .send(validUser);

    expect(response.status).toBe(409);
    expect(response.body.code).toBe("EMAIL_CONFLICT");
    expect(response.body.errors).toHaveProperty("email");
  });

  it("responde 400 cuando faltan campos", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ email: "prueba@example.com" });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(registerUserInSupabase).not.toHaveBeenCalled();
  });

  it("responde 400 ante un email inválido", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        ...validUser,
        email: "correo-invalido",
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(registerUserInSupabase).not.toHaveBeenCalled();
  });

  it("responde 400 ante una contraseña inválida", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        ...validUser,
        password: "123",
      });

    expect(response.status).toBe(400);
    expect(registerUserInSupabase).not.toHaveBeenCalled();
  });

  it("responde 400 ante un cuerpo vacío", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({});

    expect(response.status).toBe(400);
    expect(registerUserInSupabase).not.toHaveBeenCalled();
  });

  it("responde 500 sin revelar detalles internos", async () => {
    registerUserInSupabase.mockRejectedValue(
      new Error("SUPABASE_SERVICE_ROLE_KEY INTERNAL_SECRET")
    );

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      const response = await request(app)
        .post("/auth/register")
        .send(validUser);

      expect(response.status).toBe(500);
      expect(response.body.code).toBe("INTERNAL_ERROR");
      expect(response.body.message).toBe(
        "Error interno del servidor"
      );

      const serialized = JSON.stringify(response.body);

      expect(serialized).not.toContain("INTERNAL_SECRET");
      expect(serialized).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
      expect(serialized).not.toContain("stack");
      expect(serialized).not.toContain(validUser.password);
    } finally {
      consoleSpy.mockRestore();
    }
  });
});
