const Inicio = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px 20px",
        background: "linear-gradient(135deg, #f0f4ff, #dbeafe)",
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "20px", color: "#1d4ed8" }}>
        🛍️ Bienvenido a Spirit Market
      </h1>
      <p style={{ fontSize: "1.3rem", maxWidth: "600px", margin: "0 auto", color: "#374151" }}>
        Descubrí productos únicos del Amazonas, seleccionados con amor y sabiduría ancestral. 
        Armá tu carrito, revisá tu pedido y recibe todo en la puerta de tu hogar.
      </p>
      <img
        src="https://images.unsplash.com/photo-1508780709619-79562169bc64"
        alt="Amazon Spirit"
        style={{ margin: "30px auto 0", maxWidth: "400px", width: "100%", borderRadius: "20px", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
      />
    </div>
  );
};

export default Inicio;