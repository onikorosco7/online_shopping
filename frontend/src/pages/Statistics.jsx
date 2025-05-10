import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import jsPDF from "jspdf";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const Statistics = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [ventasPorDiaSemana, setVentasPorDiaSemana] = useState([]);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const chartRef = useRef();

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const [res1, res2, res3, res4, res5] = await Promise.all([
          axios.get("http://localhost:8000/estadisticas/ventas-totales"),
          axios.get("http://localhost:8000/estadisticas/ventas-por-dia"),
          axios.get("http://localhost:8000/estadisticas/ventas-por-dia-semana"),
          axios.get("http://localhost:8000/estadisticas/producto-mas-vendido"),
          axios.get("http://localhost:8000/estadisticas/clientes-frecuentes"),
        ]);
        setEstadisticas(res1.data);
        setVentasPorDia(Array.isArray(res2.data) ? res2.data : []);
        setVentasPorDiaSemana(res3.data);
        setProductosVendidos(res4.data);
        setClientesFrecuentes(res5.data);
      } catch (error) {
        console.error("❌ Error al obtener estadísticas:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchEstadisticas();
  }, []);

  if (cargando) {
    return <p style={{ color: "#ccc" }}>Cargando estadísticas...</p>;
  }

  if (!estadisticas) {
    return <p style={{ color: "#ccc" }}>⚠️ No se pudieron cargar las estadísticas generales.</p>;
  }

  const ventasOrdenadas = [...ventasPorDia].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  const totalPorDia = ventasOrdenadas.reduce(
    (acc, curr) => acc + curr.total_ventas,
    0
  );

  const chartData = {
    labels: ventasOrdenadas.map((item) =>
      new Date(item.fecha).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Ventas por Día (S/.)",
        data: ventasOrdenadas.map((item) => item.total_ventas),
        backgroundColor: "#00C897",
        borderColor: "#00C897",
        borderWidth: 1,
        hoverBackgroundColor: "#00f5b4",
        hoverBorderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#fff",
        formatter: (value) => `S/ ${value.toFixed(2)}`,
        font: {
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
      },
      y: {
        ticks: { color: "#ccc" },
      },
    },
  };

  const cardStyle = {
    backgroundColor: "#1e1e1e",
    borderRadius: "10px",
    padding: "20px",
    flex: "1",
    margin: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
    textAlign: "center",
    color: "#eee",
    border: "1px solid #333",
    minWidth: "180px",
  };

  const exportarPDF = () => {
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const chart = chartInstance.canvas;
      const image = chart.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      pdf.setFontSize(18);
      pdf.text("📊 Ventas por Día", 14, 20);
      pdf.setFontSize(12);
      pdf.text(`Generado: ${new Date().toLocaleString("es-PE")}`, 14, 28);
      pdf.addImage(image, "PNG", 14, 35, 260, 100);
      pdf.save("reporte_ventas.pdf");
    }
  };

  const exportarPNG = () => {
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const chart = chartInstance.canvas;
      const image = chart.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "grafico_ventas.png";
      link.href = image;
      link.click();
    }
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#121212", minHeight: "100vh", color: "#eee" }}>
      <h2 style={{ marginBottom: "20px" }}>📊 Estadísticas Generales</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: "40px",
      }}>
        <div style={cardStyle}>
          <h3>Total de Ventas</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            S/ {estadisticas.total_ventas?.toFixed(2) ?? "0.00"}
          </p>
        </div>
        <div style={cardStyle}>
          <h3>Pedidos Realizados</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {estadisticas.total_pedidos ?? 0}
          </p>
        </div>
        <div style={cardStyle}>
          <h3>Productos Vendidos</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {estadisticas.productos_vendidos ?? 0}
          </p>
        </div>
      </div>

      <h3 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "10px" }}>📅 Ventas por Día</h3>

      <p style={{ marginBottom: "10px", color: "#00C897" }}>
        Total: <strong>S/ {totalPorDia.toFixed(2)}</strong>
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={exportarPNG}
          style={{
            backgroundColor: "#00C897",
            color: "#000",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
          }}
        >
          📤 Descargar PNG
        </button>

        <button
          onClick={exportarPDF}
          style={{
            backgroundColor: "#005F73",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
          }}
        >
          🧾 Exportar PDF
        </button>
      </div>

      {ventasOrdenadas.length > 0 ? (
        <div
          style={{
            maxWidth: "800px",
            margin: "auto",
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <Bar
            data={chartData}
            options={chartOptions}
            plugins={[ChartDataLabels]}
            ref={chartRef}
          />
        </div>
      ) : (
        <p style={{ color: "#aaa" }}>⚠️ No hay datos de ventas por día aún.</p>
      )}

      <div style={{ marginTop: "40px" }}>
        <h3>📈 Ventas por Día de la Semana</h3>
        <ul>
          {ventasPorDiaSemana.map((item) => (
            <li key={item.dia}>
              {item.dia}: S/ {item.total.toFixed(2)}
            </li>
          ))}
        </ul>

        <h3>📦 Producto Más Vendido</h3>
        <p>{productosVendidos.producto ?? "No disponible"}</p>
        <p>Cantidad: {productosVendidos.cantidad ?? 0}</p>

        <h3>👤 Clientes Frecuentes</h3>
        <ul>
          {clientesFrecuentes.map((cliente) => (
            <li key={cliente.cliente}>
              {cliente.cliente}: {cliente.pedidos} pedidos
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Statistics;