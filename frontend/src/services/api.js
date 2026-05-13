import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const tokenStore = {
  getAccess: () => localStorage.getItem("advisorflow_access"),
  getRefresh: () => localStorage.getItem("advisorflow_refresh"),
  set: ({ access, refresh }) => {
    if (access) localStorage.setItem("advisorflow_access", access);
    if (refresh) localStorage.setItem("advisorflow_refresh", refresh);
  },
  clear: () => {
    localStorage.removeItem("advisorflow_access");
    localStorage.removeItem("advisorflow_refresh");
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && tokenStore.getRefresh()) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: tokenStore.getRefresh(),
        });
        tokenStore.set(data);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenStore.clear();
        window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const unwrapResults = (data) => (Array.isArray(data) ? data : data.results || []);
