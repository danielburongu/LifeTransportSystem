import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <motion.footer
      className="w-full py-8 md:py-12 bg-teal-700 text-white m-0 p-0 text-center mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Footer Content Container */}
      <Box className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
        {/* Branding & Tagline */}
        <Box className="flex flex-col items-center md:items-start">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'font-poppins', sans-serif",
                fontSize: { xs: "1.75rem", md: "2rem" },
                fontWeight: 700,
                color: "#FFFFFF",
                mb: 1,
              }}
            >
              Life Transport
            </Typography>
            <Typography
              sx={{
                fontFamily: "'font-poppins', sans-serif",
                fontSize: { xs: "0.875rem", md: "1rem" },
                color: "#FFFFFF",
              }}
            >
              Saving lives, one ride at a time.
            </Typography>
          </motion.div>
        </Box>

        {/* Navigation Links */}
        <Box className="flex flex-col items-center md:items-start">
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'font-poppins', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#FFFFFF",
              mb: 3,
            }}
          >
            Quick Links
          </Typography>
          <nav className="flex flex-col space-y-2">
            {[
              { text: "Home", path: "/" },
              { text: "About Us", path: "/about-us" },
              { text: "Contact", path: "/contact" },
              { text: "Services", path: "/services" },
              { text: "Privacy Policy", path: "/privacy-policy" },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-white hover:text-red-600 transition duration-300 ease-in-out"
                style={{ fontFamily: "'font-poppins', sans-serif", fontSize: "0.875rem" }}
              >
                {item.text}
              </Link>
            ))}
          </nav>
        </Box>

        {/* Contact Info */}
        <Box className="flex flex-col items-center md:items-start">
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'font-poppins', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#FFFFFF",
              mb: 3,
            }}
          >
            Connect With Us
          </Typography>
          <ul className="mb-4 space-y-2 text-white" style={{ fontFamily: "'font-poppins', sans-serif", fontSize: "0.875rem" }}>
            <li>
              📩 Email:{" "}
              <a href="mailto:support@lifetransport.com" className="hover:text-red-600 transition duration-300">
                support@lifetransport.com
              </a>
            </li>
            <li>
              📞 Phone:{" "}
              <a href="tel:18005433100" className="hover:text-red-600 transition duration-300">
                1-800-LIFE-RIDE
              </a>
            </li>
          </ul>
        </Box>
      </Box>

      {/* Copyright Section */}
      <Box className="mt-6 border-t border-red-600 pt-4 w-full max-w-7xl mx-auto px-6 md:px-12">
        <Typography
          sx={{
            fontFamily: "'font-poppins', sans-serif",
            fontSize: "0.75rem",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Life Transport System | All Rights Reserved
        </Typography>
      </Box>
    </motion.footer>
  );
};

export default Footer;