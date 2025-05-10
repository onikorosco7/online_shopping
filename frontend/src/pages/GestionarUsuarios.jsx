import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api";  // Asegúrate de que esta ruta sea correcta

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerUsuarios = async () => {
    try {
      const res = await api.get("/usuarios"); // Solicitud GET a la API
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
      Swal.fire("❌ Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  const eliminarUsuario = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/usuarios/${id}`);
        Swal.fire("✅ Eliminado", "Usuario eliminado correctamente", "success");
        obtenerUsuarios(); // Recargar la lista de usuarios
      } catch (err) {
        console.error("Error al eliminar usuario", err);
        Swal.fire("❌ Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) => u.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👥 Gestión de Usuarios</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">👤 Nombre</th>
              <th className="px-4 py-2">📧 Correo</th>
              <th className="px-4 py-2">🛠️ Rol</th>
              <th className="px-4 py-2">❌ Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario._id} className="border-t">
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2">{usuario.correo}</td>
                <td className="px-4 py-2 text-center">{usuario.rol}</td>
                <td className="px-4 py-2 text-center">
                  {usuario.rol !== "admin" && (
                    <button
                      onClick={() => eliminarUsuario(usuario._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionarUsuarios;