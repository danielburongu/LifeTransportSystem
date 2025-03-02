import { io } from "socket.io-client";

// Dynamically set WebSocket URL based on environment
const socketUrl = process.env.NODE_ENV === "production"
  ? "https://life-transport-system-backend.onrender.com"
  : "http://localhost:5000";

// Connect to WebSocket server
const socket = io(socketUrl, {
  transports: ["websocket"], // Use WebSocket only for better compatibility
  reconnection: true,        // Enable reconnection attempts
  reconnectionAttempts: 5,   // Limit reconnection attempts
  reconnectionDelay: 1000,   // Delay between reconnection attempts (ms)
});

// Connection event handlers
socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server:", socketUrl);
});

socket.on("locationUpdated", (data) => {
  console.log("📍 New ambulance location update:", data);
  // Update map markers or dispatch to state management (e.g., Redux) here if needed
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from WebSocket server:", socketUrl);
});

socket.on("reconnect", (attempt) => {
  console.log("🔄 Reconnected to WebSocket server after", attempt, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("❌ Reconnection error:", error);
});

export default socket;