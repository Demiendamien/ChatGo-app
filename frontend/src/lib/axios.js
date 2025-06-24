const API_URL = import.meta.env.VITE_API_URL || "https://chat-app-2.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});