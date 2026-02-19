import { Navigate } from "react-router-dom";

// Función pura fuera del componente
const checkAuth = () => {
  const raw = localStorage.getItem("auth");
  if (!raw) return false;

  try {
    const auth = JSON.parse(raw);
    const now = Date.now();

    if (!auth.token || now > auth.exp) {
      localStorage.removeItem("auth");
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem("auth");
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const isAuthorized = checkAuth();

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;




