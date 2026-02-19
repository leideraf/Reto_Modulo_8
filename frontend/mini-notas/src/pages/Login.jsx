import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import useFormValidation from "../hooks/useFormValidation";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { getFieldProps, validateAll, reset } = useFormValidation({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const email = getFieldProps("email").value;
      const password = getFieldProps("password").value;

      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      const auth = {
        token: response.data.access_token,
        user: response.data.user,
        exp: Date.now() + 30 * 60 * 1000, // 30 min
      };

      localStorage.setItem("auth", JSON.stringify(auth));

      reset();
      navigate("/notes");

    } catch (error) {
      setErrorMessage("Credenciales incorrectas.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white px-4">
      
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
        
        {/* Logo / Icono */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white text-2xl px-4 py-2 rounded-xl shadow-lg">
            🔐
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Bienvenido de nuevo
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Inicia sesión para gestionar tus notas
        </p>

        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-600 text-sm p-3 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@email.com"
              {...getFieldProps("email")}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...getFieldProps("password")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5 rounded-lg text-white font-semibold
              bg-blue-600 hover:bg-blue-700
              transition duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
