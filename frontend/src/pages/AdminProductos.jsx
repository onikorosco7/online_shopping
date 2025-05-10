import { useEffect, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

const GestionarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtrarStockBajo, setFiltrarStockBajo] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  const obtenerProductos = async () => {
    try {
      const res = await api.get("/productos/");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos", err);
      Swal.fire("❌ Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const eliminarProducto = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/productos/${id}`);
        Swal.fire("✅ Eliminado", "Producto eliminado correctamente", "success");
        obtenerProductos();
      } catch (err) {
        console.error("Error al eliminar producto", err);
        Swal.fire("❌ Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditar(producto);
  };

  const cerrarModal = () => {
    setProductoEditar(null);
  };

  const guardarCambios = async () => {
    try {
      await api.put(`/productos/${productoEditar._id}`, {
        nombre: productoEditar.nombre,
        descripcion: productoEditar.descripcion,
        precio: parseFloat(productoEditar.precio),
        stock: parseInt(productoEditar.stock),
        imagen: productoEditar.imagen,
      });
      Swal.fire("✅ Editado", "Producto actualizado correctamente", "success");
      obtenerProductos();
      cerrarModal();
    } catch (err) {
      console.error("Error al editar producto", err);
      Swal.fire("❌ Error", "No se pudo actualizar el producto", "error");
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleStock = !filtrarStockBajo || p.stock < 5;
    return coincideNombre && cumpleStock;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📦 Gestión de Productos</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filtrarStockBajo}
            onChange={() => setFiltrarStockBajo(!filtrarStockBajo)}
          />
          Mostrar solo stock bajo (&lt; 5)
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">🛒 Nombre</th>
              <th className="px-4 py-2 text-left">📝 Descripción</th>
              <th className="px-4 py-2">💰 Precio</th>
              <th className="px-4 py-2">📦 Stock</th>
              <th className="px-4 py-2">🖼️ URL Imagen</th>
              <th className="px-4 py-2">✏️ Editar</th>
              <th className="px-4 py-2">❌ Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto._id} className="border-t">
                <td className="px-4 py-2">{producto.nombre}</td>
                <td className="px-4 py-2">{producto.descripcion}</td>
                <td className="px-4 py-2 text-center">S/{producto.precio}</td>
                <td className="px-4 py-2 text-center">{producto.stock}</td>
                <td className="px-4 py-2 text-center">
                  {producto.imagen ? (
                    <a
                      href={producto.imagen}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver imagen
                    </a>
                  ) : (
                    "No disponible"
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => abrirModalEdicion(producto)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => eliminarProducto(producto._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {productoEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">✏️ Editar Producto</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={productoEditar.nombre}
              onChange={(e) => setProductoEditar({ ...productoEditar, nombre: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={productoEditar.descripcion}
              onChange={(e) => setProductoEditar({ ...productoEditar, descripcion: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Precio"
              value={productoEditar.precio}
              onChange={(e) => setProductoEditar({ ...productoEditar, precio: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Stock"
              value={productoEditar.stock}
              onChange={(e) => setProductoEditar({ ...productoEditar, stock: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="URL de Imagen"
              value={productoEditar.imagen}
              onChange={(e) => setProductoEditar({ ...productoEditar, imagen: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={cerrarModal} className="bg-gray-300 px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={guardarCambios} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarProductos;