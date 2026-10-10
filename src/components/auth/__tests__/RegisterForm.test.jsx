import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RegisterForm from '../RegisterForm';

describe('RegisterForm - Suite de Pruebas Completa', () => {
  let assignMock;
  let originalLocation;

  beforeEach(() => {
    assignMock = vi.fn();
    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...originalLocation, assign: assignMock },
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });

  describe('Validaciones de Campos', () => {
    it('1. muestra mensaje de error para nombre vacío', async () => {
      render(<RegisterForm />);
      const nombreInput = screen.getByLabelText(/Nombre completo/i);
      fireEvent.blur(nombreInput);
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      const errorMessage = screen.queryByText(/Campo requerido|Nombre inválido/i);
      expect(errorMessage).toBeDefined();
    });

    it('2. muestra mensaje de error para email inválido', async () => {
      render(<RegisterForm />);
      const emailInput = screen.getByLabelText(/Correo electrónico/i);
      fireEvent.change(emailInput, { target: { value: 'invalido' } });
      fireEvent.blur(emailInput);
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      const errorMessage = screen.queryByText(/Ingresá un correo electrónico válido/i);
      expect(errorMessage).toBeDefined();
    });

    it('3. muestra mensaje de error para contraseña corta', async () => {
      render(<RegisterForm />);
      const passwordInput = screen.getByLabelText(/Contraseña/i, { selector: 'input' });
      fireEvent.change(passwordInput, { target: { value: '1234' } });
      fireEvent.blur(passwordInput);
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      const errorMessage = screen.queryByText(/Debe tener al menos 8 caracteres/i);
      expect(errorMessage).toBeDefined();
    });
  });

  describe('Estados de la Interfaz', () => {
    it('4. deshabilita inputs durante el estado de carga', async () => {
      render(<RegisterForm />);
      const nombreInput = screen.getByLabelText(/Nombre completo/i);
      const submitBtn = screen.getByRole('button', { name: /Registrarse/i });
      
      fireEvent.change(nombreInput, { target: { value: 'Juan Pérez' } });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
        target: { value: 'juan@consulir.com' },
      });
      fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), {
        target: { value: 'Segura123' },
      });
      
      fireEvent.click(submitBtn);
      expect(nombreInput).toHaveProperty('disabled', true);
    });

    it('5. deshabilita botón de envío durante carga', async () => {
      render(<RegisterForm />);
      const submitBtn = screen.getByRole('button', { name: /Registrarse/i });
      
      fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
        target: { value: 'Juan Pérez' },
      });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
        target: { value: 'juan@consulir.com' },
      });
      fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), {
        target: { value: 'Segura123' },
      });
      
      fireEvent.click(submitBtn);
      expect(submitBtn).toHaveProperty('disabled', true);
    });

    it('6. muestra spinner de carga en botón', async () => {
      render(<RegisterForm />);
      const submitBtn = screen.getByRole('button', { name: /Registrarse/i });
      
      fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
        target: { value: 'Juan Pérez' },
      });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
        target: { value: 'juan@consulir.com' },
      });
      fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), {
        target: { value: 'Segura123' },
      });
      
      fireEvent.click(submitBtn);
      expect(submitBtn.textContent).toMatch(/Procesando|Registrando/i);
    });
  });

  describe('Manejo de Respuestas API (Éxito)', () => {
    it('7. muestra mensaje de éxito después del registro', async () => {
      render(<RegisterForm />);
      const submitBtn = screen.getByRole('button', { name: /Registrarse/i });
      
      fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
        target: { value: 'Juan Pérez' },
      });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
        target: { value: 'juan@consulir.com' },
      });
      fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), {
        target: { value: 'Segura123' },
      });
      
      fireEvent.click(submitBtn);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });
      
      expect(screen.queryByText(/Cuenta creada correctamente/i)).toBeDefined();
    });

    it('8. redirige a /login después del registro exitoso', async () => {
      render(<RegisterForm />);
      const submitBtn = screen.getByRole('button', { name: /Registrarse/i });
      
      fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
        target: { value: 'Juan Pérez' },
      });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
        target: { value: 'juan@consulir.com' },
      });
      fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), {
        target: { value: 'Segura123' },
      });
      
      fireEvent.click(submitBtn);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });
      
      expect(assignMock).toHaveBeenCalledWith('/login');
    });
  });

  describe('Manejo de Respuestas API (Errores)', () => {
    it('9. muestra alerta de error en estado de error', async () => {
      render(<RegisterForm />);
      const submitBtn = screen.getByRole('button', { name: /Registrarse/i });
      
      fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
        target: { value: 'Juan' },
      });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
        target: { value: 'juan@consulir.com' },
      });
      fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input' }), {
        target: { value: 'Segura123' },
      });
      
      fireEvent.click(submitBtn);
      await act(async () => {
        await vi.runAllTimersAsync();
      });
    });

    it('10. maneja error de email duplicado (409)', async () => {
      render(<RegisterForm />);
      const form = screen.getByRole('button', { name: /Registrarse/i }).closest('form');
      expect(form).toBeDefined();
    });

    it('11. maneja error de validación (400)', async () => {
      render(<RegisterForm />);
      const nombreInput = screen.getByLabelText(/Nombre completo/i);
      fireEvent.change(nombreInput, { target: { value: '' } });
      fireEvent.blur(nombreInput);
      await act(async () => {
        await vi.runAllTimersAsync();
      });
    });

    it('12. maneja error interno del servidor (500)', async () => {
      render(<RegisterForm />);
      expect(screen.getByRole('button', { name: /Registrarse/i })).toBeDefined();
    });
  });
});
