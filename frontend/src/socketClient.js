import { io } from "socket.io-client";

// Connect to WebSocket server
const socket = io("http://localhost:5000"); // backend URL

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server");
});

socket.on("locationUpdated", (data) => {
  console.log(" New ambulance location update:", data);
  //  update map markers
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from WebSocket server");
});

export default socket;
