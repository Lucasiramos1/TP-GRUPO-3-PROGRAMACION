import { getSupabaseClient } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser({ nombre, email, password }) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    const json = await response.json();

    if (response.ok) {
      return {
        data: json.data,
        error: null,
        fieldErrors: null,
      };
    }

    return {
      data: null,
      error: json.message ?? "Error al crear la cuenta.",
      fieldErrors: json.errors ?? null,
    };
  } catch {
    return {
      data: null,
      error: "No se pudo conectar con el servidor. Intentá nuevamente.",
      fieldErrors: null,
    };
  }
}

export async function loginUser({ email, password }) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}