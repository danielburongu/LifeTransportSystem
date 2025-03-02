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
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://life-transport-system-zxel-nu.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://life-transport-system-zxel-nu.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available to routes
app.set("io", io);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Do not exit—allow server to run and retry connection
  });

// Import Models
require("./src/models/User");
require("./src/models/EmergencyRequest");
require("./src/models/Ambulance");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const emergencyRoutes = require("./src/routes/emergencyRoutes");
const ambulanceRoutes = require("./src/routes/ambulanceRoutes")(io);

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/ambulance", ambulanceRoutes);

// WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log(`🔌 New WebSocket connection: ${socket.id}`);

  socket.on("updateLocation", (data) => {
    console.log("📍 Received location update:", data);
    io.emit("locationUpdated", data); // Broadcast location updates to all clients
  });

  socket.on("disconnect", () => {
    console.log(`🔴 WebSocket disconnected: ${socket.id}`);
  });
});

// Default Route with health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚑 Welcome to Life Transport Systems API 🚑", status: "ok" });
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