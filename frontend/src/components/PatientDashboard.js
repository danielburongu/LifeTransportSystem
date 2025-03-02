import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Container,
  Box,
  Grid,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import socket from "../socketClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import OpenLocationCode from "open-location-code";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { baseURL } from "../utils/baseURL"; // Import baseURL

// Custom Map Marker
const customMarker = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Status color mapping
const statusColors = {
  pending: "warning",
  verified: "info",
  dispatched: "primary",
  completed: "success",
};

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [location, setLocation] = useState(user?.location || "");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [plusCode, setPlusCode] = useState("Not Available");
  const [emergencyType, setEmergencyType] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  // Form state variables
  const [victimName, setVictimName] = useState("");
  const [victimAge, setVictimAge] = useState("");
  const [victimSex, setVictimSex] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [policeCaseNo, setPoliceCaseNo] = useState("");

  const emergencyTypes = ["accident", "medical", "fire", "other"];

  const fetchEmergencyRequests = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Authentication required. Please log in.");

      const response = await fetch(`${baseURL}/emergency/my-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error((await response.json()).message || "Failed to load requests");
      const data = await response.json();
      console.log("API Response (fetchEmergencyRequests):", data);

      setEmergencyRequests(data);
      if (data.length === 0) setMessage("No emergency requests found.");
    } catch (error) {
      console.error("Fetch Emergency Requests Error:", error);
      setMessage(`❌ ${error.message || "Failed to load requests"}`);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies since token is from localStorage and baseURL is static

  const fetchCoordinates = useCallback(async (place) => {
    if (!place || place.length < 3) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        setCoordinates({ lat: latitude, lng: longitude });
        setLocation(display_name);
        setPlusCode(OpenLocationCode.encode(latitude, longitude));
      } else {
        setMessage("⚠ Location not found");
      }
    } catch (error) {
      console.error("❌ Geolocation error:", error);
      setMessage("❌ Error fetching location");
    }
  }, []);

  useEffect(() => {
    if (user) fetchEmergencyRequests();

    socket.on(`patient_update_${user?.userId}`, (updatedRequest) => {
      console.log("Received patient update:", updatedRequest);
      setEmergencyRequests((prev) =>
        prev.map((req) =>
          req._id === updatedRequest._id ? updatedRequest : req
        )
      );
      setMessage("✅ Emergency request updated!");
      setSuccessOpen(true);
    });

    return () => socket.off(`patient_update_${user?.userId}`);
  }, [user, fetchEmergencyRequests]); // fetchEmergencyRequests moved above and added to deps

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          fetchCoordinates(`${latitude},${longitude}`);
        },
        (error) => {
          setMessage("❌ Unable to get current location");
        }
      );
    }
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    if (newLocation.length > 3) fetchCoordinates(newLocation);
  };

  const requestEmergency = async () => {
    if (!location || !emergencyType || !coordinates.lat || !coordinates.lng || !victimName || !incidentDescription) {
      setMessage("❌ Please fill all required fields");
      return;
    }

    setRequestLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Authentication required. Please log in.");

      const response = await fetch(`${baseURL}/emergency/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          emergency_type: emergencyType,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          plus_code: plusCode,
          victim_name: victimName,
          victim_age: victimAge,
          victim_sex: victimSex,
          incident_description: incidentDescription,
          police_case_no: policeCaseNo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }
      const responseData = await response.json();
      console.log("New Request Response:", responseData);

      setSuccessOpen(true);
      setTimeout(() => {
        fetchEmergencyRequests();
      }, 500);

      // Reset form fields
      setLocation("");
      setCoordinates({ lat: null, lng: null });
      setEmergencyType("");
      setVictimName("");
      setVictimAge("");
      setVictimSex("");
      setIncidentDescription("");
      setPoliceCaseNo("");
    } catch (error) {
      console.error("Request Emergency Error:", error);
      setMessage(`❌ ${error.message || "Request failed"}`);
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 6,
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        mt: 10,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#00695C",
            fontWeight: 700,
            mb: 4,
            textAlign: "center",
            letterSpacing: 1,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Citizen Emergency Dashboard
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        {/* Emergency Request Form */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: "#00695C",
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Request Emergency Transport
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Location"
                    variant="outlined"
                    value={location}
                    onChange={handleLocationChange}
                    sx={{ bgcolor: "white" }}
                    required
                    InputProps={{
                      style: { fontFamily: "'Poppins', sans-serif" },
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={getCurrentLocation}
                    sx={{
                      mt: 1,
                      color: "#D32F2F",
                      borderColor: "#D32F2F",
                      "&:hover": { borderColor: "#C62828", color: "#C62828" },
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    startIcon={<MyLocationIcon />}
                  >
                    Use Current Location
                  </Button>
                </FormControl>

                {/* Victim Information */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Victim's Full Name"
                    value={victimName}
                    onChange={(e) => setVictimName(e.target.value)}
                    required
                    InputProps={{
                      style: { fontFamily: "'Poppins', sans-serif" },
                    }}
                  />
                </FormControl>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      value={victimAge}
                      onChange={(e) => setVictimAge(e.target.value)}
                      InputProps={{
                        style: { fontFamily: "'Poppins', sans-serif" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontFamily: "'Poppins', sans-serif" }}>Sex</InputLabel>
                      <Select
                        value={victimSex}
                        onChange={(e) => setVictimSex(e.target.value)}
                        label="Sex"
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        <MenuItem value="male" sx={{ fontFamily: "'Poppins', sans-serif" }}>Male</MenuItem>
                        <MenuItem value="female" sx={{ fontFamily: "'Poppins', sans-serif" }}>Female</MenuItem>
                        <MenuItem value="other" sx={{ fontFamily: "'Poppins', sans-serif" }}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Police Case Number (if available)"
                    value={policeCaseNo}
                    onChange={(e) => setPoliceCaseNo(e.target.value)}
                    InputProps={{
                      style: { fontFamily: "'Poppins', sans-serif" },
                    }}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Incident Description"
                    multiline
                    rows={3}
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                    required
                    InputProps={{
                      style: { fontFamily: "'Poppins', sans-serif" },
                    }}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ fontFamily: "'Poppins', sans-serif" }}>Emergency Type</InputLabel>
                  <Select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    label="Emergency Type"
                    required
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {emergencyTypes.map((type) => (
                      <MenuItem
                        key={type}
                        value={type}
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={requestEmergency}
                  disabled={requestLoading}
                  sx={{
                    width: "100%",
                    bgcolor: "#D32F2F",
                    "&:hover": { bgcolor: "#C62828" },
                    "&:disabled": { bgcolor: "#B0BEC5" },
                    py: 1.5,
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  startIcon={
                    requestLoading ? (
                      <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
                    ) : (
                      <ReportProblemIcon />
                    )
                  }
                >
                  {requestLoading ? "Requesting..." : "Request Emergency"}
                </Button>

                {plusCode !== "Not Available" && (
                  <Typography
                    sx={{
                      mt: 2,
                      color: "#757575",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Plus Code: <strong>{plusCode}</strong>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Map View */}
        {coordinates.lat && coordinates.lng && (
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              >
                <MapContainer
                  center={[coordinates.lat, coordinates.lng]}
                  zoom={15}
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[coordinates.lat, coordinates.lng]} icon={customMarker}>
                    <Popup sx={{ fontFamily: "'Poppins', sans-serif" }}>{location}</Popup>
                  </Marker>
                </MapContainer>
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>

      {/* Emergency Requests List */}
      <Typography
        variant="h5"
        sx={{
          mt: 6,
          mb: 3,
          color: "#00695C",
          fontWeight: 600,
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Your Emergency Requests
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={60} sx={{ color: "#D32F2F" }} />
        </Box>
      ) : emergencyRequests.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            color: "#757575",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          No requests found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {emergencyRequests.map((request) => (
            <Grid item xs={12} sm={6} md={4} key={request._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {request.emergency_type.toUpperCase()}
                      </Typography>
                      <Chip
                        label={request.status.toUpperCase()}
                        color={statusColors[request.status] || "default"}
                        size="small"
                      />
                    </Box>
                    <Typography
                      sx={{
                        color: "#616161",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <LocationOnIcon sx={{ verticalAlign: "middle", mr: 0.5 }} /> {request.location}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#757575",
                        fontSize: "0.9rem",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />{" "}
                      {new Date(request.createdAt).toLocaleString()}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#616161",
                        mt: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <PersonIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />{" "}
                      {request.victim_name || "Not provided"}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#616161",
                        mt: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Age: {request.victim_age || "Not provided"}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#616161",
                        mt: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Sex: {request.victim_sex || "Not provided"}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#616161",
                        mt: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Police Case No: {request.police_case_no || "Not provided"}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#616161",
                        mt: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Description: {request.incident_description || "Not provided"}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={successOpen || !!message}
        autoHideDuration={6000}
        onClose={() => {
          setSuccessOpen(false);
          setMessage("");
        }}
      >
        <Alert
          severity={message ? "error" : "success"}
          onClose={() => {
            setSuccessOpen(false);
            setMessage("");
          }}
          sx={{
            width: "100%",
            bgcolor: message ? "#D32F2F" : "#00695C",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {message || "✅ Emergency request sent successfully!"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PatientDashboard;