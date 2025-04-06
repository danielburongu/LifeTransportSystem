import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Button, CircularProgress, Input, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";
import { baseURL } from "../utils/baseURL";

const qrBaseURL = baseURL;

const QrLogin = () => {
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // New state for image
  const [urgency, setUrgency] = useState(""); // State for urgency level

  const qrCodeValue = `${qrBaseURL}/emergency/guest-request`;

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Handle urgency change
  const handleUrgencyChange = (event) => {
    setUrgency(event.target.value);
  };

  const handleEmergencyRequest = async () => {
    setLoading(true);
    setQrError(null);

    if (!navigator.geolocation) {
      setLoading(false);
      setQrError("❌ Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Validate required fields
        if (!latitude || !longitude || !urgency) {
          setLoading(false);
          setQrError("❌ All fields are required.");
          return;
        }

        // Use FormData to send both text and optional image
        const formData = new FormData();
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("emergency_type", "unspecified");
        formData.append("urgency", urgency); // Add urgency to FormData
        if (selectedImage) {
          formData.append("image", selectedImage);
        }

        // Log FormData contents for debugging
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        try {
          const response = await fetch(qrCodeValue, {
            method: "POST",
            body: formData, // No headers needed; FormData sets Content-Type automatically
          });

          const result = await response.json();
          setLoading(false);

          if (response.ok) {
            setRequestSent(true);
            setSelectedImage(null); // Clear image after successful request
          } else {
            setQrError(result.message || "❌ Failed to process emergency request. Please try again.");
          }
        } catch (err) {
          setLoading(false);
          setQrError("❌ Network error. Please check your connection and try again.");
          console.error("API error:", err);
        }
      },
      (error) => {
        setLoading(false);
        let errorMessage = "❌ Unable to get your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "❌ Location access denied. Please allow location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "❌ Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "❌ Location request timed out.";
            break;
          default:
            errorMessage = "❌ An unknown error occurred.";
        }
        setQrError(errorMessage);
        console.error("Geolocation error:", error);
      },
      { timeout: 10000, maximumAge: 0 }
    );
  };

  const resetState = () => {
    setRequestSent(false);
    setQrError(null);
    setLoading(false);
    setSelectedImage(null); // Reset image state
    setUrgency(""); // Reset urgency state
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
        <Navbar />
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: "#00695C",
            textAlign: "center",
            mb: 4,
            mt: 2,
          }}
        >
          Instant Emergency Access
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
          Scan this QR code with your phone to request emergency services instantly
        </Typography>

        {qrError && (
          <Typography
            className="text-red-600 bg-red-100 p-2 rounded mb-4 text-center"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {qrError}
          </Typography>
        )}
        {requestSent && !loading && (
          <Typography
            className="text-green-600 bg-green-100 p-2 rounded mb-4 text-center"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            ✅ Emergency Requested! Help is on the way.
          </Typography>
        )}

        <Box className="space-y-6">
          {loading ? (
            <Box className="text-center">
              <CircularProgress size={24} sx={{ color: "#D32F2F", mb: 1 }} />
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1rem",
                  color: "#D32F2F",
                }}
              >
                Processing your request...
              </Typography>
            </Box>
          ) : requestSent ? (
            <Box className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-5xl mb-2" />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#00695C",
                }}
              >
                Emergency Requested
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1rem",
                  color: "#00695C",
                  mt: 2,
                }}
              >
                Help is on the way! Your location has been shared with emergency services.
              </Typography>
            </Box>
          ) : (
            <Box className="text-center">
              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <QRCodeCanvas value={qrCodeValue} size={200} level="H" />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#00695C",
                }}
              >
                Scan for Emergency Help
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1rem",
                  color: "#00695C",
                  mt: 2,
                }}
              >
                Use your phone’s camera or QR scanner to request assistance instantly
              </Typography>
              {/* Image Upload Section */}
              <Box sx={{ mt: 3 }}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                {selectedImage && (
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.9rem",
                      color: "#00695C",
                    }}
                  >
                    Selected: {selectedImage.name}
                  </Typography>
                )}
              </Box>

              {/* Urgency Dropdown Section */}
              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select
                    value={urgency}
                    onChange={handleUrgencyChange}
                    label="Urgency Level"
                    disabled={loading}
                  >
                    <MenuItem value="Critical">Critical</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                    <MenuItem value="Normal">Normal</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box className="mt-8">
                <Button
                  onClick={handleEmergencyRequest}
                  variant="contained"
                  color="error"
                  sx={{
                    width: "100%",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  Request Emergency Help
                </Button>
              </Box>
              <Box className="mt-4">
                <Button
                  onClick={resetState}
                  variant="outlined"
                  color="primary"
                  sx={{
                    width: "100%",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  Reset Form
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default QrLogin;
