import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-6 text-center">
      {/* ❌ Animated Error Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-red-600 text-9xl font-bold"
        style={{ fontFamily: "'Poppins', sans-serif" }} 
      >
        ❌
      </motion.div>

      {/* 404 Message */}
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-teal-700 mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ fontFamily: "'Poppins', sans-serif" }} 
      >
        Oops! Page Not Found
      </motion.h1>

      <p
        className="text-gray-600 text-lg md:text-xl mt-4 max-w-lg" 
        style={{ fontFamily: "'Poppins', sans-serif" }} 
      >
        The page you're looking for is temporarily unavailable.
      </p>

      {/* 🔘 Return Home Button */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Link
          to="/"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
          style={{ fontFamily: "'Poppins', sans-serif" }} 
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;