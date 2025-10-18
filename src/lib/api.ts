import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  // process.env.NEXT_PUBLIC_API_BASE_URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (status === 401) {
      if (!requestUrl?.includes("/users/me")) {
        useAuthStore.getState().clearUser();
        
        // Force redirect to login if not already on auth pages
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
          window.location.href = '/auth/login';
        }
      }
    }

    if (status === 403) {
      useAuthStore.getState().clearUser();
      
      // Force redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
