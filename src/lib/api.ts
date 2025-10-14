import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
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
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (status === 401) {
      if (!requestUrl?.includes("/users/me")) {
        useAuthStore.getState().clearUser();
      }
    }

    if (status === 403) {
      useAuthStore.getState().clearUser();
    }

    return Promise.reject(error);
  }
);

export default api;
