import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Helper to set/clear token globally
export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;