// src/components/landing/LandingPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HeroSection from './HeroSection';
import AuthCard from './AuthCard';
import InfoCard from './InfoCard';
import SecurityCard from './SecurityCard';
import StatsBar from './StatsBar';
import Footer from './Footer';
import { getStats } from '../../services';

/**
 * LandingPage
 *
 * Componente de página principal que ensambla la pantalla de presentación
 * y acceso a partir de sus subcomponentes dedicados.
 */
function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/registro');

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      {/* ── Navegación superior fija ──────────────────────── */}
      <Header onLoginClick={goToLogin} />

      <main className="flex-grow pt-20">
        {/* ── Banner principal ─────────────────────────────── */}
        <HeroSection
          title="Gestión de Alto Impacto"
          subtitle="Potenciamos su crecimiento institucional con precisión matemática y visión estratégica de mercado."
          showLogo
          minHeight="h-[65vh]"
        />

        {/* ── Área de acciones en cuadrícula bento ─────────── */}
        <section className="max-w-7xl mx-auto px-margin-desktop relative z-20 pb-3xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
            {/* Izquierda: tarjeta de acceso y registro (8 columnas) */}
            <AuthCard
              onLogin={goToLogin}
              onRegister={goToRegister}
            />

            {/* Derecha: tarjetas informativas apiladas (4 columnas) */}
            <div className="md:col-span-4 flex flex-col gap-lg">
              <InfoCard />
              <SecurityCard />
            </div>
          </div>

          {/* ── Barra de estadísticas e indicadores ────────── */}
          <StatsBar stats={stats} />
        </section>
      </main>

      {/* ── Pie de página ─────────────────────────────────── */}
      <Footer />
    </div>
  );
}

export default LandingPage;
