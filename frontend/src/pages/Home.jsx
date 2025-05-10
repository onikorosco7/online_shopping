import Producto from "../components/Producto";
import Carrito from "../components/Carrito";
import Pedido from "../components/Pedido";

const Home = () => {
  return (
    <div style={{ padding: "20px", display: "flex", gap: "40px" }}>
      <div style={{ flex: 2 }}>
        <Producto />
      </div>
      <div style={{ flex: 1 }}>
        <Carrito />
        <Pedido />
      </div>
    </div>
  );
};

export default Home;