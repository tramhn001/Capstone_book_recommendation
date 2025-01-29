import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

// Create an axios instance with default settings
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// add authorization to header to every request if a token exits.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;


