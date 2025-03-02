import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Html5QrcodeScanner } from "html5-qrcode";
import Navbar from "../components/Navbar";
import { baseURL } from "../utils/baseURL";

const QrLogin = () => {
  const [isQrScannerActive, setIsQrScannerActive] = useState(true);
  const [qrError, setQrError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isQrScannerActive && !scannerRef.current) {
      const qrCodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      qrCodeScanner.render(
        (decodedText) => handleQrScan(decodedText),
        (error) => handleQrError(error)
      );

      scannerRef.current = qrCodeScanner;

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear();
          scannerRef.current = null;
        }
      };
    }
  }, [isQrScannerActive]);

  const handleQrScan = async (data) => {
    if (data) {
      setQrError(null);
      setLoading(true);

      if (data.includes("emergency-request")) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              try {
                const response = await fetch(`${baseURL}/emergency/guest-request`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    latitude,
                    longitude,
                    emergency_type: "unspecified",
                  }),
                });

                const data = await response.json();
                setLoading(false);

                if (response.ok) {
                  setRequestSent(true);
                  setIsQrScannerActive(false);
                  if (scannerRef.current) {
                    scannerRef.current.clear();
                    scannerRef.current = null;
                  }
                } else {
                  setQrError(data.message || "❌ Failed to process emergency request. Please try again.");
                }
              } catch (err) {
                setLoading(false);
                setQrError("❌ Network error. Please try again later.");
                console.error("QR scan error:", err);
              }
            },
            (error) => {
              setLoading(false);
              setQrError("❌ Unable to get your location. Please allow location access.");
            }
          );
        } else {
          setLoading(false);
          setQrError("❌ Geolocation is not supported by your browser.");
        }
      } else {
        setLoading(false);
        setQrError("❌ Invalid QR code. Scan a Life Transport emergency QR code.");
      }
    }
  };

  const handleQrError = (err) => {
    setLoading(false);
    setQrError("❌ Error scanning QR code. Please try again.");
    console.error("QR scanner error:", err);
  };

  const handleQrToggle = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsQrScannerActive(false);
    setQrError(null);
    setRequestSent(false);
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
          Scan the QR code to request emergency services instantly—no sign-up needed
        </Typography>

        {qrError && (
          <Typography
            className="text-red-600 bg-red-100 p-2 rounded mb-4"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {qrError}
          </Typography>
        )}
        {requestSent && !loading && (
          <Typography
            className="text-green-600 bg-green-100 p-2 rounded mb-4"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            ✅ Emergency Requested! Help is on the way.
          </Typography>
        )}

        {isQrScannerActive ? (
          <Box className="space-y-4">
            <Box className="text-center mb-6">
              <FontAwesomeIcon icon={faQrcode} className="text-teal-700 text-5xl mb-2" />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#00695C",
                }}
              >
                Scan QR Code
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1rem",
                  color: "#00695C",
                }}
              >
                Point your camera at the Life Transport QR code to request help
              </Typography>
            </Box>
            <Box id="qr-reader" sx={{ width: "100%" }}></Box>
            {loading && (
              <Box className="text-center">
                <CircularProgress size={20} sx={{ color: "#D32F2F", mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1rem",
                    color: "#D32F2F",
                  }}
                >
                  Processing...
                </Typography>
              </Box>
            )}
            <Button
              onClick={handleQrToggle}
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
              Cancel
            </Button>
          </Box>
        ) : (
          <Box className="space-y-4">
            {requestSent ? (
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
                <FontAwesomeIcon icon={faQrcode} className="text-teal-700 text-5xl mb-2" />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: "#00695C",
                  }}
                >
                  Ready to Scan
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1rem",
                    color: "#00695C",
                    mt: 2,
                  }}
                >
                  Click below to start scanning a QR code for instant emergency access
                </Typography>
              </Box>
            )}
            <Button
              onClick={() => setIsQrScannerActive(true)}
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
                mt: 2,
              }}
            >
              {requestSent ? "Scan Another QR" : "Start Scanning"}
            </Button>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default QrLogin;