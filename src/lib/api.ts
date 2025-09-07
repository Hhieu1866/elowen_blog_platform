import axios from "axios";

const api = axios.create({
  // baseURL: "https://blog-api-nodejs-expressjs.onrender.com/api",
  // baseURL: "http://localhost:3001/api",
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor để xử lý lỗi 401/403 (Unauthorized/Forbidden)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // full reload -> UI reset chắc chắn
    }
    return Promise.reject(error);
  },
);

export default api;
