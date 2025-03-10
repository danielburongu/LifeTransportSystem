const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "police", "hospital_staff", "ambulance_driver"],
      required: true,
    },
    location: { type: String, required: false, default: "" }, // Made optional for flexibility
    driverStatus: {
      type: String,
      enum: ["Available", "En Route", "Busy"],
      default: "Available", // Default status for ambulance drivers
      required: function () {
        return this.role === "ambulance_driver"; // Required only for drivers
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);