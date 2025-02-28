const mongoose = require("mongoose");

const AmbulanceSchema = new mongoose.Schema({
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["available", "en route", "busy"], default: "available" },
  current_location: {
    latitude: { type: Number, required: true, default: 0 },
    longitude: { type: Number, required: true, default: 0 },
  },
  assigned_emergency: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "EmergencyRequest", 
    default: null 
  },
  last_updated: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

AmbulanceSchema.index({ "current_location.latitude": 1, "current_location.longitude": 1 });

module.exports = mongoose.model("Ambulance", AmbulanceSchema);