import { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "../register.css";  // Importa el archivo CSS

const Register = () => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", formulario);
      Swal.fire("¡Registrado!", res.data.mensaje, "success").then(() => {
        navigate("/login");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: err.response?.data?.detail || "Error desconocido",
      });
    }
  };

  return (
    <div className="registro-container">
      <h2 className="registro-titulo">📝 Registrarse</h2>
      <form onSubmit={handleSubmit} className="registro-form">
        <label>Nombre de usuario:</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          required
        />

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

        <button type="submit" className="registro-boton">
          Registrar
        </button>
      </form>
      <p className="registro-link">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;