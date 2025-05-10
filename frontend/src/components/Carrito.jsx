import { useState, useEffect } from "react";
import api from "../api";
import Swal from "sweetalert2";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    obtenerCarrito();
  }, []);

  const obtenerCarrito = async () => {
    try {
      const res = await api.get("/carrito/");
      setCarrito(res.data);
    } catch (err) {
      console.error("Error al obtener el carrito:", err);
    }
  };

  const eliminarDelCarrito = async (productoId) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Este producto será eliminado del carrito.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (confirmacion.isConfirmed) {
      try {
        const res = await api.delete(`/carrito/${productoId}`);
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: res.data.mensaje,
          timer: 2000,
          showConfirmButton: false,
        });
        obtenerCarrito();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.detail || "Error al eliminar",
        });
      }
    }
  };  

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    try {
      const res = await api.put("/carrito/", {
        producto_id: productoId,
        nueva_cantidad: nuevaCantidad,
      });
      setMensaje(res.data.mensaje);
      obtenerCarrito();
    } catch (err) {
      setMensaje(err.response?.data?.detail || "Error al actualizar cantidad");
    }
  };

  const calcularTotal = () => {
    return carrito
      .reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0)
      .toFixed(2);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Carrito</h2>
      {mensaje && <p>{mensaje}</p>}
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {carrito.map((item) => (
            <div key={item._id} className="card">
              <h4>{item.nombre}</h4>
              <p>Precio: S/{item.precio_unitario}</p>
              <p>
                Cantidad: {item.cantidad}
                <button onClick={() => actualizarCantidad(item.producto_id, item.cantidad - 1)} disabled={item.cantidad <= 1}>➖</button>
                <button onClick={() => actualizarCantidad(item.producto_id, item.cantidad + 1)}>➕</button>
              </p>
              <p>Stock restante: {item.stock_restante}</p>
              <button onClick={() => eliminarDelCarrito(item.producto_id)}>Eliminar</button>
            </div>
          ))}
          <h3>Total: S/{calcularTotal()}</h3>
        </div>
      )}
    </div>
  );
};

export default Carrito;