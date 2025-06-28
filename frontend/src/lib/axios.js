// import axios from "axios";


// const API_URL = import.meta.env.VITE_API_URL || "https://chatgo-app-3.onrender.com";

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });



import axios from "axios";

// Déterminer l'URL de base selon l'environnement
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : import.meta.env.VITE_API_URL; // ne pas fallback sur "/api" ! ❌

if (!API_BASE_URL) {
  console.error("❌ VITE_API_URL n'est pas défini pour l'environnement production !");
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

