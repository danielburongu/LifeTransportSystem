require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const fs = require("fs");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Match original working local setup
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors()); // Simplest CORS setup, allows all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Created uploads directory");
}

// Make io available to routes
app.set("io", io);

// Connect to MongoDB with reconnection logic
const connectToMongoDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err.message);
      console.log("Retrying MongoDB connection in 5 seconds...");
      setTimeout(connectToMongoDB, 5000);
    });
};
connectToMongoDB();

// Import Models
try {
  require("./src/models/User");
  require("./src/models/EmergencyRequest");
  require("./src/models/Ambulance");
  console.log("✅ Models loaded successfully");
} catch (err) {
  console.error("❌ Error loading models:", err.message);
}

// Import Routes
let authRoutes, emergencyRoutes, ambulanceRoutes;
try {
  authRoutes = require("./src/routes/authRoutes");
  emergencyRoutes = require("./src/routes/emergencyRoutes");
  ambulanceRoutes = require("./src/routes/ambulanceRoutes")(io);
  console.log("✅ Routes loaded successfully");
} catch (err) {
  console.error("❌ Error loading routes:", err.message);
}

// Use Routes with logging
app.use("/api/auth", (req, res, next) => {
  console.log(`📡 ${req.method} request to /api/auth${req.path}`);
  authRoutes(req, res, next);
});
app.use("/api/emergency", (req, res, next) => {
  console.log(`📡 ${req.method} request to /api/emergency${req.path}`);
  emergencyRoutes(req, res, next);
});
app.use("/api/ambulance", (req, res, next) => {
  console.log(`📡 ${req.method} request to /api/ambulance${req.path}`);
  ambulanceRoutes(req, res, next);
});

// WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log(`🔌 New WebSocket connection: ${socket.id}`);

  // Handle location updates (existing event)
  socket.on("updateLocation", (data) => {
    console.log("📍 Received location update:", data);
    io.emit("locationUpdated", data);
  });

  // Handle driver status updates
  socket.on("driver_status_update", async ({ userId, status }) => {
    try {
      console.log(`📡 Driver ${userId} updated status to: ${status}`);
      // Optionally update the driver's status in the database
      const User = mongoose.model("User"); // Assuming User model is defined
      await User.findByIdAndUpdate(userId, { driverStatus: status }, { new: true });

      // Broadcast the updated status to all connected clients (e.g., HospitalDashboard)
      io.emit("driver_status_updated", { userId, status });
    } catch (error) {
      console.error("❌ Error handling driver status update:", error.message);
    }
  });

  // Handle existing emergency-related events (already implemented in emergencyRoutes)
  socket.on("new_accident_report", (data) => {
    console.log("📡 Broadcasting new accident report:", data);
    io.emit("new_accident_report", data);
  });

  socket.on("accident_verified", (data) => {
    console.log("📡 Broadcasting accident verified:", data);
    io.emit("accident_verified", data);
  });

  socket.on("ambulance_dispatched", (data) => {
    console.log("📡 Broadcasting ambulance dispatched:", data);
    io.emit("ambulance_dispatched", data);
  });

  socket.on("patient_arrived", (data) => {
    console.log("📡 Broadcasting patient arrived:", data);
    io.emit("patient_arrived", data);
  });

  socket.on("new_verified_emergency", (data) => {
    console.log("📡 Broadcasting new verified emergency:", data);
    io.emit("new_verified_emergency", data);
  });

  socket.on("emergency_completed", (data) => {
    console.log("📡 Broadcasting emergency completed:", data);
    io.emit("emergency_completed", data);
  });

  // Handle ambulance location updates
  socket.on("ambulance_location_update", (data) => {
    console.log("📍 Received ambulance location update:", data);
    io.emit("ambulance_location_updated", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 WebSocket disconnected: ${socket.id}`);
  });
});

// Default Route with health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚑 Welcome to Life Transport Systems API 🚑", status: "ok" });
});

// Test Route to Verify Fetching
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Test endpoint working", timestamp: new Date().toISOString() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "❌ Internal Server Error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});