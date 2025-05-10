import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    try {
      const datos = localStorage.getItem("usuario_actual");
      if (datos) {
        const usuarioParseado = JSON.parse(datos);
        if (usuarioParseado?.nombre) {
          setUsuario(usuarioParseado);
        } else {
          localStorage.removeItem("usuario_actual");
        }
      }
    } catch (error) {
      console.error("Error al parsear usuario_actual:", error);
      localStorage.removeItem("usuario_actual");
    }
  }, []);  

  const cerrarSesion = () => {
    localStorage.removeItem("usuario_actual");
    localStorage.removeItem("clave_admin");
    setUsuario(null);
    navigate("/login");
  };

  return (
    <nav
      className="navbar"
      style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <Link to="/inicio">🏡 Inicio</Link>
        <Link to="/productos">🛍️ Productos</Link>
        <Link to="/carrito">🛒 Carrito</Link>
        <Link to="/resumen">📄 Resumen</Link>
        <Link to="/pedidos">🗂️ Pedidos</Link>
        {usuario?.rol === "admin" && <Link to="/admin">🛠️ Panel Admin</Link>}
      </div>

      <div>
        {usuario ? (
          <>
            👤 {usuario.nombre}{" "}
            <button onClick={cerrarSesion} style={{ marginLeft: "10px" }}>
              🔓 Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">🔐 Iniciar sesión</Link>{" "}
            <Link to="/register" style={{ marginLeft: "10px" }}>
              📝 Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;