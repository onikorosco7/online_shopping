// AdminPanel.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AgregarProducto from "./AgregarProducto";
import AdminPedidos from "./AdminPedidos";
import AdminProductos from "./AdminProductos";
import GestionarUsuarios from "./GestionarUsuarios";
import Statistics from "./Statistics"; // 👈 Agrega esto junto a los otros imports

const AdminPanel = () => {
  const CLAVE_ADMIN = import.meta.env.VITE_CLAVE_ADMIN;
  const [autorizado, setAutorizado] = useState(false);
  const [clave, setClave] = useState("");
  const [vista, setVista] = useState("productos");

  useEffect(() => {
    const claveGuardada = localStorage.getItem("clave_admin");
    const usuarioGuardado = localStorage.getItem("usuario_actual");

    console.log("Clave guardada:", claveGuardada);
    if (claveGuardada === CLAVE_ADMIN && usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      if (usuario.rol === "admin") {
        setAutorizado(true);
      } else {
        Swal.fire("❌ Acceso denegado", "No tienes permisos de administrador", "error");
      }
    }
  }, [CLAVE_ADMIN]);

  const verificarClave = () => {
    if (clave === CLAVE_ADMIN) {
      localStorage.setItem("clave_admin", clave);

      const usuarioAdmin = {
        nombre: "Administrador",
        rol: "admin",
      };
      localStorage.setItem("usuario_actual", JSON.stringify(usuarioAdmin));

      setAutorizado(true);
      Swal.fire("✅ Acceso concedido", "Bienvenido al panel", "success");
    } else {
      Swal.fire("❌ Acceso denegado", "Contraseña incorrecta", "error");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("clave_admin");
    localStorage.removeItem("usuario_actual");
    setAutorizado(false);
    setClave("");
    Swal.fire("🔒 Sesión cerrada", "Saliste del panel admin", "info");
  };

  if (!autorizado) {
    return (
      <div style={{ padding: "40px", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
        <h2>🔐 Acceso Admin</h2>
        <input
          type="password"
          placeholder="Clave de administrador"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />
        <button onClick={verificarClave}>Ingresar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>⚙️ Panel de Administración</h2>
        <button onClick={cerrarSesion}>🔓 Cerrar sesión</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setVista("productos")} style={{ marginRight: "10px" }}>
          🛒 Gestionar Productos
        </button>
        <button onClick={() => setVista("pedidos")} style={{ marginRight: "10px" }}>
          📦 Ver Pedidos
        </button>
        <button onClick={() => setVista("agregar_producto")} style={{ marginRight: "10px" }}>
          ➕ Agregar Producto
        </button>
        <button onClick={() => setVista("usuarios")}style={{ marginRight: "10px" }}>
          👥 Gestionar Usuarios</button>
        <button onClick={() => setVista("estadisticas")}>📊 Estadísticas</button>
      </div>

      {vista === "productos" && <AdminProductos />}
      {vista === "pedidos" && <AdminPedidos />}
      {vista === "agregar_producto" && <AgregarProducto />}
      {vista === "usuarios" && <GestionarUsuarios />}
      {vista === "estadisticas" && <Statistics />}
    </div>
  );
};

export default AdminPanel;