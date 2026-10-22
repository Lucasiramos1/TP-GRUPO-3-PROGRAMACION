// Utilidades de validación de datos de entrada.

const EMAIL_REGEX = /^[^@\s]{1,64}@[^@\s]{1,253}\.[^@\s.]{2,}$/;

/**
 * Valida los datos del cuerpo de la petición de registro.
 * @param {{ nombre?: unknown, email?: unknown, password?: unknown }} body
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateRegisterBody(body) {
  const errors = {};
  const { nombre, email, password } = body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
    errors.nombre = !nombre ? 'Campo requerido' : 'Debe tener al menos 3 caracteres';
  }

  if (!email || typeof email !== 'string') {
    errors.email = 'Campo requerido';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Formato inválido';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Campo requerido';
  } else if (password.length < 8) {
    errors.password = 'Debe tener al menos 8 caracteres';
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Debe incluir al menos una letra mayúscula';
  } else if (!/[a-z]/.test(password)) {
    errors.password = 'Debe incluir al menos una letra minúscula';
  } else if (!/[0-9]/.test(password)) {
    errors.password = 'Debe incluir al menos un número';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
