require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: true, // Allow all origins for WebSocket (simplified)
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: true, // Allow all origins for HTTP requests (simplified)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

  socket.on("updateLocation", (data) => {
    console.log("📍 Received location update:", data);
    io.emit("locationUpdated", data);
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