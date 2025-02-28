const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["patient", "police", "hospital_staff", "ambulance_driver"], 
    required: true 
  },
  location: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
