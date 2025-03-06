import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";
import { baseURL } from "../utils/baseURL";

// Use baseURL directly, which switches between development and production
const qrBaseURL = baseURL;

const QrLogin = () => {
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

  // QR code value (URL for emergency request)
  const qrCodeValue = `${qrBaseURL}/emergency/guest-request`;

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

        try {
          const response = await fetch(qrCodeValue, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude,
              longitude,
              emergency_type: "unspecified",
            }),
          });

          const result = await response.json();
          setLoading(false);

          if (response.ok) {
            setRequestSent(true);
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
            </Box>
          )}
          <Button
            onClick={requestSent ? resetState : handleEmergencyRequest}
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
            }}
          >
            {requestSent ? "Request Another" : "Request Emergency Now"}
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default QrLogin;