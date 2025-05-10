import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";

const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const CLAVE_ADMIN = import.meta.env.VITE_CLAVE_ADMIN;

  useEffect(() => {
    const claveGuardada = localStorage.getItem("clave_admin");
    if (claveGuardada === CLAVE_ADMIN) {
      setEsAdmin(true);
    }
  }, [CLAVE_ADMIN]);

  useEffect(() => {
    const obtenerPedido = async () => {
      try {
        const res = await api.get(`/pedidos/${id}`);
        setPedido(res.data);
      } catch (err) {
        console.error("Error al obtener el pedido:", err);
        Swal.fire("❌ Error", "No se pudo cargar el pedido", "error");
      } finally {
        setCargando(false);
      }
    };
    obtenerPedido();
  }, [id]);

  const handleEliminar = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar pedido?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/pedidos/${id}`);
        Swal.fire("✅ Pedido eliminado", "", "success");
        navigate("/admin-pedidos");
      } catch (err) {
        console.error("Error al eliminar pedido:", err);
        Swal.fire("❌ Error", "No se pudo eliminar", "error");
      }
    }
  };

  const handleEstadoChange = async (e) => {
    const nuevoEstado = e.target.value;
    try {
      const res = await api.put(`/pedidos/${id}`, { estado: nuevoEstado });
      setPedido({ ...pedido, estado: res.data.estado_actualizado });
      Swal.fire({
        title: "✅ Estado actualizado",
        text: `El nuevo estado es: ${res.data.estado_actualizado}`,
        icon: "success",
        timer: 2500,
        showConfirmButton: false
      });      
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      Swal.fire("❌ Error", "No se pudo actualizar el estado", "error");
    }
  };  

  if (cargando) return <p>⏳ Cargando...</p>;
  if (!pedido) return <p>🚫 Pedido no encontrado</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>🧾 Detalle del Pedido</h2>
      <p><strong>Cliente:</strong> {pedido.cliente}</p>
      <p><strong>Total:</strong> S/{pedido.total}</p>
      <p><strong>Estado:</strong> {esAdmin ? (
        <select
        value={pedido.estado}
        onChange={handleEstadoChange}
        style={{
          padding: "6px 12px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          backgroundColor: "#646cff",
          marginLeft: "10px",
          cursor: "pointer",
        }}
      >
        <option value="Pendiente">🕓 Pendiente</option>
        <option value="Enviado">📦 Enviado</option>
        <option value="Entregado">✅ Entregado</option>
        <option value="Cancelado">❌ Cancelado</option>
      </select>      
      ) : pedido.estado}</p>

      <h4>Productos:</h4>
      <ul>
        {pedido.productos?.length > 0 ? (
          pedido.productos.map((prod, idx) => (
            <li key={idx}>
              {prod.nombre} — {prod.cantidad} x S/{parseFloat(prod.precio_unitario || 0).toFixed(2)} = S/{parseFloat(prod.subtotal || 0).toFixed(2)}
            </li>

          ))
        ) : (
          <li>No hay productos en este pedido.</li>
        )}
      </ul>

      {esAdmin && (
        <button
          onClick={handleEliminar}
          style={{ marginTop: "20px", padding: "10px", backgroundColor: "#aa0000", color: "white" }}
        >
          🗑 Eliminar Pedido
        </button>
      )}
    </div>
  );
};

export default DetallePedido;