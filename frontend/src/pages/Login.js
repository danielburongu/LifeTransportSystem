import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { baseURL } from "../utils/baseURL";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        login(data.user, data.token);
      } else {
        setError(data.message || "❌ Login failed. Please check your credentials.");
      }
    } catch (error) {
      setLoading(false);
      setError("❌ Network error. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <Box
      className="w-full min-h-screen flex items-center justify-center m-0 p-0 mt-24"
      sx={{ bgcolor: "#f5f5f5" }}
    >
      <motion.div
        className="bg-white p-6 md:p-12 rounded-lg shadow-lg w-full max-w-lg border border-red-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: "#00695C",
            textAlign: "center",
            mb: 4,
          }}
        >
          Login
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "1rem", md: "1.25rem" },
            color: "#00695C",
            textAlign: "center",
            mb: 4,
          }}
        >
          Sign in to access your dashboard
        </Typography>

        {error && (
          <Typography
            className="text-red-600 bg-red-100 p-2 rounded mb-4"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none text-gray-800"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none text-gray-800"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />

          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            sx={{
              bgcolor: "#D32F2F",
              color: "#FFFFFF",
              width: "100%",
              p: 2,
              fontSize: "1.125rem",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily: "'Poppins', sans-serif",
              "&:hover": { bgcolor: "#C62828" },
              "&:disabled": { bgcolor: "#B0BEC5" },
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "#FFFFFF", mr: 1 }} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1rem",
            color: "#00695C",
            textAlign: "center",
            mt: 4,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-red-600 font-semibold hover:text-red-700 transition duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Register
          </Link>
        </Typography>

        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.9rem",
            color: "#00695C",
            textAlign: "center",
            mt: 2,
          }}
        >
          <Link
            to="/Qr-login"
            className="text-red-600 font-semibold hover:text-red-700 transition duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Use QR Code Login
          </Link>{" "}
          for instant emergency access
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Login;