import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import LoginForm from "../components/auth/LoginForm";
import { loginUser } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      await loginUser(credentials);
      navigate("/");
    } catch (error) {
      if (error?.message?.toLowerCase().includes("invalid login credentials")) {
        throw new Error("El correo o la contraseña son incorrectos.", {
          cause: error,
        });
      }

      throw error;
    }
  };

  return (
    <main className="login-page">
      <section className="login-page__card">
        <p className="login-page__eyebrow">Consulir App</p>

        <h1>Ingresar</h1>

        <p>
          Accedé a tu cuenta para gestionar tus ingresos, egresos y resultados.
        </p>

        <LoginForm onSubmit={handleLogin} />
      </section>
    </main>
  );
}
