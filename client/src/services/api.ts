import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-patrimonio.onrender.com/api/",
});

export default api;