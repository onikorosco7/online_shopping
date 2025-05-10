// App.jsx
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Resumen from "./pages/Resumen";
import DetalleProducto from "./pages/DetalleProducto";
import Pedidos from "./pages/Pedidos";
import DetallePedido from "./pages/DetallePedido";
import AgregarProducto from "./pages/AgregarProducto";
import AdminPedidos from "./pages/AdminPedidos";
import AdminPanel from "./pages/AdminPanel";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import RutaProtegida from "./components/RutaProtegida";
import Statistics from './pages/Statistics';

const CLAVE_ADMIN = import.meta.env.VITE_CLAVE_ADMIN;

function App() {
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const clave = localStorage.getItem("clave_admin");
    console.log("Valor de clave_admin en localStorage:", clave);
    setEsAdmin(clave === CLAVE_ADMIN);
  }, []);

  return (
    <main className="container">
      <Navbar esAdmin={esAdmin} />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />

        {/* Rutas protegidas por login */}
        <Route path="/carrito" element={<RutaProtegida><Carrito /></RutaProtegida>} />
        <Route path="/resumen" element={<RutaProtegida><Resumen /></RutaProtegida>} />

        {/* Rutas para los pedidos */}
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pedidos/:id" element={<DetallePedido />} />

        {/* Ruta admin disponible siempre, sin depender de esAdmin */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/estadisticas" element={<Statistics />} />

        {/* Rutas de autenticación */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  );
}

export default App;