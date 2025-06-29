import axios from 'axios';

const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5001'
    : import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error('❌ VITE_API_URL n’est pas défini !');
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
