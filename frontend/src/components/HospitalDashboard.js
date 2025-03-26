import React, { useEffect, useState, useContext } from "react";
import socket from "../socketClient";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Chip,
  Divider,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import RefreshIcon from "@mui/icons-material/Refresh";
import { baseURL } from "../utils/baseURL";

// Styled components
const DashboardCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  borderRadius: theme.spacing(2),
  backgroundColor: "#FFFFFF",
  border: "1px solid #E0E0E0",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  marginTop: theme.spacing(1),
  backgroundColor:
    status === "verified" ? "#FF9800" :
    status === "dispatched" ? "#0288D1" :
    status === "completed" ? "#4CAF50" :
    theme.palette.grey[500],
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#00695C",
  color: "#FFFFFF",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: "#424242",
  fontFamily: "'Poppins', sans-serif",
}));

const HospitalDashboard = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [availableAmbulances, setAvailableAmbulances] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [dispatchLoading, setDispatchLoading] = useState({});
  const [arrivalLoading, setArrivalLoading] = useState({});

  useEffect(() => {
    console.log("🚀 Mounting Hospital Dashboard...");
    fetchEmergencies();
    fetchAvailableAmbulances();

    // Socket.IO listeners
    socket.on("new_verified_emergency", (newEmergency) => {
      console.log("🚨 New Verified Emergency Received:", newEmergency);
      setEmergencyRequests((prev) => [...prev, newEmergency]);
      setMessage("🚨 New verified emergency received!");
      setOpenSnackbar(true);
    });

    socket.on("ambulance_dispatched", ({ requestId, ambulanceId }) => {
      console.log("🚑 Ambulance Dispatched for Request:", requestId);
      setEmergencyRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, assigned_ambulance: ambulanceId, status: "dispatched" } : req
        )
      );
      setMessage("🚑 Ambulance dispatched successfully!");
      setOpenSnackbar(true);
    });

    socket.on("patient_arrived", (emergency) => {
      console.log("🏥 Patient Arrived:", emergency);
      setEmergencyRequests((prev) =>
        prev.map((req) =>
          req._id === emergency._id ? { ...req, status: "completed" } : req
        )
      );
      setMessage("✅ Patient arrival confirmed!");
      setOpenSnackbar(true);
    });

    socket.on("emergency_completed", (requestId) => {
      console.log("✅ Emergency Completed:", requestId);
      setEmergencyRequests((prev) => prev.filter((req) => req._id !== requestId));
      setMessage("✅ Emergency case completed and removed.");
      setOpenSnackbar(true);
    });

    socket.on("driver_status_updated", ({ userId, status }) => {
      console.log(`🚑 Driver ${userId} updated status to: ${status}`);
      setAvailableAmbulances((prev) =>
        prev.map((ambulance) =>
          ambulance.driver_id._id === userId
            ? { ...ambulance, status: status || "Available" }
            : ambulance
        )
      );
      setMessage(`🚑 Driver ${userId.slice(-6)} updated status to ${status}`);
      setOpenSnackbar(true);
    });

    return () => {
      console.log("🔴 Unmounting Hospital Dashboard. Removing listeners...");
      socket.off("new_verified_emergency");
      socket.off("ambulance_dispatched");
      socket.off("patient_arrived");
      socket.off("emergency_completed");
      socket.off("driver_status_updated");
    };
  }, []);

  const fetchEmergencies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Authentication error. Please log in.");

      const res = await fetch(`${baseURL}/emergency/verified`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch emergencies");
      }

      const data = await res.json();
      console.log("📥 Fetched Emergencies Response:", data);

      setEmergencyRequests(data);
      if (data.length === 0) {
        setMessage("⚠ No active emergencies.");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("❌ Error fetching emergencies:", err);
      setMessage(`❌ ${err.message || "Network error. Check backend logs."}`);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAmbulances = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Authentication error. Please log in.");

      const res = await fetch(`${baseURL}/ambulance/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch ambulances");
      }

      const data = await res.json();
      console.log("📥 Available Ambulances:", data);

      const ambulancesWithStatus = data.map((ambulance) => ({
        ...ambulance,
        status: ambulance.status || "Available",
      }));
      setAvailableAmbulances(ambulancesWithStatus);
      if (data.length === 0) {
        setMessage("⚠ No available ambulance drivers.");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("❌ Error fetching ambulances:", err);
      setMessage(`❌ ${err.message || "Network error while fetching ambulances."}`);
      setOpenSnackbar(true);
    }
  };

  const assignAmbulance = async (requestId) => {
    const ambulanceId = selectedDriver[requestId];
    if (!ambulanceId) {
      setMessage("⚠ Please select a driver to dispatch the emergency.");
      setOpenSnackbar(true);
      return;
    }

    setDispatchLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Authentication error. Please log in.");

      const res = await fetch(`${baseURL}/emergency/dispatch/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ambulanceId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to dispatch ambulance");
      }

      const data = await res.json();
      console.log("📥 Dispatch Ambulance Response:", data);

      setEmergencyRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, assigned_ambulance: ambulanceId, status: "dispatched" } : req
        )
      );
      setMessage("✅ Ambulance dispatched successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("❌ Error dispatching ambulance:", err);
      setMessage(`❌ ${err.message || "Network error. Check backend logs."}`);
      setOpenSnackbar(true);
    } finally {
      setDispatchLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const markArrival = async (requestId) => {
    setArrivalLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Authentication error. Please log in.");

      const res = await fetch(`${baseURL}/emergency/confirm-arrival/${requestId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to confirm arrival");
      }

      const data = await res.json();
      console.log("📥 Confirm Arrival Response:", data);

      setEmergencyRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "completed" } : req
        )
      );
      setMessage("✅ Patient arrival confirmed!");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("❌ Error confirming arrival:", err);
      setMessage(`❌ ${err.message || "Network error. Check backend logs."}`);
      setOpenSnackbar(true);
    } finally {
      setArrivalLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDriverSelection = (requestId, driverId) => {
    setSelectedDriver((prev) => ({
      ...prev,
      [requestId]: driverId,
    }));
  };

  const handleRefresh = () => {
    fetchEmergencies();
    fetchAvailableAmbulances();
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 10,
        mb: 6,
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
        <HeaderPaper elevation={3}>
          <Box display="flex" alignItems="center">
            <LocalHospitalIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ fontFamily: "'Poppins', sans-serif'" }}
            >
              Hospital Command Center
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontFamily: "'Poppins', sans-serif'" }}
            >
              Active Cases: {emergencyRequests.length} | Available Drivers: {availableAmbulances.length}
            </Typography>
            <Tooltip title="Refresh Data">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{ color: "#FFFFFF" }}
                aria-label="Refresh emergencies and ambulances"
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#FFFFFF" }} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </HeaderPaper>
      </motion.div>

      {/* Active Emergency Cases */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#00695C",
              fontFamily: "'Poppins', sans-serif'",
            }}
          >
            Active Emergency Cases
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={60} sx={{ color: "#D32F2F" }} />
          </Box>
        ) : emergencyRequests.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography
              variant="h6"
              color="#757575"
              sx={{ fontFamily: "'Poppins', sans-serif'" }}
            >
              ✓ No active emergencies at this time
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {emergencyRequests.map((req) => (
              <Grid item xs={12} sm={6} md={4} key={req._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <DashboardCard>
                    <CardContent>
                      {/* Header */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography
                          variant="h6"
                          color="#D32F2F"
                          fontWeight="bold"
                          sx={{ fontFamily: "'Poppins', sans-serif'" }}
                        >
                          {req.emergency_type.toUpperCase()}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="#757575"
                          sx={{ fontFamily: "'Poppins', sans-serif'" }}
                        >
                          #{req._id.slice(-6)}
                        </Typography>
                      </Box>

                      {/* Details */}
                      <Box sx={{ mb: 2 }}>
                        <InfoBox>
                          <LocationOnIcon sx={{ color: "#D32F2F" }} />
                          <Typography variant="body2">{req.location}</Typography>
                        </InfoBox>
                        <InfoBox>
                          <AccessTimeIcon sx={{ color: "#D32F2F" }} />
                          <Typography variant="body2">{new Date(req.createdAt).toLocaleString()}</Typography>
                        </InfoBox>
                        <InfoBox>
                          <PersonIcon sx={{ color: "#D32F2F" }} />
                          <Typography variant="body2">{req.victim_name || "Not provided"}</Typography>
                        </InfoBox>
                        <InfoBox>
                          <Typography variant="body2">
                            <strong>Age:</strong> {req.victim_age || "Not provided"}
                          </Typography>
                        </InfoBox>
                        <InfoBox>
                          <Typography variant="body2">
                            <strong>Sex:</strong> {req.victim_sex || "Not provided"}
                          </Typography>
                        </InfoBox>
                        <InfoBox>
                          <Typography variant="body2">
                            <strong>Police Case No:</strong> {req.police_case_no || "Not provided"}
                          </Typography>
                        </InfoBox>
                        <InfoBox>
                          <Typography variant="body2">
                            <strong>Description:</strong> {req.incident_description || "Not provided"}
                          </Typography>
                        </InfoBox>
                        <StatusChip label={req.status} status={req.status} size="small" />
                      </Box>

                      {/* Driver Selection */}
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontFamily: "'Poppins', sans-serif'" }}>Assign Driver</InputLabel>
                        <Select
                          value={selectedDriver[req._id] || ""}
                          onChange={(e) => handleDriverSelection(req._id, e.target.value)}
                          disabled={req.status !== "verified" || dispatchLoading[req._id]}
                          label="Assign Driver"
                          sx={{ fontFamily: "'Poppins', sans-serif'" }}
                          aria-label={`Assign driver for ${req.emergency_type} emergency`}
                        >
                          <MenuItem value="" disabled sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                            Select a Driver
                          </MenuItem>
                          {availableAmbulances.length === 0 ? (
                            <MenuItem disabled sx={{ fontFamily: "'Poppins', sans-serif'" }}>
                              No drivers available
                            </MenuItem>
                          ) : (
                            availableAmbulances.map((ambulance) => (
                              <MenuItem
                                key={ambulance.driver_id._id}
                                value={ambulance.driver_id._id}
                                sx={{ fontFamily: "'Poppins', sans-serif'" }}
                              >
                                {ambulance.driver_id.username || ambulance.driver_id._id.slice(-6)} (
                                {ambulance.status || "Available"})
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>

                      {/* Actions */}
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={req.status !== "verified" || dispatchLoading[req._id]}
                        startIcon={
                          dispatchLoading[req._id] ? (
                            <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
                          ) : (
                            <DirectionsCarIcon />
                          )
                        }
                        onClick={() => assignAmbulance(req._id)}
                        sx={{
                          backgroundColor: "#D32F2F",
                          "&:hover": { backgroundColor: "#C62828" },
                          "&:disabled": { backgroundColor: "#B0BEC5" },
                          fontFamily: "'Poppins', sans-serif",
                          textTransform: "none",
                          mb: 1,
                        }}
                        aria-label={`Dispatch ambulance for ${req.emergency_type} emergency`}
                      >
                        {dispatchLoading[req._id] ? "Dispatching..." : "Dispatch Ambulance"}
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={req.status !== "dispatched" || arrivalLoading[req._id]}
                        startIcon={
                          arrivalLoading[req._id] ? (
                            <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
                          ) : (
                            <CheckCircleIcon />
                          )
                        }
                        onClick={() => markArrival(req._id)}
                        sx={{
                          backgroundColor: "#D32F2F",
                          "&:hover": { backgroundColor: "#C62828" },
                          "&:disabled": { backgroundColor: "#B0BEC5" },
                          fontFamily: "'Poppins', sans-serif",
                          textTransform: "none",
                        }}
                        aria-label={`Confirm arrival for ${req.emergency_type} emergency`}
                      >
                        {arrivalLoading[req._id] ? "Confirming..." : "Confirm Arrival"}
                      </Button>
                    </CardContent>
                  </DashboardCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={
            message.includes("error") ? "error" :
            message.includes("No active") || message.includes("No available") ? "warning" :
            "success"
          }
          variant="filled"
          sx={{
            width: "100%",
            bgcolor:
              message.includes("error") ? "#D32F2F" :
              message.includes("No active") || message.includes("No available") ? "#FF9800" :
              "#00695C",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: 3,
          }}
          aria-live="assertive"
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HospitalDashboard;