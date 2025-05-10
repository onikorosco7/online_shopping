import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // por si usas cookies o tokens
});

// Manejador global de errores (opcional)
api.interceptors.response.use(
  response => response,
  error => {
    console.error("Error de API:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;