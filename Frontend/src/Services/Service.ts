import axios from "axios";

// Shared axios instance so auth headers and future client-wide behavior live in one place.
export const api = axios.create();

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");

    if (token) {
        // Most backend routes are token-protected, so attach the bearer token automatically.
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
