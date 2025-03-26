import React, { useEffect, useState, useContext, useMemo } from "react";
import socket from "../socketClient";
import { AuthContext } from "../context/AuthContext";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Modal,
  Fade,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  LinearProgress,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigationIcon from "@mui/icons-material/Navigation";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { baseURL } from "../utils/baseURL";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Custom Icons
const ambulanceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const emergencyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Haversine formula to calculate distance (in kilometers)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Calculate ETA (in minutes) based on distance and average speed (40 km/h)
const calculateETA = (distance) => {
  const speed = 40; // Average speed in km/h
  const timeInHours = distance / speed;
  return Math.round(timeInHours * 60); // Convert to minutes
};

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");
  const [assignedEmergencies, setAssignedEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [filterPriority, setFilterPriority] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapExpanded, setMapExpanded] = useState(true);
  const [emergenciesExpanded, setEmergenciesExpanded] = useState(true);
  const [driverStatus, setDriverStatus] = useState("Available");

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#D32F2F" },
      secondary: { main: "#00695C" },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      h4: {
        fontSize: isMobile ? "1.5rem" : "2.125rem", // Responsive font size for header
      },
      h5: {
        fontSize: isMobile ? "1.25rem" : "1.5rem",
      },
      body2: {
        fontSize: isMobile ? "0.8rem" : "0.875rem",
      },
      caption: {
        fontSize: isMobile ? "0.7rem" : "0.75rem",
      },
    },
  });

  // Status and Priority color mappings
  const statusColors = { dispatched: "warning", completed: "success" };
  const priorityColors = { High: "#D32F2F", Medium: "#FF9800", Low: "#00695C" };

  // Real-time Location
  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage("❌ Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        socket.emit("ambulance_location_update", {
          userId: user?.id,
          latitude,
          longitude,
        });
      },
      (error) => {
        setMessage(`❌ Failed to get location: ${error.message}`);
        setNotification({
          open: true,
          message: `❌ Failed to get location: ${error.message}`,
          severity: "error",
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);

  // Socket and Emergency Fetch
  useEffect(() => {
    fetchAssignedEmergencies();

    socket.on("ambulance_assigned", (updatedEmergency) => {
      console.log("Received new assigned emergency:", updatedEmergency);
      setAssignedEmergencies((prev) => [...prev, updatedEmergency]);
      setNotification({
        open: true,
        message: "🚨 New emergency assigned!",
        severity: "warning",
      });
      playAlertSound();
    });

    socket.on("patient_arrived", (emergency) => {
      console.log("Emergency marked as completed:", emergency);
      setAssignedEmergencies((prev) =>
        prev.filter((e) => e._id !== emergency._id)
      );
      setNotification({
        open: true,
        message: "✅ An emergency has been completed!",
        severity: "success",
      });
    });

    socket.on(`patient_update_${user?.id}`, (updatedEmergency) => {
      console.log("Received patient update:", updatedEmergency);
      setAssignedEmergencies((prev) =>
        prev.map((e) => (e._id === updatedEmergency._id ? updatedEmergency : e))
      );
      setNotification({
        open: true,
        message: `✅ Emergency status updated to ${updatedEmergency.status}!`,
        severity: "info",
      });
    });

    return () => {
      socket.off("ambulance_assigned");
      socket.off("patient_arrived");
      socket.off(`patient_update_${user?.id}`);
    };
  }, [user]);

  const fetchAssignedEmergencies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Please log in.");

      const response = await fetch(`${baseURL}/emergency/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No emergencies assigned to you yet.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched assigned emergencies:", data);
      setAssignedEmergencies(data);
      if (data.length === 0) {
        setMessage("No assigned emergencies.");
      } else {
        setMessage("");
      }
    } catch (error) {
      console.error("Error fetching assigned emergencies:", error);
      setMessage(error.message || "❌ Unable to fetch emergencies.");
      setNotification({
        open: true,
        message: error.message || "❌ Unable to fetch emergencies.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (emergencyId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Please log in.");

      const response = await fetch(
        `${baseURL}/emergency/mark-completed/${emergencyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Marked emergency as completed:", data);
      setAssignedEmergencies((prev) =>
        prev.filter((e) => e._id !== emergencyId)
      );
      setMessage("✅ Emergency completed!");
      socket.emit("patient_arrived", data.emergency);
      socket.emit(`patient_update_${data.emergency.user_id}`, data.emergency);
      setNotification({
        open: true,
        message: "✅ Emergency marked as completed!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error marking emergency as completed:", error);
      setMessage(error.message || "❌ Failed to mark as completed.");
      setNotification({
        open: true,
        message: error.message || "❌ Failed to mark as completed!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const playAlertSound = () => {
    const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
    audio.play().catch((err) => console.log("Audio playback failed:", err));
  };

  const handleOpenModal = (emergency) => {
    setSelectedEmergency(emergency);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmergency(null);
  };

  const sortedEmergencies = useMemo(() => {
    return [...assignedEmergencies].sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority || "Low"] - priorityOrder[b.priority || "Low"];
    });
  }, [assignedEmergencies]);

  const filteredEmergencies = useMemo(() => {
    return sortedEmergencies.filter((emergency) => {
      const matchesPriority =
        filterPriority === "All" || emergency.priority === filterPriority;
      const matchesSearch =
        emergency.emergency_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emergency.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPriority && matchesSearch;
    });
  }, [sortedEmergencies, filterPriority, searchQuery]);

  const EmergencyCard = ({ emergency }) => {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const maxTime = 3600; // 1 hour in seconds

    useEffect(() => {
      if (emergency.createdAt) {
        const startTime = new Date(emergency.createdAt).getTime();
        const interval = setInterval(() => {
          setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [emergency.createdAt]);

    const progress = Math.min((timeElapsed / maxTime) * 100, 100);

    // Calculate distance and ETA
    const distance =
      latitude && longitude && emergency.coordinates
        ? haversineDistance(
            latitude,
            longitude,
            emergency.coordinates.latitude,
            emergency.coordinates.longitude
          ).toFixed(2)
        : null;
    const eta = distance ? calculateETA(distance) : null;

    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          bgcolor:
            emergency.priority === "High"
              ? "#ffebee"
              : emergency.priority === "Medium"
              ? "#fff3e0"
              : "#e3f2fd",
          borderLeft: `4px solid ${priorityColors[emergency.priority || "Low"]}`,
          p: isMobile ? 1 : 2, // Reduced padding on mobile
        }}
        aria-label={`Emergency card for ${emergency.emergency_type}`}
      >
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <ReportProblemIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#D32F2F" }} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              flexDirection: isMobile ? "column" : "row", // Stack on mobile
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                fontFamily: "'Poppins', sans-serif'",
                mb: isMobile ? 1 : 0,
                fontSize: isMobile ? "1rem" : "1.25rem",
              }}
            >
              {emergency.emergency_type.toUpperCase()} ({emergency.priority || "Low"})
            </Typography>
            <Chip
              label={emergency.status.toUpperCase()}
              color={statusColors[emergency.status] || "default"}
              size="small"
              sx={{ fontWeight: 500, fontFamily: "'Poppins', sans-serif'" }}
            />
          </Box>
          <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
            <LocationOnIcon sx={{ mr: 0.5, color: "#D32F2F", fontSize: isMobile ? 18 : 20 }} />
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
              {emergency.location}
            </Typography>
          </Box>
          <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
            <AccessTimeIcon sx={{ mr: 0.5, color: "#D32F2F", fontSize: isMobile ? 18 : 20 }} />
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
              {new Date(emergency.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
            <PersonIcon sx={{ mr: 0.5, color: "#D32F2F", fontSize: isMobile ? 18 : 20 }} />
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
              {emergency.victim_name || "Not provided"}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
            <strong>Age:</strong> {emergency.victim_age || "Not provided"}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
            <strong>Sex:</strong> {emergency.victim_sex || "Not provided"}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
            <strong>Police Case No:</strong> {emergency.police_case_no || "Not provided"}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
            <strong>Description:</strong> {emergency.incident_description || "Not provided"}
          </Typography>
          {distance && eta && (
            <Typography
              variant="body2"
              sx={{ color: "#616161", mb: 2, fontFamily: "'Poppins', sans-serif'" }}
            >
              Distance: {distance} km | ETA: {eta} min
            </Typography>
          )}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 1,
              bgcolor: progress > 75 ? "#D32F2F" : progress > 50 ? "#FF9800" : "#00695C",
              "& .MuiLinearProgress-bar": {
                bgcolor: progress > 75 ? "#D32F2F" : progress > 50 ? "#FF9800" : "#00695C",
              },
            }}
          />
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontFamily: "'Poppins', sans-serif'" }}
          >
            Time Active: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#D32F2F",
              "&:hover": { bgcolor: "#C62828" },
              fontFamily: "'Poppins', sans-serif'",
              mb: 1,
              fontSize: isMobile ? "0.8rem" : "0.875rem",
            }}
            onClick={() => markCompleted(emergency._id)}
            startIcon={
              loading ? (
                <CircularProgress size={isMobile ? 16 : 20} sx={{ color: "#FFFFFF" }} />
              ) : (
                <CheckCircleIcon />
              )
            }
            disabled={loading}
            aria-label={`Mark ${emergency.emergency_type} as completed`}
          >
            {loading ? "Processing..." : "Mark as Completed"}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              mt: 1,
              borderRadius: 2,
              textTransform: "none",
              color: "#D32F2F",
              borderColor: "#D32F2F",
              "&:hover": { borderColor: "#C62828", color: "#C62828" },
              fontFamily: "'Poppins', sans-serif'",
              mb: 1,
              fontSize: isMobile ? "0.8rem" : "0.875rem",
            }}
            onClick={() => handleOpenModal(emergency)}
            aria-label={`View details for ${emergency.emergency_type}`}
          >
            View Details
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              mt: 1,
              borderRadius: 2,
              textTransform: "none",
              color: "#D32F2F",
              borderColor: "#D32F2F",
              "&:hover": { borderColor: "#C62828", color: "#C62828" },
              fontFamily: "'Poppins', sans-serif'",
              fontSize: isMobile ? "0.8rem" : "0.875rem",
            }}
            onClick={() => {
              if (emergency.coordinates) {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${emergency.coordinates.latitude},${emergency.coordinates.longitude}`;
                window.open(url, "_blank");
              } else {
                setMessage("❌ No coordinates available for navigation.");
                setNotification({
                  open: true,
                  message: "❌ No coordinates available for navigation.",
                  severity: "error",
                });
              }
            }}
            startIcon={<NavigationIcon />}
            aria-label={`Navigate to ${emergency.emergency_type} location`}
          >
            Navigate {distance ? `(${distance} km, ${eta} min)` : ""}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="lg"
        sx={{
          mt: isMobile ? 6 : 10, // Reduced top margin on mobile
          pb: 4,
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              bgcolor: "#00695C",
              color: "#FFFFFF",
              p: isMobile ? 2 : 3, // Reduced padding on mobile
              borderRadius: 2,
              mb: 4,
              display: "flex",
              flexDirection: isMobile ? "column" : "row", // Stack on mobile
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Box display="flex" alignItems="center">
              <DirectionsCarIcon
                sx={{ fontSize: isMobile ? 30 : 40, mr: isMobile ? 1 : 2, color: "#FFFFFF" }}
              />
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: "#FFFFFF",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Driver Dashboard
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#E0E0E0",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  Manage Assigned Emergencies
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gap={isMobile ? 1 : 2}
              flexDirection={isMobile ? "row" : "row"}
              width={isMobile ? "100%" : "auto"}
            >
              <FormControl sx={{ minWidth: isMobile ? 120 : 150, width: isMobile ? "50%" : "auto" }}>
                <InputLabel sx={{ fontFamily: "'Poppins', sans-serif'", color: "#FFFFFF" }}>
                  Driver Status
                </InputLabel>
                <Select
                  value={driverStatus}
                  onChange={(e) => {
                    setDriverStatus(e.target.value);
                    socket.emit("driver_status_update", {
                      userId: user?.id,
                      status: e.target.value,
                    });
                  }}
                  label="Driver Status"
                  sx={{
                    fontFamily: "'Poppins', sans-serif'",
                    color: "#FFFFFF",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#FFFFFF" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#E0E0E0" },
                    fontSize: isMobile ? "0.8rem" : "0.875rem",
                  }}
                >
                  <MenuItem value="Available" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                    Available
                  </MenuItem>
                  <MenuItem value="En Route" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                    En Route
                  </MenuItem>
                  <MenuItem value="Busy" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                    Busy
                  </MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Toggle Dark Mode">
                <IconButton
                  onClick={() => setDarkMode(!darkMode)}
                  sx={{ color: "#FFFFFF", "&:hover": { color: "#E0E0E0" } }}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        {/* Status Message */}
        {message && (
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                p: isMobile ? 1 : 2,
                bgcolor:
                  message.includes("success") || message.includes("completed")
                    ? "#E8F5E9"
                    : "#FFEBEE",
                color:
                  message.includes("success") || message.includes("completed")
                    ? "#00695C"
                    : "#D32F2F",
                textAlign: "center",
                borderRadius: 2,
                fontFamily: "'Poppins', sans-serif",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                fontSize: isMobile ? "0.8rem" : "0.875rem",
              }}
            >
              {message}
            </Typography>
          </Box>
        )}

        {/* Map Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 1 : 0,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#00695C",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Live Tracking
            </Typography>
            <Button
              onClick={() => setMapExpanded(!mapExpanded)}
              sx={{
                color: "#D32F2F",
                "&:hover": { color: "#C62828" },
                fontFamily: "'Poppins', sans-serif",
                textTransform: "none",
                fontSize: isMobile ? "0.8rem" : "0.875rem",
              }}
              aria-label={mapExpanded ? "Collapse map" : "Expand map"}
            >
              {mapExpanded ? "Collapse" : "Expand"}
            </Button>
          </Box>
          {mapExpanded && (
            <Card
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ height: isMobile ? "200px" : isTablet ? "300px" : "400px" }}>
                {latitude && longitude ? (
                  <MapContainer
                    center={[latitude, longitude]}
                    zoom={isMobile ? 13 : 15} // Smaller zoom on mobile for better overview
                    style={{ height: "100%", width: "100%" }}
                    aria-label="Map showing ambulance and emergency locations"
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <ZoomControl position="topright" />
                    <ScaleControl position="bottomleft" />
                    <Marker position={[latitude, longitude]} icon={ambulanceIcon}>
                      <Popup sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                        Your Ambulance
                      </Popup>
                    </Marker>
                    {filteredEmergencies.map((emergency) =>
                      emergency.coordinates ? (
                        <Marker
                          key={emergency._id}
                          position={[
                            emergency.coordinates.latitude,
                            emergency.coordinates.longitude,
                          ]}
                          icon={emergencyIcon}
                        >
                          <Popup sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                            {emergency.emergency_type} ({emergency.priority || "Low"})
                            <br />
                            { emergency.location.length > 30 && isMobile
                              ? `${emergency.location.substring(0, 30)}...`
                              : emergency.location}
                          </Popup>
                        </Marker>
                      ) : null
                    )}
                  </MapContainer>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      color="textSecondary"
                      sx={{ fontFamily: "'Poppins', sans-serif'", fontSize: isMobile ? "0.8rem" : "0.875rem" }}
                    >
                      Waiting for location...
                    </Typography>
                  </Box>
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "#757575",
                  textAlign: "center",
                  fontFamily: "'Poppins', sans-serif'",
                  fontSize: isMobile ? "0.8rem" : "0.875rem",
                }}
              >
                Tracking: {latitude && longitude ? "Active" : "Inactive"}
              </Typography>
            </Card>
          )}
        </Box>

        {/* Emergencies Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 1 : 0,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#00695C",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Assigned Emergencies
            </Typography>
            <Tooltip title="Refresh Emergencies">
              <IconButton
                onClick={fetchAssignedEmergencies}
                disabled={loading}
                sx={{ color: "#D32F2F", "&:hover": { color: "#C62828" } }}
                aria-label="Refresh assigned emergencies"
              >
                {loading ? (
                  <CircularProgress size={isMobile ? 20 : 24} sx={{ color: "#D32F2F" }} />
                ) : (
                  <RefreshIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          {emergenciesExpanded && (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: isMobile ? 1 : 2,
                  mb: 3,
                  flexDirection: isMobile ? "column" : "row", // Stack on mobile
                }}
              >
                <TextField
                  label="Search Emergencies"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{ style: { fontFamily: "'Poppins', sans-serif'", fontSize: isMobile ? "0.8rem" : "0.875rem" } }}
                  InputLabelProps={{ style: { fontFamily: "'Poppins', sans-serif'", fontSize: isMobile ? "0.8rem" : "0.875rem" } }}
                  sx={{ flex: 1, minWidth: 200 }}
                  aria-label="Search emergencies by type or location"
                />
                <FormControl sx={{ minWidth: isMobile ? "100%" : 120 }}>
                  <InputLabel sx={{ fontFamily: "'Poppins', sans-serif'", fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                    Priority
                  </InputLabel>
                  <Select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    label="Priority"
                    sx={{ fontFamily: "'Poppins', sans-serif'", fontSize: isMobile ? "0.8rem" : "0.875rem" }}
                    aria-label="Filter emergencies by priority"
                  >
                    <MenuItem value="All" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                      All
                    </MenuItem>
                    <MenuItem value="High" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                      High
                    </MenuItem>
                    <MenuItem value="Medium" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                      Medium
                    </MenuItem>
                    <MenuItem value="Low" sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                      Low
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={isMobile ? 40 : 60} sx={{ color: "#D32F2F" }} />
                </Box>
              ) : filteredEmergencies.length === 0 ? (
                <Typography
                  variant="h6"
                  align="center"
                  color="#757575"
                  sx={{ py: 4, fontFamily: "'Poppins', sans-serif'", fontSize: isMobile ? "1rem" : "1.25rem" }}
                >
                  No assigned emergencies
                </Typography>
              ) : isMobile ? (
                filteredEmergencies.map((emergency) => (
                  <Accordion key={emergency._id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif'", fontSize: isMobile ? "0.9rem" : "1rem" }}>
                        {emergency.emergency_type.toUpperCase()} ({emergency.priority || "Low"})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <EmergencyCard emergency={emergency} />
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Grid container spacing={isTablet ? 2 : 3}>
                  {filteredEmergencies.map((emergency) => (
                    <Grid item xs={12} sm={6} md={4} key={emergency._id}>
                      <motion.div variants={cardVariants} initial="hidden" animate="visible">
                        <EmergencyCard emergency={emergency} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
          <Button
            onClick={() => setEmergenciesExpanded(!emergenciesExpanded)}
            sx={{
              color: "#D32F2F",
              "&:hover": { color: "#C62828" },
              fontFamily: "'Poppins', sans-serif'",
              mt: 2,
              textTransform: "none",
              fontSize: isMobile ? "0.8rem" : "0.875rem",
            }}
            aria-label={emergenciesExpanded ? "Collapse emergencies" : "Expand emergencies"}
          >
            {emergenciesExpanded ? "Collapse" : "Expand"}
          </Button>
        </Box>

        {/* Emergency Details Modal */}
        <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isMobile ? "90%" : isTablet ? 350 : 400,
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: isMobile ? 2 : 4,
              }}
              role="dialog"
              aria-labelledby="emergency-details-modal"
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  fontFamily: "'Poppins', sans-serif'",
                  mb: 2,
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
                id="emergency-details-modal"
              >
                {selectedEmergency?.emergency_type.toUpperCase()}
              </Typography>
              <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                <LocationOnIcon sx={{ mr: 0.5, color: "#D32F2F", fontSize: isMobile ? 18 : 20 }} />
                <Typography sx={{ fontFamily: "'Poppins', sans-serif'", fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                  {selectedEmergency?.location}
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1, fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                <strong>Priority:</strong> {selectedEmergency?.priority || "Low"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1, fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                <strong>Victim's Name:</strong>{" "}
                {selectedEmergency?.victim_name || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1, fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                <strong>Age:</strong> {selectedEmergency?.victim_age || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1, fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                <strong>Sex:</strong> {selectedEmergency?.victim_sex || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1, fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                <strong>Police Case No:</strong>{" "}
                {selectedEmergency?.police_case_no || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1, fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                <strong>Description:</strong>{" "}
                {selectedEmergency?.incident_description || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1, fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                <strong>Notes:</strong> {selectedEmergency?.notes || "N/A"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#D32F2F",
                  "&:hover": { bgcolor: "#C62828" },
                  fontFamily: "'Poppins', sans-serif'",
                  textTransform: "none",
                  fontSize: isMobile ? "0.8rem" : "0.875rem",
                }}
                onClick={handleCloseModal}
                aria-label="Close emergency details modal"
              >
                Close
              </Button>
            </Box>
          </Fade>
        </Modal>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{
              width: isMobile ? "90%" : "100%", // Adjust width on mobile
              boxShadow: 3,
              bgcolor:
                notification.severity === "error"
                  ? "#FFEBEE"
                  : notification.severity === "warning"
                  ? "#FFF3E0"
                  : "#E8F5E9",
              color:
                notification.severity === "error"
                  ? "#D32F2F"
                  : notification.severity === "warning"
                  ? "#FF9800"
                  : "#00695C",
              fontFamily: "'Poppins', sans-serif",
              fontSize: isMobile ? "0.8rem" : "0.875rem",
            }}
            aria-live="assertive"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default DriverDashboard;