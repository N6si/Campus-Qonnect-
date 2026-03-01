import axios from "axios";

// Central API client for the backend
const API = axios.create({
  baseURL: "https://campus-qonnect-a-realtime-social.onrender.com",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
