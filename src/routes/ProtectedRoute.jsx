// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // TODO: reemplazar por la lógica real de autenticación (T-14/T-15)
  const isAuthenticated = true; // valor temporal hasta integrar sesión

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
