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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { baseURL } from "../utils/baseURL";

// Styled components
const DashboardCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s ease-in-out, boxShadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
  borderRadius: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  marginTop: theme.spacing(1),
  backgroundColor:
    status === "verified" ? "#FF9800" :
    status === "dispatched" ? "#0288D1" :
    status === "completed" ? "#4CAF50" :
    theme.palette.grey[500],
  color: "white",
}));

const HospitalDashboard = () => {
  const { user } = useContext(AuthContext);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [availableAmbulances, setAvailableAmbulances] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [arrivalLoading, setArrivalLoading] = useState(false);

  useEffect(() => {
    console.log("🚀 Mounting Hospital Dashboard...");
    fetchEmergencies();
    fetchAvailableAmbulances();

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

    return () => {
      console.log("🔴 Unmounting Hospital Dashboard. Removing listeners...");
      socket.off("new_verified_emergency");
      socket.off("ambulance_dispatched");
      socket.off("patient_arrived");
      socket.off("emergency_completed");
    };
  }, []);

  const fetchEmergencies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Authentication error. Please log in.");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      const res = await fetch(`${baseURL}/emergency/verified`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("📥 Fetched Emergencies Response:", data);

      if (res.ok) {
        setEmergencyRequests(data);
        if (data.length === 0) {
          setMessage("⚠ No active emergencies.");
          setOpenSnackbar(true);
        }
      } else {
        setMessage(`⚠ Server Error: ${data.message}`);
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("❌ Server error:", err);
      setMessage("❌ Network error. Check backend logs.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAmbulances = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Authentication error. Please log in.");
        setOpenSnackbar(true);
        return;
      }

      const res = await fetch(`${baseURL}/ambulance/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("📥 Available Ambulances:", data);

      if (res.ok) {
        setAvailableAmbulances(data);
        if (data.length === 0) {
          setMessage("⚠ No available ambulance drivers.");
          setOpenSnackbar(true);
        }
      } else {
        setMessage(`⚠ Server Error: ${data.message}`);
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("❌ Error fetching ambulances:", err);
      setMessage("❌ Network error while fetching ambulances. Check backend logs.");
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

    setDispatchLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Authentication error. Please log in.");
        setOpenSnackbar(true);
        return;
      }

      const res = await fetch(`${baseURL}/emergency/dispatch/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ambulanceId }),
      });

      const data = await res.json();
      console.log("📥 Dispatch Ambulance Response:", data);

      if (res.ok) {
        setEmergencyRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, assigned_ambulance: ambulanceId, status: "dispatched" } : req
          )
        );
        setMessage("✅ Ambulance dispatched successfully!");
        setOpenSnackbar(true);
      } else {
        setMessage(`⚠ Server Error: ${data.message}`);
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("❌ Error dispatching ambulance:", err);
      setMessage("❌ Network error. Check backend logs.");
      setOpenSnackbar(true);
    } finally {
      setDispatchLoading(false);
    }
  };

  const markArrival = async (requestId) => {
    setArrivalLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Authentication error. Please log in.");
        setOpenSnackbar(true);
        return;
      }

      const res = await fetch(`${baseURL}/emergency/confirm-arrival/${requestId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("📥 Confirm Arrival Response:", data);

      if (res.ok) {
        setEmergencyRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, status: "completed" } : req
          )
        );
        setMessage("✅ Patient arrival confirmed!");
        setOpenSnackbar(true);
      } else {
        setMessage(`⚠ Server Error: ${data.message}`);
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("❌ Error confirming arrival:", err);
      setMessage("❌ Network error. Check backend logs.");
      setOpenSnackbar(true);
    } finally {
      setArrivalLoading(false);
    }
  };

  const handleDriverSelection = (requestId, driverId) => {
    setSelectedDriver((prev) => ({
      ...prev,
      [requestId]: driverId,
    }));
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 10,
        mb: 6,
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#FFFFFF",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <LocalHospitalIcon sx={{ fontSize: 40, mr: 2, color: "#D32F2F" }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#00695C"
              sx={{ fontFamily: "'Poppins', sans-serif'" }}
            >
              Hospital Command Center
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              color="#757575"
              sx={{ fontFamily: "'Poppins', sans-serif'" }}
            >
              Active Cases: {emergencyRequests.length} | Available Drivers: {availableAmbulances.length}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#00695C",
            fontFamily: "'Poppins', sans-serif'",
          }}
        >
          Active Emergency Cases
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={60} sx={{ color: "#D32F2F" }} />
          </Box>
        ) : emergencyRequests.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
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
                <DashboardCard>
                  <CardContent>
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

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          fontFamily: "'Poppins', sans-serif'",
                        }}
                      >
                        <LocationOnIcon sx={{ mr: 1, color: "#D32F2F" }} />
                        {req.location}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          fontFamily: "'Poppins', sans-serif'",
                        }}
                      >
                        <AccessTimeIcon sx={{ mr: 1, color: "#D32F2F" }} />
                        {new Date(req.createdAt).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          fontFamily: "'Poppins', sans-serif'",
                        }}
                      >
                        <PersonIcon sx={{ mr: 1, color: "#D32F2F" }} />
                        {req.victim_name || "Not provided"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontFamily: "'Poppins', sans-serif'" }}
                      >
                        <strong>Age:</strong> {req.victim_age || "Not provided"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontFamily: "'Poppins', sans-serif'" }}
                      >
                        <strong>Sex:</strong> {req.victim_sex || "Not provided"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontFamily: "'Poppins', sans-serif'" }}
                      >
                        <strong>Police Case No:</strong> {req.police_case_no || "Not provided"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontFamily: "'Poppins', sans-serif'" }}
                      >
                        <strong>Description:</strong> {req.incident_description || "Not provided"}
                      </Typography>
                      <StatusChip label={req.status} status={req.status} size="small" />
                    </Box>

                    <FormControl fullWidth sx={{ mb: 1 }}>
                      <InputLabel sx={{ fontFamily: "'Poppins', sans-serif'" }}>Assign Driver</InputLabel>
                      <Select
                        value={selectedDriver[req._id] || ""}
                        onChange={(e) => handleDriverSelection(req._id, e.target.value)}
                        disabled={req.status !== "verified" || dispatchLoading}
                        label="Assign Driver"
                        sx={{ fontFamily: "'Poppins', sans-serif'" }}
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
                              {ambulance.driver_id.username || ambulance.driver_id._id.slice(-6)}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      fullWidth
                      disabled={req.status !== "verified" || dispatchLoading}
                      startIcon={dispatchLoading ? <CircularProgress size={20} sx={{ color: "#FFFFFF" }} /> : <DirectionsCarIcon />}
                      onClick={() => assignAmbulance(req._id)}
                      sx={{
                        backgroundColor: "#D32F2F",
                        "&:hover": { backgroundColor: "#C62828" },
                        "&:disabled": { backgroundColor: "#B0BEC5" },
                        fontFamily: "'Poppins', sans-serif'",
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {dispatchLoading ? "Dispatching..." : "Dispatch Ambulance"}
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={req.status !== "dispatched" || arrivalLoading}
                      startIcon={arrivalLoading ? <CircularProgress size={20} sx={{ color: "#FFFFFF" }} /> : <CheckCircleIcon />}
                      onClick={() => markArrival(req._id)}
                      sx={{
                        backgroundColor: "#D32F2F",
                        "&:hover": { backgroundColor: "#C62828" },
                        "&:disabled": { backgroundColor: "#B0BEC5" },
                        fontFamily: "'Poppins', sans-serif'",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {arrivalLoading ? "Confirming..." : "Confirm Arrival"}
                    </Button>
                  </CardContent>
                </DashboardCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
            fontFamily: "'Poppins', sans-serif'",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HospitalDashboard;