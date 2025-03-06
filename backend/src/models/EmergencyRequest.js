const mongoose = require("mongoose");

const EmergencyRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Made optional for guest requests
  location: { type: String, required: true },
  emergency_type: {
    type: String,
    enum: ["accident", "burns", "pregnancy", "injury", "medical", "unspecified"], // Added "unspecified"
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "verified", "dispatched", "completed"],
    default: "pending",
  },
  police_verification: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  coordinates: {
    latitude: { type: Number, required: true, default: 0 },
    longitude: { type: Number, required: true, default: 0 },
  },
  plus_code: { type: String, default: "" },
  victim_name: { type: String, required: true },
  victim_age: { type: String, default: "" },
  victim_sex: { type: String, default: "" },
  incident_description: { type: String, required: true },
  police_case_no: { type: String, default: "" },
  notes: { type: String, default: "" },
  assigned_ambulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ambulance",
    default: null,
  },
}, { timestamps: true });

EmergencyRequestSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });

module.exports = mongoose.model("EmergencyRequest", EmergencyRequestSchema);