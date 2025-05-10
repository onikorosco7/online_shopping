import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // o la dirección donde está tu backend
});

export default api;