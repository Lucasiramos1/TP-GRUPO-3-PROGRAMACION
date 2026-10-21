// Servicio de autenticación del backend: lógica de registro con Supabase Auth.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Registra un nuevo usuario en Supabase Auth.
 * @param {{ nombre: string, email: string, password: string }} datos
 * @returns {{ user: object }}
 * @throws {Error} con propiedad `code` para errores conocidos
 */
export async function registerUserInSupabase({ nombre, email, password }) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: email.trim(),
    password,
    user_metadata: { nombre: nombre.trim() },
    email_confirm: true,
  });

  if (error) {
    const err = new Error(error.message);

    // Detectar email duplicado
    if (
      error.message.toLowerCase().includes('already registered') ||
      error.message.toLowerCase().includes('already been registered') ||
      error.message.toLowerCase().includes('unique') ||
      error.code === '23505'
    ) {
      err.code = 'EMAIL_CONFLICT';
    } else {
      err.code = 'INTERNAL_ERROR';
    }

    throw err;
  }

  return { user: data.user };
}
