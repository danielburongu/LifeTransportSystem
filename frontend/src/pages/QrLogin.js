import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Html5QrcodeScanner } from "html5-qrcode"; // Use html5-qrcode instead
import Navbar from "../components/Navbar";

const QrLogin = () => {
  const [isQrScannerActive, setIsQrScannerActive] = useState(true); // Scanner active by default
  const [qrError, setQrError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const scannerRef = useRef(null);

  // Initialize QR scanner
  useEffect(() => {
    if (isQrScannerActive && !scannerRef.current) {
      const qrCodeScanner = new Html5QrcodeScanner(
        "qr-reader", // DOM element ID
        { fps: 10, qrbox: 250 }, // Config: frames per second, QR box size
        false // Verbose logging off
      );

      qrCodeScanner.render(
        (decodedText) => handleQrScan(decodedText), // Success callback
        (error) => handleQrError(error) // Error callback
      );

      scannerRef.current = qrCodeScanner;

      // Cleanup on unmount or toggle
      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear();
          scannerRef.current = null;
        }
      };
    }
  }, [isQrScannerActive]);

  // QR code scan handler
  const handleQrScan = async (data) => {
    if (data) {
      setQrError(null);

      // Assume QR code contains "emergency-request"
      if (data.includes("emergency-request")) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              // Send guest emergency request to backend
              try {
                const response = await fetch("http://localhost:5000/api/emergency/guest-request", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    latitude,
                    longitude,
                    emergency_type: "unspecified", // Default type
                  }),
                });

                if (response.ok) {
                  setRequestSent(true);
                  setIsQrScannerActive(false);
                  if (scannerRef.current) {
                    scannerRef.current.clear();
                    scannerRef.current = null;
                  }
                } else {
                  setQrError("Failed to process emergency request. Please try again.");
                }
              } catch (err) {
                setQrError("Error connecting to server. Please try again.");
              }
            },
            (error) => {
              setQrError("Unable to get your location. Please allow location access.");
            }
          );
        } else {
          setQrError("Geolocation is not supported by your browser.");
        }
      } else {
        setQrError("Invalid QR code. Scan a Life Transport emergency QR code.");
      }
    }
  };

  const handleQrError = (err) => {
    setQrError("Error scanning QR code. Please try again.");
    console.error(err);
  };

  const handleQrToggle = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsQrScannerActive(false);
    setQrError(null);
    setRequestSent(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-4 mt-6">
              Instant Emergency Access
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Scan the QR code to request emergency services instantly—no sign-up needed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto"
          >
            {isQrScannerActive ? (
              <>
                <div className="text-center mb-6">
                  <FontAwesomeIcon icon={faQrcode} className="text-teal-700 text-5xl mb-2" />
                  <h2 className="text-2xl font-bold text-teal-700">Scan QR Code</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    Point your camera at the Life Transport QR code to request help.
                  </p>
                </div>
                <div id="qr-reader" style={{ width: "100%" }}></div> {/* QR scanner renders here */}
                {qrError && <p className="text-red-600 text-sm text-center mt-4">{qrError}</p>}
                <button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg mt-6 transition-all duration-300"
                  onClick={handleQrToggle}
                >
                  Cancel
                </button>
              </>
            ) : requestSent ? (
              <>
                <div className="text-center mb-6">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-5xl mb-2" />
                  <h2 className="text-2xl font-bold text-teal-700">Emergency Requested</h2>
                  <p className="text-gray-600 text-base mt-2">
                    Help is on the way! Your location has been shared with emergency services.
                  </p>
                </div>
                <button
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-lg transition-all duration-300"
                  onClick={handleQrToggle}
                >
                  Scan Another QR
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <FontAwesomeIcon icon={faQrcode} className="text-teal-700 text-5xl mb-2" />
                  <h2 className="text-2xl font-bold text-teal-700">Ready to Scan</h2>
                  <p className="text-gray-600 text-base mt-2">
                    Click below to start scanning a QR code for instant emergency access.
                  </p>
                </div>
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all duration-300"
                  onClick={() => setIsQrScannerActive(true)}
                >
                  Start Scanning
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QrLogin;