import axios from "axios";
import { notify } from "../Utils/Notify";

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

api.interceptors.response.use(
    response => response,
    error => {
        if (error?.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            notify.error("Your session has expired. Please log in again.");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);
