import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await api.get(`/productos/${id}`);
        setProducto(res.data);
      } catch (err) {
        console.error("Error al obtener el producto:", err);
      }
    };

    obtenerProducto();
  }, [id]);

  if (!producto) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div className="card" style={{ marginTop: "20px" }}>
        <h2>{producto.nombre}</h2>
        <p><strong>Precio:</strong> S/{producto.precio}</p>
        <p><strong>Stock disponible:</strong> {producto.stock}</p>
        <p><strong>Descripción:</strong> {producto.descripcion || "Sin descripción."}</p>
        {producto.imagen && (
          <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%", maxWidth: "500px", marginTop: "20px" }} />
        )}
      </div>
      <Link to="/productos" style={{ color: "#2563eb", textDecoration: "underline", marginBottom: "20px", display: "inline-block" }}>
        ← Volver a Productos
      </Link>
    </div>
  );
};

export default DetalleProducto;