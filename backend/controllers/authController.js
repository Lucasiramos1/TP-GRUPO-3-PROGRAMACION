// Controlador de autenticación: gestiona las peticiones HTTP de registro.
import { validateRegisterBody } from '../utils/validation.js';
import { registerUserInSupabase } from '../services/authService.js';

/**
 * POST /auth/register
 * Registra un nuevo usuario. Devuelve respuestas estandarizadas:
 *   201 — Usuario creado correctamente
 *   400 — Error de validación en los datos de entrada
 *   409 — El email ya está registrado
 *   500 — Error interno del servidor
 */
export async function registerController(req, res) {
  // Validación en backend
  const { valid, errors } = validateRegisterBody(req.body);

  if (!valid) {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Faltan campos requeridos o tienen formato inválido',
      errors,
      data: null,
    });
  }

  const { nombre, email, password } = req.body;

  try {
    const { user } = await registerUserInSupabase({ nombre, email, password });

    return res.status(201).json({
      status: 'success',
      code: 'USER_CREATED',
      message: 'Usuario creado exitosamente',
      data: {
        id: user.id,
        email: user.email,
        nombre: user.user_metadata?.nombre,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    if (err.code === 'EMAIL_CONFLICT') {
      return res.status(409).json({
        status: 'error',
        code: 'EMAIL_CONFLICT',
        message: 'El email ya está registrado en el sistema',
        errors: { email: 'Email duplicado' },
        data: null,
      });
    }

    console.error('Error en registro:', err.message);

    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
      errors: null,
      data: null,
    });
  }
}
