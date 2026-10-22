import { createClient } from "@supabase/supabase-js";

let supabase;

export function getSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Falta configurar VITE_SUPABASE_URL en .env.local",
    );
  }

  if (!supabaseUrl.includes(".supabase.co")) {
    throw new Error(
      `La URL de Supabase no parece válida. Valor recibido: ${supabaseUrl}`,
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Falta configurar VITE_SUPABASE_ANON_KEY en .env.local",
    );
  }

  if (!supabase) {
    supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
    );
  }

  return supabase;
}