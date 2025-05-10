// src/pages/Pedidos.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);  // Guardamos el usuarioId
  const [esAdmin, setEsAdmin] = useState(false);

  // Obtener el usuarioId desde el localStorage (suponiendo que el ID del usuario está guardado)
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioId");  // Cambia esto a la manera en que guardas el usuarioId
    if (usuarioGuardado) {
      setUsuarioId(usuarioGuardado);
      obtenerPedidos(usuarioGuardado);  // Cargamos los pedidos solo para ese usuario
    }

    // Verificamos si el usuario tiene la clave de admin
    const claveGuardada = localStorage.getItem("clave_admin");
    const claveAdmin = import.meta.env.VITE_CLAVE_ADMIN;

    if (claveGuardada === claveAdmin) {
      setEsAdmin(true);  // Si la clave coincide, es un administrador
    }
  }, []);

  const obtenerPedidos = async (usuarioId) => {
    try {
      const res = await api.get(`/pedidos/?usuarioId=${usuarioId}`);  // Filtramos por usuarioId
      setPedidos(res.data);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    }
  };

  const eliminarPedido = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar pedido?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/pedidos/${id}`);
        Swal.fire("✅ Eliminado", "El pedido fue eliminado.", "success");
        obtenerPedidos(usuarioId);  // Recargamos los pedidos después de eliminar
      } catch (err) {
        console.error("Error al eliminar pedido:", err);
        Swal.fire("❌ Error", "No se pudo eliminar el pedido.", "error");
      }
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) =>
    pedido.cliente.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ padding: "30px" }}>
      <h2>📋 Tus pedidos realizados</h2>

      <input
        type="text"
        placeholder="🔍 Buscar por cliente..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "20px", padding: "10px", width: "100%", maxWidth: "400px" }}
      />

      {pedidosFiltrados.length === 0 ? (
        <p>No hay pedidos para mostrar.</p>
      ) : (
        pedidosFiltrados.map((pedido, i) => (
          <div key={i} className="card" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h4>👤 Cliente: {pedido.cliente}</h4>
            <ul>
              {pedido.productos.map((prod, j) => (
                <li key={j}>
                  {prod.nombre} - {prod.cantidad} x S/{prod.precio_unitario} = S/{prod.subtotal}
                </li>
              ))}
            </ul>
            <strong>Total: S/{pedido.total}</strong>
            <div style={{ marginTop: "10px" }}>
              <Link to={`/pedidos/${pedido._id}`}>
                <button style={{ marginRight: "10px" }}>🔍 Ver detalle</button>
              </Link>
              {esAdmin && (
                <button onClick={() => eliminarPedido(pedido._id)}>🗑️ Eliminar</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Pedidos;