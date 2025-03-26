import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
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
  CardMedia,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import VerifiedIcon from "@mui/icons-material/Verified";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import { baseURL, staticBaseURL } from "../utils/baseURL";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Fix Leaflet marker icons and create custom icons based on priority
delete L.Icon.Default.prototype._getIconUrl;

const highPriorityIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const mediumPriorityIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const lowPriorityIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getMarkerIcon = (priority) => {
  switch (priority) {
    case "High":
      return highPriorityIcon;
    case "Medium":
      return mediumPriorityIcon;
    case "Low":
      return lowPriorityIcon;
    default:
      return new L.Icon.Default();
  }
};

// Map Legend Component
const MapLegend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      div.style.padding = "10px";
      div.style.borderRadius = "5px";
      div.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
      div.innerHTML = `
        <h4 style="margin: 0 0 5px 0; font-family: 'Poppins', sans-serif; color: #00695C;">Priority Legend</h4>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" style="width: 20px; height: 32px; margin-right: 5px;" alt="High Priority Marker" />
          <span style="font-family: 'Poppins', sans-serif; color: #333;">High Priority</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png" style="width: 20px; height: 32px; margin-right: 5px;" alt="Medium Priority Marker" />
          <span style="font-family: 'Poppins', sans-serif; color: #333;">Medium Priority</span>
        </div>
        <div style="display: flex; align-items: center;">
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png" style="width: 20px; height: 32px; margin-right: 5px;" alt="Low Priority Marker" />
          <span style="font-family: 'Poppins', sans-serif; color: #333;">Low Priority</span>
        </div>
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

// Separate MapComponent to isolate the MapContainer
const MapComponent = ({ reports, onMarkerClick, onMarkerHover, searchQuery }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const markerClusterGroupRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (markerClusterGroupRef.current) {
      map.removeLayer(markerClusterGroupRef.current);
    }

    const markerClusterGroup = new MarkerClusterGroup({
      maxClusterRadius: 50,
      iconCreateFunction: (cluster) => {
        return L.divIcon({
          html: `<div style="background-color: #D32F2F; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-family: 'Poppins', sans-serif; font-weight: 600;">${cluster.getChildCount()}</div>`,
          className: "marker-cluster-custom",
          iconSize: L.point(30, 30),
        });
      },
    });

    const validReports = reports.filter(
      (report) => report.coordinates.latitude !== 0 && report.coordinates.longitude !== 0
    );

    if (validReports.length > 0) {
      validReports.forEach((report) => {
        const matchesSearch =
          !searchQuery ||
          report.emergency_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.location.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return;

        const marker = L.marker(
          [report.coordinates.latitude, report.coordinates.longitude],
          { icon: getMarkerIcon(report.priority) }
        );

        marker.bindPopup(`
          <div style="font-family: 'Poppins', sans-serif; color: #333;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #00695C;">${report.emergency_type.toUpperCase()}</h3>
            <p style="margin: 4px 0;"><strong>Location:</strong> ${report.location}</p>
            <p style="margin: 4px 0;"><strong>Priority:</strong> ${report.priority}</p>
            <p style="margin: 4px 0;"><strong>Coordinates:</strong> (${report.coordinates.latitude.toFixed(6)}, ${report.coordinates.longitude.toFixed(6)})</p>
            <div style="margin-top: 8px; display: flex; gap: 8px;">
              <button id="copy-coords-${report._id}" style="padding: 4px 8px; background-color: #D32F2F; color: white; border: none; border-radius: 4px; cursor: pointer;" aria-label="Copy coordinates to clipboard">Copy Coordinates</button>
              <a href="https://www.google.com/maps?q=${report.coordinates.latitude},${report.coordinates.longitude}" target="_blank" style="padding: 4px 8px; background-color: #00695C; color: white; text-decoration: none; border-radius: 4px;" aria-label="Open location in Google Maps">Open in Google Maps</a>
            </div>
          </div>
        `);

        marker.on("click", () => {
          onMarkerClick(report._id);
        });

        marker.on("mouseover", () => {
          onMarkerHover(report._id, true);
        });
        marker.on("mouseout", () => {
          onMarkerHover(report._id, false);
        });

        marker.on("popupopen", () => {
          const copyButton = document.getElementById(`copy-coords-${report._id}`);
          if (copyButton) {
            copyButton.addEventListener("click", () => {
              navigator.clipboard.writeText(
                `${report.coordinates.latitude.toFixed(6)}, ${report.coordinates.longitude.toFixed(6)}`
              );
              copyButton.textContent = "Copied!";
              setTimeout(() => {
                copyButton.textContent = "Copy Coordinates";
              }, 2000);
            });
          }
        });

        markersRef.current[report._id] = marker;
        markerClusterGroup.addLayer(marker);
      });

      map.addLayer(markerClusterGroup);
      markerClusterGroupRef.current = markerClusterGroup;

      map.setView(
        [validReports[0].coordinates.latitude, validReports[0].coordinates.longitude],
        13
      );
    } else {
      map.setView([0, 0], 2);
    }
  }, [reports, onMarkerClick, onMarkerHover, searchQuery]);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "500px", width: "100%", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
      aria-label="Map displaying emergency incident locations"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
      />
      <ZoomControl position="topright" />
      <ScaleControl position="bottomleft" />
      <MapLegend />
    </MapContainer>
  );
};

const PoliceDashboard = () => {
  const { user } = useContext(AuthContext);
  const [accidentReports, setAccidentReports] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [notes, setNotes] = useState({});
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [highlightedReport, setHighlightedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageLoadStatus, setImageLoadStatus] = useState({});
  const mapRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    fetchPendingAccidents();

    socket.on("new_accident_report", (newReport) => {
      console.log("New accident report received:", newReport);
      setAccidentReports((prevReports) => [...prevReports, newReport]);
      setMessage("🚨 New report received!");
      setOpenSnackbar(true);
    });

    socket.on("accident_verified", ({ requestId }) => {
      console.log("Accident verified:", requestId);
      setAccidentReports((prevReports) =>
        prevReports.filter((report) => report._id !== requestId)
      );
      setMessage("✅ An accident has been verified!");
      setOpenSnackbar(true);
    });

    return () => {
      socket.off("new_accident_report");
      socket.off("accident_verified");
    };
  }, []);

  const fetchPendingAccidents = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Unauthorized. Please log in again.");

      const queryParams = new URLSearchParams();
      if (filterType) queryParams.append("emergency_type", filterType);
      if (filterDate) queryParams.append("date", filterDate.toISOString());
      if (filterStatus) queryParams.append("status", filterStatus);
      if (filterPriority) queryParams.append("priority", filterPriority);

      const response = await fetch(
        `${baseURL}/emergency/pending-accidents?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load pending accidents");
      }
      const data = await response.json();
      console.log("Fetched pending accidents:", data);

      data.forEach((report, index) => {
        console.log(`Report ${index} - Image field:`, report.image);
        if (report.image) {
          console.log(`Full image URL for report ${index}: ${staticBaseURL}${report.image}`);
        }
      });

      const initialNotes = {};
      data.forEach((report) => {
        initialNotes[report._id] = report.notes || "";
      });
      setNotes(initialNotes);

      setAccidentReports(data);
      if (data.length === 0) setMessage("No pending accident reports");
    } catch (error) {
      console.error("Network Error:", error);
      setMessage(`❌ ${error.message || "Server error. Please try again later."}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyAccident = async (reportId) => {
    setVerifying((prev) => ({ ...prev, [reportId]: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Unauthorized. Please log in again.");

      const response = await fetch(`${baseURL}/emergency/verify/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
      }
      const data = await response.json();
      console.log("Verified accident:", data);

      setAccidentReports((prevReports) => prevReports.filter((report) => report._id !== reportId));
      setMessage("✅ Accident verified successfully!");
      socket.emit("accident_verified", { requestId: reportId });
    } catch (error) {
      console.error("Verification Error:", error);
      setMessage(`❌ ${error.message || "Server error during verification"}`);
    } finally {
      setVerifying((prev) => ({ ...prev, [reportId]: false }));
      setOpenSnackbar(true);
    }
  };

  const addNote = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/emergency/add-note/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note: notes[reportId] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add note");
      }

      setMessage("✅ Note added successfully!");
      setOpenSnackbar(true);

      setAccidentReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, notes: notes[reportId] } : report
        )
      );
      setNotes((prev) => ({ ...prev, [reportId]: "" }));
    } catch (error) {
      console.error("Error adding note:", error);
      setMessage(`❌ ${error.message || "Server error"}`);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleImageError = (reportId) => () => {
    console.error(`Failed to load image for report ${reportId}: ${staticBaseURL}${accidentReports.find(r => r._id === reportId)?.image}`);
    setImageLoadStatus((prev) => ({ ...prev, [reportId]: false }));
  };

  const handleImageLoad = (reportId) => () => {
    setImageLoadStatus((prev) => ({ ...prev, [reportId]: true }));
  };

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  const handleMarkerClick = (reportId) => {
    const element = document.getElementById(`report-${reportId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMarkerHover = (reportId, isHovering) => {
    setHighlightedReport(isHovering ? reportId : null);
  };

  const handleCenterMap = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude], 13);
    }
  };

  const handleCopyCoordinates = (latitude, longitude) => {
    navigator.clipboard.writeText(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    setMessage("✅ Coordinates copied to clipboard!");
    setOpenSnackbar(true);
  };

  // Function to load image as base64 for PDF inclusion
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.onerror = () => reject(new Error("Failed to load image for PDF"));
    });
  };

  // Download a single report as PDF
  const downloadReport = async (report) => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.text("Emergency Report", 20, 20);

      doc.setFontSize(12);
      let yPosition = 30;

      // Add report details
      doc.text(`Emergency Type: ${report.emergency_type.toUpperCase()}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Status: ${report.status}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Location: ${report.location}`, 20, yPosition);
      yPosition += 10;
      doc.text(
        `Coordinates: (${report.coordinates.latitude.toFixed(6)}, ${report.coordinates.longitude.toFixed(6)})`,
        20,
        yPosition
      );
      yPosition += 10;
      doc.text(`Time: ${new Date(report.createdAt).toLocaleString()}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Victim Name: ${report.victim_name || "Not provided"}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Age: ${report.victim_age || "Not provided"}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Sex: ${report.victim_sex || "Not provided"}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Police Case No: ${report.police_case_no || "Not provided"}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Priority: ${report.priority}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Verified By: ${report.verified_by ? report.verified_by.name : "Not verified"}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Description: ${report.incident_description || "Not provided"}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Notes: ${report.notes || "No notes added"}`, 20, yPosition);
      yPosition += 20;

      // Add image if available
      if (report.image && imageLoadStatus[report._id] !== false) {
        try {
          const imageUrl = `${staticBaseURL}${report.image}`;
          const imageData = await loadImageAsBase64(imageUrl);
          const imgProps = doc.getImageProperties(imageData);
          const pdfWidth = doc.internal.pageSize.getWidth() - 40;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(imageData, "JPEG", 20, yPosition, pdfWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.error("Error adding image to PDF:", error);
          doc.text("Image: Failed to load image", 20, yPosition);
          yPosition += 10;
        }
      } else {
        doc.text("Image: Not provided", 20, yPosition);
        yPosition += 10;
      }

      doc.save(`Emergency_Report_${report._id}.pdf`);
      setMessage("✅ Report downloaded successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error downloading report:", error);
      setMessage("❌ Failed to download report");
      setOpenSnackbar(true);
    }
  };

  // Download all filtered reports as a single PDF
  const downloadAllReports = async () => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.text("Emergency Reports Summary", 20, 20);

      let yPosition = 30;

      for (let i = 0; i < filteredReports.length; i++) {
        const report = filteredReports[i];

        if (i > 0) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.text(`Report ${i + 1}: ${report.emergency_type.toUpperCase()}`, 20, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.text(`Status: ${report.status}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Location: ${report.location}`, 20, yPosition);
        yPosition += 10;
        doc.text(
          `Coordinates: (${report.coordinates.latitude.toFixed(6)}, ${report.coordinates.longitude.toFixed(6)})`,
          20,
          yPosition
        );
        yPosition += 10;
        doc.text(`Time: ${new Date(report.createdAt).toLocaleString()}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Victim Name: ${report.victim_name || "Not provided"}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Age: ${report.victim_age || "Not provided"}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Sex: ${report.victim_sex || "Not provided"}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Police Case No: ${report.police_case_no || "Not provided"}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Priority: ${report.priority}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Verified By: ${report.verified_by ? report.verified_by.name : "Not verified"}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Description: ${report.incident_description || "Not provided"}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Notes: ${report.notes || "No notes added"}`, 20, yPosition);
        yPosition += 20;

        // Add image if available
        if (report.image && imageLoadStatus[report._id] !== false) {
          try {
            const imageUrl = `${staticBaseURL}${report.image}`;
            const imageData = await loadImageAsBase64(imageUrl);
            const imgProps = doc.getImageProperties(imageData);
            const pdfWidth = doc.internal.pageSize.getWidth() - 40;
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            if (yPosition + imgHeight > doc.internal.pageSize.getHeight() - 20) {
              doc.addPage();
              yPosition = 20;
            }
            doc.addImage(imageData, "JPEG", 20, yPosition, pdfWidth, imgHeight);
            yPosition += imgHeight + 10;
          } catch (error) {
            console.error("Error adding image to PDF:", error);
            doc.text("Image: Failed to load image", 20, yPosition);
            yPosition += 10;
          }
        } else {
          doc.text("Image: Not provided", 20, yPosition);
          yPosition += 10;
        }
      }

      doc.save("Emergency_Reports_Summary.pdf");
      setMessage("✅ All reports downloaded successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error downloading all reports:", error);
      setMessage("❌ Failed to download all reports");
      setOpenSnackbar(true);
    }
  };

  const sortedReports = useMemo(() => {
    return [...accidentReports].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortField === "createdAt") {
        return direction * (new Date(a.createdAt) - new Date(b.createdAt));
      }
      if (sortField === "priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return direction * (priorityOrder[a.priority] - priorityOrder[b.priority]);
      }
      return 0;
    });
  }, [accidentReports, sortField, sortDirection]);

  const filteredReports = useMemo(() => {
    if (!searchQuery) return sortedReports;
    return sortedReports.filter(
      (report) =>
        report.emergency_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedReports, searchQuery]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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

        {/* Filter, Sort, and Search Section */}
        <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Emergency Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Emergency Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="accident">Accident</MenuItem>
              <MenuItem value="burns">Burns</MenuItem>
              <MenuItem value="pregnancy">Pregnancy</MenuItem>
              <MenuItem value="injury">Injury</MenuItem>
              <MenuItem value="medical">Medical</MenuItem>
              <MenuItem value="unspecified">Unspecified</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="dispatched">Dispatched</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            label="Filter by Date"
            value={filterDate}
            onChange={(newValue) => setFilterDate(newValue)}
            slots={{ textField: TextField }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="createdAt">Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Direction</InputLabel>
            <Select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              label="Direction"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Search by Type or Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            aria-label="Search reports by emergency type or location"
          />
          <Button
            variant="contained"
            onClick={fetchPendingAccidents}
            sx={{ fontFamily: "'Poppins', sans-serif", bgcolor: "#00695C", "&:hover": { bgcolor: "#005548" } }}
            aria-label="Apply filters to fetch reports"
          >
            Apply Filters
          </Button>
        </Box>

        {/* Coordinates Summary Table */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#00695C",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              mb: 2,
            }}
          >
            Incident Coordinates
          </Typography>
          {filteredReports.length > 0 ? (
            <TableContainer component={Paper} sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <Table aria-label="Table of incident coordinates">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#00695C" }}>
                      Emergency Type
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#00695C" }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#00695C" }}>
                      Coordinates
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#00695C" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports
                    .filter((report) => report.coordinates.latitude !== 0 && report.coordinates.longitude !== 0)
                    .map((report) => (
                      <TableRow key={report._id}>
                        <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>
                          {report.emergency_type.toUpperCase()}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>
                          {report.location}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'Poppins', sans-serif" }}>
                          ({report.coordinates.latitude.toFixed(6)}, {report.coordinates.longitude.toFixed(6)})
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Center Map on Incident">
                            <IconButton
                              onClick={() => handleCenterMap(report.coordinates.latitude, report.coordinates.longitude)}
                              sx={{ color: "#00695C" }}
                              aria-label={`Center map on ${report.emergency_type} at ${report.location}`}
                            >
                              <MapIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy Coordinates">
                            <IconButton
                              onClick={() => handleCopyCoordinates(report.coordinates.latitude, report.coordinates.longitude)}
                              sx={{ color: "#D32F2F" }}
                              aria-label={`Copy coordinates for ${report.emergency_type} at ${report.location}`}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Open in Google Maps">
                            <IconButton
                              component="a"
                              href={`https://www.google.com/maps?q=${report.coordinates.latitude},${report.coordinates.longitude}`}
                              target="_blank"
                              sx={{ color: "#00695C" }}
                              aria-label={`Open ${report.emergency_type} location in Google Maps`}
                            >
                              <MapIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "#757575",
                textAlign: "center",
                py: 2,
              }}
            >
              No valid coordinates to display.
            </Typography>
          )}
        </Box>

        {/* Single Map for All Reports */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#00695C",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              mb: 2,
            }}
          >
            Emergency Locations
          </Typography>
          <MapComponent
            reports={sortedReports}
            onMarkerClick={handleMarkerClick}
            onMarkerHover={handleMarkerHover}
            searchQuery={searchQuery}
            ref={mapRef}
          />
        </Box>

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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="Download All Reports">
              <span>
                <Button
                  variant="contained"
                  onClick={downloadAllReports}
                  disabled={loading || filteredReports.length === 0}
                  startIcon={<DownloadIcon />}
                  sx={{
                    bgcolor: "#00695C",
                    "&:hover": { bgcolor: "#005548" },
                    fontFamily: "'Poppins', sans-serif",
                    textTransform: "none",
                  }}
                  aria-label="Download all filtered reports as PDF"
                >
                  Download All Reports
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Refresh Reports">
              <span>
                <IconButton
                  onClick={fetchPendingAccidents}
                  disabled={loading}
                  sx={{
                    color: "#D32F2F",
                    "&:hover": { color: "#C62828" },
                  }}
                  aria-label="Refresh pending reports"
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "#D32F2F" }} /> : <RefreshIcon />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress size={60} sx={{ color: "#D32F2F" }} />
          </Box>
        ) : filteredReports.length === 0 ? (
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
            {filteredReports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    id={`report-${report._id}`}
                    sx={{
                      bgcolor: "#FFFFFF",
                      borderRadius: 2,
                      boxShadow:
                        highlightedReport === report._id
                          ? "0 4px 25px rgba(211, 47, 47, 0.5)"
                          : "0 2px 15px rgba(0,0,0,0.05)",
                      "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      border: "1px solid #E0E0E0",
                    }}
                    aria-label={`Report card for ${report.emergency_type} at ${report.location}`}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        bgcolor: "#F5F5F5",
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #E0E0E0",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#00695C",
                          fontFamily: "'Poppins', sans-serif'",
                        }}
                      >
                        {report.emergency_type.toUpperCase()}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          label={report.status}
                          color={
                            report.status === "pending"
                              ? "warning"
                              : report.status === "verified"
                              ? "success"
                              : report.status === "dispatched"
                              ? "info"
                              : "default"
                          }
                          size="small"
                          sx={{ fontWeight: 500, fontFamily: "'Poppins', sans-serif'" }}
                        />
                        <Tooltip title="Download Report">
                          <IconButton
                            onClick={() => downloadReport(report)}
                            sx={{ color: "#00695C" }}
                            aria-label={`Download report for ${report.emergency_type} at ${report.location}`}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 2 }}>
                      {/* Image */}
                      <Box sx={{ mb: 2, textAlign: "center" }}>
                        {report.image ? (
                          <Box sx={{ position: "relative", display: "inline-block" }}>
                            <CardMedia
                              component="img"
                              height="180"
                              image={`${staticBaseURL}${report.image}`}
                              alt={`Image of ${report.emergency_type} at ${report.location}`}
                              sx={{
                                objectFit: "cover",
                                borderRadius: 1,
                                border: "1px solid #E0E0E0",
                                cursor: "pointer",
                                maxWidth: "100%",
                              }}
                              onLoad={handleImageLoad(report._id)}
                              onError={handleImageError(report._id)}
                              onClick={() => handleOpenModal(`${staticBaseURL}${report.image}`)}
                            />
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "rgba(0,0,0,0.6)",
                                color: "white",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                              }}
                              onClick={() => handleOpenModal(`${staticBaseURL}${report.image}`)}
                              aria-label={`Zoom in on image of ${report.emergency_type} at ${report.location}`}
                            >
                              <ZoomInIcon />
                            </IconButton>
                            {imageLoadStatus[report._id] === false && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#757575",
                                  mt: 1,
                                  fontFamily: "'Poppins', sans-serif'",
                                }}
                              >
                                Failed to load image
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#757575",
                              fontFamily: "'Poppins', sans-serif'",
                            }}
                          >
                            No image provided
                          </Typography>
                        )}
                      </Box>

                      {/* Details */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Location:</strong> {report.location}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#424242",
                              fontFamily: "'Poppins', sans-serif'",
                            }}
                          >
                            <strong>Coordinates:</strong> ({report.coordinates.latitude.toFixed(6)},{" "}
                            {report.coordinates.longitude.toFixed(6)})
                          </Typography>
                          <Tooltip title="Copy Coordinates">
                            <IconButton
                              onClick={() =>
                                handleCopyCoordinates(report.coordinates.latitude, report.coordinates.longitude)
                              }
                              sx={{ color: "#D32F2F", p: 0.5 }}
                              aria-label={`Copy coordinates for ${report.emergency_type} at ${report.location}`}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Open in Google Maps">
                            <IconButton
                              component="a"
                              href={`https://www.google.com/maps?q=${report.coordinates.latitude},${report.coordinates.longitude}`}
                              target="_blank"
                              sx={{ color: "#00695C", p: 0.5 }}
                              aria-label={`Open ${report.emergency_type} location in Google Maps`}
                            >
                              <MapIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Time:</strong> {new Date(report.createdAt).toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Victim Name:</strong> {report.victim_name || "Not provided"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Age:</strong> {report.victim_age || "Not provided"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Sex:</strong> {report.victim_sex || "Not provided"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Police Case No:</strong> {report.police_case_no || "Not provided"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Priority:</strong> {report.priority}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Verified By:</strong>{" "}
                          {report.verified_by ? report.verified_by.name : "Not verified"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Description:</strong> {report.incident_description || "Not provided"}
                        </Typography>
                      </Box>

                      {/* Notes */}
                      <Box
                        sx={{
                          bgcolor: "#FAFAFA",
                          p: 2,
                          borderRadius: 1,
                          border: "1px solid #E0E0E0",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#424242",
                            mb: 1,
                            fontFamily: "'Poppins', sans-serif'",
                          }}
                        >
                          <strong>Notes:</strong> {report.notes || "No notes added"}
                        </Typography>
                        <TextField
                          value={notes[report._id] || ""}
                          onChange={(e) =>
                            setNotes((prev) => ({
                              ...prev,
                              [report._id]: e.target.value,
                            }))
                          }
                          multiline
                          rows={3}
                          fullWidth
                          placeholder="Add a note..."
                          sx={{
                            mb: 1,
                            "& .MuiOutlinedInput-root": {
                              fontFamily: "'Poppins', sans-serif'",
                              fontSize: "0.9rem",
                            },
                          }}
                          aria-label={`Add a note for ${report.emergency_type} at ${report.location}`}
                        />
                        <Button
                          variant="contained"
                          onClick={() => addNote(report._id)}
                          fullWidth
                          sx={{
                            bgcolor: "#00695C",
                            "&:hover": { bgcolor: "#005548" },
                            fontFamily: "'Poppins', sans-serif'",
                            textTransform: "none",
                            py: 1,
                          }}
                          aria-label={`Save note for ${report.emergency_type} at ${report.location}`}
                        >
                          Save Note
                        </Button>
                      </Box>

                      {/* Actions */}
                      {report.status === "pending" && (
                        <Button
                          variant="contained"
                          onClick={() => verifyAccident(report._id)}
                          disabled={verifying[report._id]}
                          fullWidth
                          startIcon={
                            verifying[report._id] ? (
                              <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
                            ) : (
                              <VerifiedIcon />
                            )
                          }
                          sx={{
                            bgcolor: "#D32F2F",
                            "&:hover": { bgcolor: "#C62828" },
                            "&:disabled": { bgcolor: "#B0BEC5" },
                            fontFamily: "'Poppins', sans-serif'",
                            textTransform: "none",
                            py: 1,
                            mt: 1,
                          }}
                          aria-label={`Verify ${report.emergency_type} report at ${report.location}`}
                        >
                          {verifying[report._id] ? "Verifying..." : "Verify Report"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Image Zoom Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "black",
              p: 2,
              borderRadius: 2,
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            role="dialog"
            aria-labelledby="image-zoom-modal"
          >
            <img
              src={selectedImage}
              alt="Zoomed Emergency Scene"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </Box>
        </Modal>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={message.startsWith("❌") ? "error" : "success"}
            sx={{
              width: "100%",
              boxShadow: 3,
              bgcolor: message.startsWith("❌") ? "#FFEBEE" : "#E8F5E9",
              color: message.startsWith("❌") ? "#D32F2F" : "#00695C",
              fontFamily: "'Poppins', sans-serif",
            }}
            aria-live="assertive"
          >
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default PoliceDashboard;