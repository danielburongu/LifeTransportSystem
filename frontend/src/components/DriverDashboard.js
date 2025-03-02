import React, { useEffect, useState, useContext } from "react";
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
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigationIcon from "@mui/icons-material/Navigation";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { baseURL } from "../utils/baseURL";

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
  visible: { opacity: 1, y: 0 },
};

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [assignedEmergencies, setAssignedEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [darkMode, setDarkMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [filterPriority, setFilterPriority] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapExpanded, setMapExpanded] = useState(true);
  const [emergenciesExpanded, setEmergenciesExpanded] = useState(true);
  const [driverStatus, setDriverStatus] = useState("Available");
  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = createTheme({
    palette: { mode: darkMode ? "dark" : "light" },
  });

  // Real-time Location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          socket.emit("ambulance_location_update", { userId: user?.id, latitude, longitude });
        },
        (error) => setMessage("❌ Failed to get location: " + error.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setMessage("❌ Geolocation is not supported.");
    }
  }, [user]);

  // Socket and Emergency Fetch
  useEffect(() => {
    fetchAssignedEmergencies();

    socket.on("ambulance_assigned", (updatedEmergency) => {
      console.log("Received new assigned emergency:", updatedEmergency);
      setAssignedEmergencies((prev) => [...prev, updatedEmergency]);
      setNotification({ open: true, message: "🚨 New emergency assigned!", severity: "warning" });
      playAlertSound();
    });

    socket.on("patient_arrived", (emergency) => {
      console.log("Emergency marked as completed:", emergency);
      setAssignedEmergencies((prev) => prev.filter((e) => e._id !== emergency._id));
      setNotification({ open: true, message: "✅ An emergency has been completed!", severity: "success" });
    });

    socket.on(`patient_update_${user?.id}`, (updatedEmergency) => {
      console.log("Received patient update:", updatedEmergency);
      setAssignedEmergencies((prev) =>
        prev.map((e) => (e._id === updatedEmergency._id ? updatedEmergency : e))
      );
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

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Invalid response: " + text);
      }

      const data = await response.json();
      console.log("Fetched assigned emergencies:", data);
      setAssignedEmergencies(data);
      setMessage(data.length === 0 ? "No assigned emergencies." : "");
    } catch (error) {
      console.error("Error fetching assigned emergencies:", error);
      setMessage(error.message || "❌ Unable to fetch emergencies.");
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (emergencyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Please log in.");

      setLoading(true); // Show loading state during request
      const response = await fetch(`${baseURL}/emergency/mark-completed/${emergencyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) throw new Error("Invalid response");

      const data = await response.json();
      console.log("Marked emergency as completed:", data);
      setAssignedEmergencies((prev) => prev.filter((e) => e._id !== emergencyId));
      setMessage("✅ Emergency completed!");
      socket.emit("patient_arrived", data.emergency);
      socket.emit(`patient_update_${data.emergency.user_id}`, data.emergency);
      setNotification({ open: true, message: "✅ Emergency marked as completed!", severity: "success" });
    } catch (error) {
      console.error("Error marking emergency as completed:", error);
      setMessage(error.message || "❌ Failed to mark as completed.");
      setNotification({ open: true, message: error.message || "❌ Failed to mark as completed!", severity: "error" });
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

  const handleCloseModal = () => setOpenModal(false);

  const sortedEmergencies = [...assignedEmergencies].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority || "Low"] - priorityOrder[b.priority || "Low"];
  });

  const filteredEmergencies = sortedEmergencies.filter((emergency) => {
    const matchesPriority = filterPriority === "All" || emergency.priority === filterPriority;
    const matchesSearch =
      emergency.emergency_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

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

    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          bgcolor: emergency.priority === "High" ? "#ffebee" : emergency.priority === "Medium" ? "#fff3e0" : "#e3f2fd",
          borderLeft: `4px solid ${
            emergency.priority === "High" ? "#D32F2F" : emergency.priority === "Medium" ? "#FF9800" : "#00695C"
          }`,
          p: 2,
        }}
      >
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <ReportProblemIcon sx={{ fontSize: 40, color: "#D32F2F" }} />
          </Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}
          >
            {emergency.emergency_type.toUpperCase()} ({emergency.priority || "Low"})
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}
          >
            <LocationOnIcon sx={{ verticalAlign: "middle", mr: 0.5, color: "#D32F2F" }} /> {emergency.location}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}
          >
            <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 0.5, color: "#D32F2F" }} />
            {new Date(emergency.createdAt).toLocaleString()}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}
          >
            <PersonIcon sx={{ verticalAlign: "middle", mr: 0.5, color: "#D32F2F" }} />
            {emergency.victim_name || "Not provided"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}
          >
            Age: {emergency.victim_age || "Not provided"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}
          >
            Sex: {emergency.victim_sex || "Not provided"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}
          >
            Police Case No: {emergency.police_case_no || "Not provided"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Poppins', sans-serif'", mb: 2 }}
          >
            Description: {emergency.incident_description || "Not provided"}
          </Typography>
          <Chip
            label={emergency.status}
            color={emergency.status === "dispatched" ? "warning" : "success"}
            size="small"
            sx={{ mb: 2, fontFamily: "'Poppins', sans-serif'" }}
          />
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 1,
              bgcolor: progress > 75 ? "#D32F2F" : progress > 50 ? "#FF9800" : "#00695C",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => markCompleted(emergency._id)}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: "#FFFFFF" }} /> : <CheckCircleIcon />}
            disabled={loading}
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
            }}
            onClick={() => handleOpenModal(emergency)}
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
            }}
            onClick={() => {
              if (emergency.coordinates) {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${emergency.coordinates.latitude},${emergency.coordinates.longitude}`;
                window.open(url, "_blank");
              } else {
                setMessage("❌ No coordinates available for navigation.");
              }
            }}
            startIcon={<NavigationIcon />}
          >
            Navigate
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
          py: 6,
          mt: 10,
          bgcolor: "#f5f5f5",
        }}
      >
        {/* Dark Mode Toggle */}
        <Button
          onClick={() => setDarkMode(!darkMode)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#D32F2F",
            "&:hover": { color: "#C62828" },
          }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#00695C",
              mb: 4,
              fontFamily: "'Poppins', sans-serif'",
            }}
          >
            Driver Dashboard
          </Typography>
        </motion.div>

        {/* Driver Status */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "center" }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "'Poppins', sans-serif'" }}
          >
            Status:
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ fontFamily: "'Poppins', sans-serif'" }}>Status</InputLabel>
            <Select
              value={driverStatus}
              onChange={(e) => {
                setDriverStatus(e.target.value);
                socket.emit("driver_status_update", { userId: user?.id, status: e.target.value });
              }}
              sx={{ fontFamily: "'Poppins', sans-serif'" }}
            >
              <MenuItem value="Available" sx={{ fontFamily: "'Poppins', sans-serif'" }}>Available</MenuItem>
              <MenuItem value="En Route" sx={{ fontFamily: "'Poppins', sans-serif'" }}>En Route</MenuItem>
              <MenuItem value="Busy" sx={{ fontFamily: "'Poppins', sans-serif'" }}>Busy</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Status Message */}
        {message && (
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 4,
              bgcolor: message.includes("success") || message.includes("completed") ? "#E8F5E9" : "#FFEBEE",
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                color: message.includes("success") || message.includes("completed") ? "#00695C" : "#D32F2F",
                textAlign: "center",
                fontFamily: "'Poppins', sans-serif'",
              }}
            >
              {message}
            </Typography>
          </Paper>
        )}

        {/* Map Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              color="#00695C"
              sx={{ fontFamily: "'Poppins', sans-serif'" }}
            >
              Live Tracking
            </Typography>
            <Button
              onClick={() => setMapExpanded(!mapExpanded)}
              sx={{
                color: "#D32F2F",
                "&:hover": { color: "#C62828" },
                fontFamily: "'Poppins', sans-serif'",
              }}
            >
              {mapExpanded ? "Collapse" : "Expand"}
            </Button>
          </Box>
          {mapExpanded && (
            <Box
              sx={{
                height: isMobile ? "200px" : "400px",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {latitude && longitude ? (
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[latitude, longitude]} icon={ambulanceIcon}>
                    <Popup sx={{ fontFamily: "'Poppins', sans-serif'" }}>Your Ambulance</Popup>
                  </Marker>
                  {filteredEmergencies.map((emergency) =>
                    emergency.coordinates ? (
                      <Marker
                        key={emergency._id}
                        position={[emergency.coordinates.latitude, emergency.coordinates.longitude]}
                        icon={emergencyIcon}
                      >
                        <Popup sx={{ fontFamily: "'Poppins', sans-serif'" }}>{emergency.emergency_type}</Popup>
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
                    sx={{ fontFamily: "'Poppins', sans-serif'" }}
                  >
                    Waiting for location...
                  </Typography>
                </Box>
              )}
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "#757575",
                  fontFamily: "'Poppins', sans-serif'",
                }}
              >
                Tracking: {latitude && longitude ? "Active" : "Inactive"}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Emergencies Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              color="#00695C"
              sx={{ fontFamily: "'Poppins', sans-serif'" }}
            >
              Assigned Emergencies
            </Typography>
            <Button
              onClick={() => setEmergenciesExpanded(!emergenciesExpanded)}
              sx={{
                color: "#D32F2F",
                "&:hover": { color: "#C62828" },
                fontFamily: "'Poppins', sans-serif'",
              }}
            >
              {emergenciesExpanded ? "Collapse" : "Expand"}
            </Button>
          </Box>
          {emergenciesExpanded && (
            <>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  label="Search Emergencies"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    style: { fontFamily: "'Poppins', sans-serif'" },
                  }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ fontFamily: "'Poppins', sans-serif'" }}>Priority</InputLabel>
                  <Select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    label="Priority"
                    sx={{ fontFamily: "'Poppins', sans-serif'" }}
                  >
                    <MenuItem value="All" sx={{ fontFamily: "'Poppins', sans-serif'" }}>All</MenuItem>
                    <MenuItem value="High" sx={{ fontFamily: "'Poppins', sans-serif'" }}>High</MenuItem>
                    <MenuItem value="Medium" sx={{ fontFamily: "'Poppins', sans-serif'" }}>Medium</MenuItem>
                    <MenuItem value="Low" sx={{ fontFamily: "'Poppins', sans-serif'" }}>Low</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredEmergencies.length === 0 ? (
                <Typography
                  color="textSecondary"
                  sx={{ textAlign: "center", py: 2, fontFamily: "'Poppins', sans-serif'" }}
                >
                  No assigned emergencies.
                </Typography>
              ) : isMobile ? (
                filteredEmergencies.map((emergency) => (
                  <Accordion key={emergency._id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                        {emergency.emergency_type.toUpperCase()} ({emergency.priority || "Low"})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <EmergencyCard emergency={emergency} />
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Grid container spacing={4}>
                  {filteredEmergencies.map((emergency) => (
                    <Grid item xs={12} md={6} key={emergency._id}>
                      <motion.div variants={cardVariants} initial="hidden" animate="visible">
                        <EmergencyCard emergency={emergency} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Paper>

        {/* Emergency Details Modal */}
        <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isMobile ? "90%" : 400,
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontFamily: "'Poppins', sans-serif'", mb: 2 }}
              >
                {selectedEmergency?.emergency_type.toUpperCase()}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
                <strong>Location:</strong> {selectedEmergency?.location}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
                <strong>Priority:</strong> {selectedEmergency?.priority || "Low"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
                <strong>Victim's Name:</strong> {selectedEmergency?.victim_name || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
                <strong>Age:</strong> {selectedEmergency?.victim_age || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
                <strong>Sex:</strong> {selectedEmergency?.victim_sex || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
                <strong>Police Case No:</strong> {selectedEmergency?.police_case_no || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
                <strong>Description:</strong> {selectedEmergency?.incident_description || "Not provided"}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif'", mb: 1 }}>
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
                }}
                onClick={handleCloseModal}
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
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={notification.severity}
            sx={{ width: "100%", fontFamily: "'Poppins', sans-serif'" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default DriverDashboard;