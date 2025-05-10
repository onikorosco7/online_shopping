import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  const CLAVE_ADMIN = import.meta.env.VITE_CLAVE_ADMIN;

  useEffect(() => {
    const claveGuardada = localStorage.getItem("clave_admin");
    if (claveGuardada === CLAVE_ADMIN) {
      setAutorizado(true);
    } else {
      Swal.fire("🔒 Acceso restringido", "No estás autorizado", "warning");
    }
    setVerificando(false);
  }, [CLAVE_ADMIN]);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const res = await api.get("/pedidos/");
        setPedidos(res.data);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
        Swal.fire("❌ Error", "No se pudieron cargar los pedidos", "error");
      } finally {
        setCargando(false);
      }
    };

    if (autorizado) {
      obtenerPedidos();
    }
  }, [autorizado]);

  if (verificando) {
    return <p style={{ padding: "20px" }}>🔐 Verificando acceso...</p>;
  }

  if (!autorizado) {
    return <p style={{ padding: "20px" }}>🚫 Acceso denegado</p>;
  }

  if (cargando) {
    return <p style={{ padding: "20px" }}>⏳ Cargando pedidos...</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>📦 Listado de Pedidos (Admin)</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos disponibles.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {pedidos.map((pedido) => (
            <li key={pedido._id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <p><strong>Cliente:</strong> {pedido.cliente}</p>
              <p><strong>Total:</strong> S/{pedido.total}</p>
              <Link to={`/pedidos/${pedido._id}`}>🔍 Ver Detalle</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPedidos;