import { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import "../login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    correo: "",
    contraseña: "",
  });

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formulario);

      localStorage.setItem("usuario_actual", JSON.stringify(res.data.usuario));
      localStorage.setItem("usuarioId", res.data.usuario._id);

      Swal.fire("¡Bienvenido!", `Hola ${res.data.usuario.nombre}`, "success").then(() => {
        window.location.href = "/inicio";
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: err.response?.data?.detail || "Correo o contraseña incorrectos",
      });
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-titulo">🔐 Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Correo electrónico:</label>
        <input
          type="email"
          name="correo"
          value={formulario.correo}
          onChange={handleChange}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          name="contraseña"
          value={formulario.contraseña}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-boton">
          Ingresar
        </button>
      </form>
      <p className="login-link">
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;