import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await api.get("/productos/");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  const manejarCambioCantidad = (productoId, valor) => {
    setCantidades({ ...cantidades, [productoId]: parseInt(valor) });
  };

  const agregarAlCarrito = async (productoId) => {
    const usuario = JSON.parse(localStorage.getItem("usuario_actual"));
    if (!usuario) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito.",
        showConfirmButton: true,
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    const cantidad = cantidades[productoId] || 1;

    try {
      const res = await api.post("/carrito/", {
        producto_id: productoId,
        cantidad: cantidad,
      });

      Swal.fire({
        icon: "success",
        title: "¡Agregado!",
        text: res.data.mensaje,
        timer: 2000,
        showConfirmButton: false,
      });

      setCantidades({ ...cantidades, [productoId]: 1 });
      obtenerProductos();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.detail || "Error al agregar al carrito",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>🛒 Productos disponibles</h2>
      {productos.map((prod) => (
        <div
          key={prod._id}
          className="card"
          style={{
            marginBottom: "30px",
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: "500px"
          }}
        >
          <h4 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>{prod.nombre}</h4>

          {/* Imagen */}
          {prod.imagen && (
            <img
              src={prod.imagen}
              alt={prod.nombre}
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                marginBottom: "10px",
                borderRadius: "6px"
              }}
            />
          )}

          {/* Descripción */}
          {prod.descripcion && (
            <p style={{ fontSize: "14px", color: "#ddd", marginBottom: "10px" }}>
              {prod.descripcion}
            </p>
          )}

          <p><strong>Precio:</strong> S/ {prod.precio}</p>
          <p><strong>Stock:</strong> {prod.stock}</p>

          <label>Cantidad: </label>
          <input
            type="number"
            min="1"
            max={prod.stock}
            value={cantidades[prod._id] || 1}
            onChange={(e) => manejarCambioCantidad(prod._id, e.target.value)}
            style={{ width: "60px", marginRight: "10px" }}
          />

          <button
            onClick={() => agregarAlCarrito(prod._id)}
            style={{
              marginRight: "10px",
              padding: "6px 12px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Agregar al carrito
          </button>

          <Link to={`/productos/${prod._id}`}>
            <button
              style={{
                padding: "6px 12px",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Ver detalle
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Producto;