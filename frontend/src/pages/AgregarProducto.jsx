// src/components/AgregarProducto.jsx
import { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

const AgregarProducto = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
  });

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/productos/", {
        ...producto,
        precio: parseFloat(producto.precio),
        stock: parseInt(producto.stock),
      });

      Swal.fire("✅ Éxito", "Producto agregado correctamente", "success");
      setProducto({ nombre: "", descripcion: "", precio: "", stock: "", imagen: "" });
    } catch (err) {
      console.error("Error al agregar producto:", err);
      Swal.fire("❌ Error", "No se pudo agregar el producto", "error");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>🆕 Agregar Producto</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={producto.nombre}
          onChange={handleChange}
          required
          style={{ margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={producto.descripcion}
          onChange={handleChange}
          required
          style={{ margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={producto.precio}
          onChange={handleChange}
          required
          style={{ margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={producto.stock}
          onChange={handleChange}
          required
          style={{ margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de Imagen"
          value={producto.imagen}
          onChange={handleChange}
          style={{ margin: "10px 0", padding: "8px", width: "100%" }}
        />

        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
          ➕ Agregar Producto
        </button>
      </form>
    </div>
  );
};

export default AgregarProducto;