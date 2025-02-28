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
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import Models
require("./src/models/User");
require("./src/models/EmergencyRequest");
require("./src/models/Ambulance");

const User = require("./src/models/User");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const emergencyRoutes = require("./src/routes/emergencyRoutes");
const ambulanceRoutes = require("./src/routes/ambulanceRoutes")(io); // Correct import with io

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/ambulance", ambulanceRoutes); // Now correctly initialized

// WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log(`🔌 New WebSocket connection: ${socket.id}`);

  socket.on("updateLocation", (data) => {
    io.emit("locationUpdated", data); // Broadcast location updates to all clients
  });

  socket.on("disconnect", () => {
    console.log(`🔴 WebSocket disconnected: ${socket.id}`);
  });
});

// Default Route
app.get("/", (req, res) => {
  res.send("🚑 Welcome to Life Transport Systems API 🚑");
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
