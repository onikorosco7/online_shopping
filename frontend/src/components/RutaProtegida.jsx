// src/components/RutaProtegida.jsx
import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children }) => {
  const usuario = localStorage.getItem("usuario_actual");

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;