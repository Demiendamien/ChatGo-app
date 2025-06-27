// import axios from "axios";


// const API_URL = import.meta.env.VITE_API_URL || "https://chatgo-app-3.onrender.com";

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });



import axios from "axios";

// Définir l'URL de base en fonction de l'environnement
const API_BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5001/api"
  : import.meta.env.VITE_API_URL || "/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // autorise l'envoi des cookies (auth)
});
