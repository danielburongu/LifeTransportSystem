import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography, Button, CircularProgress } from "@mui/material"; // Added CircularProgress
import { Link } from "react-router-dom";
import { baseURL } from "../utils/baseURL"; // Import baseURL

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSuccess("✅ Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setError(data.message || "❌ Registration failed. Please check your details.");
      }
    } catch (error) {
      setLoading(false);
      setError("❌ Network error. Please try again later.");
      console.error("Registration error:", error);
    }
  };

  return (
    <Box
      className="w-full min-h-screen flex items-center justify-center m-0 p-0 mt-24"
      sx={{ bgcolor: "#f5f5f5" }} // Updated from #ff to light gray
    >
      <motion.div
        className="bg-white p-6 md:p-12 rounded-lg shadow-lg w-full max-w-lg border border-red-600 mt-6"
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
          Register
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
          Create an account to get started
        </Typography>

        {error && (
          <Typography
            className="text-red-600 bg-red-100 p-2 rounded mb-4"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {error}
          </Typography>
        )}
        {success && (
          <Typography
            className="text-green-600 bg-green-100 p-2 rounded mb-4"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none text-gray-800"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none text-gray-800"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={user.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none text-gray-800"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none text-gray-800"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-600 focus:outline-none text-gray-800"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <option value="patient">Patient</option>
            <option value="police">Police</option>
            <option value="hospital_staff">Hospital Staff</option>
            <option value="ambulance_driver">Ambulance Driver</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location (Optional)"
            value={user.location}
            onChange={handleChange}
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
                Registering...
              </>
            ) : (
              "Register"
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 font-semibold hover:text-red-700 transition duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Login
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

export default Register;