// frontend/src/utils/baseURL.js
const isProduction = process.env.NODE_ENV === "production";

// Base URL for API requests (includes /api prefix)
export const baseURL = isProduction
  ? "https://life-transport-system-backend.onrender.com/api"
  : "http://localhost:5000/api";

// Base URL for static assets (no /api prefix)
export const staticBaseURL = isProduction
  ? "https://life-transport-system-backend.onrender.com"
  : "http://localhost:5000";