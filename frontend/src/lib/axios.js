// import axios from "axios";


// const API_URL = import.meta.env.VITE_API_URL || "https://chatgo-app-3.onrender.com";

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });



import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5001" : "/api",
  withCredentials: true,
});