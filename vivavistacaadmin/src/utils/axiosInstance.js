// src/utils/axiosInstance.js
import axios from "axios";
import { Base_url } from "./api";

const axiosInstance = axios.create({
  baseURL: `${Base_url}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
