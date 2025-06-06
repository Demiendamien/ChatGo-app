import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development"
        ? "http://localhost:5101/api"
        : "https://chat-app-2.onrender.com/api",
    withCredentials: true,
});