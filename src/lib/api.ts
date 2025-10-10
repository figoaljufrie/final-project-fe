import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use(
  (config) => {
    const isPublicRoute =
      config.url?.includes("/verify-email") ||
      config.url?.includes("/reset-password");

    if (isPublicRoute) {
      return config;
    }

    let token: string | null = null;
    try {
      token = useAuthStore.getState().token || localStorage.getItem("token");
    } catch {}

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      try {
        useAuthStore.getState().logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {}
      
      // Only redirect if we're not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const setAuthToken = (token?: string) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export default api;
