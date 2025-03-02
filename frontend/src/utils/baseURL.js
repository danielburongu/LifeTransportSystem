// frontend/src/utils/baseURL.js
const isProduction = process.env.NODE_ENV === "production";
export const baseURL = isProduction
  ? "https://life-transport-system-backend.onrender.com/api"
  : "http://localhost:5000/api";