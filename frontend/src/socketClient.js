import { io } from "socket.io-client";

// Dynamically set WebSocket URL based on environment
const socketUrl = process.env.NODE_ENV === "production"
  ? "https://life-transport-system-backend.onrender.com"
  : "http://localhost:5000";

// Connect to WebSocket server
const socket = io(socketUrl, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,   // Delays between reconnection attempts (ms)
});

// Connection event handlers
socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server:", socketUrl);
});

socket.on("locationUpdated", (data) => {
  console.log("📍 New ambulance location update:", data);
  // Updates map markers or dispatch to state management
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