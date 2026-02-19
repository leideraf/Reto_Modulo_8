import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import ProtectedRoute from "./routes/ProtectedRoute";

// ======================================================
// FUNCIÓN DE AUTENTICACIÓN SIMPLE
// ======================================================
const isAuthenticated = () => {
  const raw = localStorage.getItem("auth");
  if (!raw) return false;

  try {
    const auth = JSON.parse(raw);
    return !!auth.token;
  } catch {
    return false;
  }
};

function App() {
  const authenticated = isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= RUTA RAÍZ ================= */}
        <Route
          path="/"
          element={
            authenticated
              ? <Navigate to="/notes" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* ================= RUTAS PÚBLICAS ================= */}
        <Route
          path="/login"
          element={
            authenticated
              ? <Navigate to="/notes" replace />
              : <Login />
          }
        />

        <Route
          path="/register"
          element={
            authenticated
              ? <Navigate to="/notes" replace />
              : <Register />
          }
        />

        {/* ================= RUTA PROTEGIDA ================= */}
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

