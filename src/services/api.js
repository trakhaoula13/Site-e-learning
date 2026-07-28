import axios from "axios";

// Origine du backend : lit la variable d'environnement VITE_API_URL en production
// (définie sur Render/Vercel/Netlify...), et retombe sur localhost en développement.
export const BACKEND_ORIGIN =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: `${BACKEND_ORIGIN}/api`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;