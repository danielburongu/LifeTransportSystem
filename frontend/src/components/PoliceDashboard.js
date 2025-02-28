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
  Box,
  Grid,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";

const PoliceDashboard = () => {
  const { user } = useContext(AuthContext);
  const [accidentReports, setAccidentReports] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchPendingAccidents();

    socket.on("new_accident_report", (newReport) => {
      setAccidentReports((prevReports) => [...prevReports, newReport]);
      setMessage("New report received");
      setOpenSnackbar(true);
    });

    socket.on("accident_verified", ({ requestId }) => {
      setAccidentReports((prevReports) =>
        prevReports.filter((report) => report._id !== requestId)
      );
      setMessage("An accident has been verified");
      setOpenSnackbar(true);
    });

    return () => {
      socket.off("new_accident_report");
      socket.off("accident_verified");
    };
  }, []);

  const fetchPendingAccidents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized. Please log in again.");

      const response = await fetch("http://localhost:5000/api/emergency/pending-accidents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setAccidentReports(data);
        if (data.length === 0) setMessage("No pending accident reports");
      } else {
        setMessage(data.message || "Failed to load pending accidents");
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAccident = async (reportId) => {
    setVerifying((prev) => ({ ...prev, [reportId]: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized. Please log in again.");

      const response = await fetch(`http://localhost:5000/api/emergency/verify/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAccidentReports((prevReports) => prevReports.filter((report) => report._id !== reportId));
        setMessage("Accident verified successfully");
        socket.emit("accident_verified", { requestId: reportId });
      } else {
        setMessage(data.message || "Verification failed");
      }
    } catch (error) {
      setMessage("Server error during verification");
    } finally {
      setVerifying((prev) => ({ ...prev, [reportId]: false }));
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 10,
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
            p: 3,
            borderRadius: 2,
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
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
              Police Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#E0E0E0",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Review & Verify Emergency Reports
            </Typography>
          </Box>
          <Box
            component="img"
            src="https://www.svgrepo.com/show/398103/police-officer-medium-dark-skin-tone.svg"
            alt="Police Icon"
            sx={{ width: 60, height: 60 }}
          />
        </Box>
      </motion.div>

      {/* Reports Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            color: "#00695C",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Pending Reports
        </Typography>
        <Tooltip title="Refresh Reports">
          <IconButton
            onClick={fetchPendingAccidents}
            disabled={loading}
            sx={{
              color: "#D32F2F",
              "&:hover": { color: "#C62828" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <CircularProgress size={60} sx={{ color: "#D32F2F" }} />
        </Box>
      ) : accidentReports.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          color="#757575"
          sx={{ py: 4, fontFamily: "'Poppins', sans-serif" }}
        >
          No pending reports to verify
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {accidentReports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
                    "&:hover": { boxShadow: "0 4px 25px rgba(0,0,0,0.1)" },
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <ReportProblemIcon sx={{ fontSize: 60, color: "#D32F2F" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#00695C",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {report.emergency_type.toUpperCase()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <LocationOnIcon sx={{ verticalAlign: "middle", mr: 0.5, color: "#D32F2F" }} />
                      {report.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 0.5, color: "#D32F2F" }} />
                      {new Date(report.createdAt).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <PersonIcon sx={{ verticalAlign: "middle", mr: 0.5, color: "#D32F2F" }} />
                      {report.victim_name || "Not provided"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Age: {report.victim_age || "Not provided"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Sex: {report.victim_sex || "Not provided"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161",
                        mb: 1,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Police Case No: {report.police_case_no || "Not provided"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161",
                        mb: 2,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Description: {report.incident_description || "Not provided"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Chip
                        label="Pending"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => verifyAccident(report._id)}
                        disabled={verifying[report._id]}
                        size="small"
                        startIcon={
                          verifying[report._id] ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <VerifiedIcon />
                          )
                        }
                        sx={{
                          bgcolor: "#D32F2F",
                          "&:hover": { bgcolor: "#C62828" },
                          borderRadius: 1,
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {verifying[report._id] ? "Verifying" : "Verify"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message.startsWith("Server error") ? "error" : "info"}
          sx={{
            width: "100%",
            boxShadow: 3,
            bgcolor: message.startsWith("Server error") ? "#FFEBEE" : "#E8F5E9",
            color: message.startsWith("Server error") ? "#D32F2F" : "#00695C",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PoliceDashboard;