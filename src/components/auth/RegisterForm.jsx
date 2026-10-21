import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateRegisterField,
  validateRegisterForm,
} from "../../utils/authValidations";
import { registerUser } from "../../services/authService";
import "./RegisterForm.css";

const initialFormData = {
  nombre: "",
  email: "",
  password: "",
};

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formErrors = validateRegisterForm(formData);
  const isFormValid = Object.keys(formErrors).length === 0;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setSuccessMessage("");
    setGeneralError("");

    if (touched[name]) {
      const fieldError = validateRegisterField(name, value);

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    const fieldError = validateRegisterField(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  const getInputClassName = (fieldName) => {
    if (errors[fieldName]) {
      return "form-input input-error";
    }

    if (
      touched[fieldName] &&
      !errors[fieldName] &&
      formData[fieldName]
    ) {
      return "form-input input-success";
    }

    return "form-input";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateRegisterForm(formData);

    setTouched({
      nombre: true,
      email: true,
      password: true,
    });

    setErrors(validationErrors);
    setSuccessMessage("");
    setGeneralError("");

    if (Object.keys(validationErrors).length > 0) {
      setGeneralError(
        "Revisá los campos marcados antes de continuar.",
      );
      return;
    }

    try {
      setIsLoading(true);

      const { error, fieldErrors } = await registerUser({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (fieldErrors) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            ...fieldErrors,
          }));
        }

        setGeneralError(error);
        return;
      }

      setFormData(initialFormData);
      setTouched({});
      setErrors({});

      setSuccessMessage(
        "Cuenta creada correctamente. Redirigiendo al inicio de sesión...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      setGeneralError(
        "Ocurrió un error al crear la cuenta. Intentá nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-card">
        <div className="register-header">
          <p className="brand-label">Consulir</p>

          <h1>Crea tu cuenta</h1>

          <p>
            Unite a Consulir y gestioná tus finanzas con precisión
            profesional.
          </p>
        </div>

        {generalError && (
          <div
            className="alert alert-error"
            role="alert"
          >
            {generalError}
          </div>
        )}

        {successMessage && (
          <div
            className="alert alert-success"
            role="status"
          >
            {successMessage}
          </div>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={isLoading}
        >
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre completo
            </label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej. Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={getInputClassName("nombre")}
              aria-invalid={Boolean(errors.nombre)}
              aria-describedby={
                errors.nombre
                  ? "nombre-error"
                  : undefined
              }
            />

            {errors.nombre && (
              <small
                id="nombre-error"
                className="field-error"
              >
                {errors.nombre}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@consulir.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={getInputClassName("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email
                  ? "email-error"
                  : undefined
              }
            />

            {errors.email && (
              <small
                id="email-error"
                className="field-error"
              >
                {errors.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
            </label>

            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={getInputClassName(
                  "password",
                )}
                aria-invalid={Boolean(
                  errors.password,
                )}
                aria-describedby={
                  errors.password
                    ? "password-error"
                    : undefined
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (prevValue) => !prevValue,
                  )
                }
                disabled={isLoading}
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword
                  ? "Ocultar"
                  : "Ver"}
              </button>
            </div>

            {errors.password ? (
              <small
                id="password-error"
                className="field-error"
              >
                {errors.password}
              </small>
            ) : (
              touched.password &&
              formData.password && (
                <small className="field-success">
                  Contraseña segura.
                </small>
              )
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={
              isLoading || !isFormValid
            }
          >
            {isLoading ? (
              <span className="button-loading">
                <span
                  className="spinner"
                  aria-hidden="true"
                />
                Procesando...
              </span>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}