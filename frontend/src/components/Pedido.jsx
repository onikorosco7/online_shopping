import { useState, useEffect } from "react";
import api from "../api";
import Swal from "sweetalert2";

const Pedido = () => {
  const [cliente, setCliente] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    obtenerResumen();

    // 🔧 Corrección aquí: obtener el ID desde "usuario_actual"
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario_actual"));
    if (usuarioGuardado && usuarioGuardado._id) {
      setUsuarioId(usuarioGuardado._id);
    } else {
      console.warn("Usuario no encontrado en localStorage");
    }
  }, []);

  const obtenerResumen = async () => {
    try {
      const res = await api.get("/carrito/");
      setCarrito(res.data);

      const totalRes = await api.get("/carrito/total");
      setTotal(totalRes.data.total);
    } catch (err) {
      console.error("Error al obtener resumen del carrito:", err);
    }
  };

  const confirmarPedido = async () => {
    if (!cliente.trim()) {
      Swal.fire("⚠️ Nombre requerido", "Por favor ingresá tu nombre.", "warning");
      return;
    }

    if (!usuarioId) {
      Swal.fire("❌ Error", "Usuario no identificado. Iniciá sesión nuevamente.", "error");
      return;
    }

    try {
      const body = {
        cliente: cliente,
        usuarioId: usuarioId,
      };

      await api.post("/pedidos/", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        title: "✅ Pedido realizado",
        text: "Tu pedido fue confirmado con éxito.",
        icon: "success",
        timer: 10000,
        timerProgressBar: true,
        confirmButtonText: "Cerrar",
      });

      // Limpiar después de confirmar
      await api.delete("/carrito/");
      setCarrito([]);
      setTotal(0);
      setCliente("");
    } catch (err) {
      console.error("Error al confirmar:", err.response?.data || err);
      Swal.fire({
        title: "❌ Error",
        text: err.response?.data?.detail || "No se pudo realizar el pedido.",
        icon: "error",
      });
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Confirmar pedido</h2>
      <input
        type="text"
        placeholder="Tu nombre completo"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={confirmarPedido}>Confirmar</button>

      {carrito.length > 0 && (
        <div className="card" style={{ marginTop: "20px" }}>
          <h3>Resumen del pedido</h3>
          <p>Cliente: {cliente || "Sin nombre aún"}</p>
          <ul>
            {carrito.map((prod, i) => (
              <li key={i}>
                {prod.nombre} - {prod.cantidad} x S/{prod.precio_unitario.toFixed(2)} = S/{(
                  prod.precio_unitario * prod.cantidad
                ).toFixed(2)}
              </li>
            ))}
          </ul>
          <h4>Total: S/{total.toFixed(2)}</h4>
        </div>
      )}
    </div>
  );
};

export default Pedido;