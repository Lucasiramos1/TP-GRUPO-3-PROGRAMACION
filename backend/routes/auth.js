// Rutas de autenticación.
import { Router } from 'express';
import { registerController } from '../controllers/authController.js';

const router = Router();

// POST /auth/register
router.post('/register', registerController);

export default router;
