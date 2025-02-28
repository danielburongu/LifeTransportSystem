const express = require("express");
const Ambulance = require("../models/Ambulance");
const EmergencyRequest = require("../models/EmergencyRequest");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

module.exports = (io) => {
  const router = express.Router();

  router.post("/create", verifyToken, verifyRole(["ambulance_driver"]), async (req, res) => {
    try {
      const existingAmbulance = await Ambulance.findOne({ driver_id: req.user.userId });
      if (existingAmbulance) {
        return res.status(400).json({ message: "Ambulance already assigned to this driver" });
      }

      const newAmbulance = new Ambulance({
        driver_id: req.user.userId,
        hospital_id: null,
        status: "available",
        current_location: { latitude: 0, longitude: 0 },
      });

      await newAmbulance.save();
      io.emit("ambulance_created", newAmbulance);
      res.status(201).json({ message: "Ambulance created successfully", ambulance: newAmbulance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/update-location", verifyToken, verifyRole(["ambulance_driver"]), async (req, res) => {
    try {
      const { latitude, longitude, status } = req.body;

      if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Valid latitude and longitude are required." });
      }

      const ambulance = await Ambulance.findOne({ driver_id: req.user.userId });
      if (!ambulance) {
        return res.status(404).json({ message: "Ambulance not found for this driver." });
      }

      ambulance.current_location.latitude = parseFloat(latitude);
      ambulance.current_location.longitude = parseFloat(longitude);
      if (status && ["available", "en route", "busy"].includes(status)) {
        ambulance.status = status;
      }
      ambulance.last_updated = Date.now();
      await ambulance.save();

      io.emit("locationUpdated", {
        ambulance_id: ambulance._id,
        driver_id: req.user.userId,
        latitude: ambulance.current_location.latitude,
        longitude: ambulance.current_location.longitude,
        status: ambulance.status,
        last_updated: ambulance.last_updated,
      });

      res.json({ message: "Ambulance updated successfully", ambulance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/location/:ambulanceId", async (req, res) => {
    try {
      const { ambulanceId } = req.params;
      const ambulance = await Ambulance.findById(ambulanceId).populate("driver_id", "username");

      if (!ambulance) {
        return res.status(404).json({ message: "Ambulance not found" });
      }

      res.json({
        ambulance_id: ambulance._id,
        driver_id: ambulance.driver_id,
        status: ambulance.status,
        latitude: ambulance.current_location.latitude,
        longitude: ambulance.current_location.longitude,
        last_updated: ambulance.last_updated,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/assign-emergency/:ambulanceId", verifyToken, verifyRole(["hospital", "admin"]), async (req, res) => {
    try {
      const { ambulanceId } = req.params;
      const { emergencyId } = req.body;

      const ambulance = await Ambulance.findById(ambulanceId);
      if (!ambulance) {
        return res.status(404).json({ message: "Ambulance not found" });
      }

      const emergency = await EmergencyRequest.findById(emergencyId);
      if (!emergency) {
        return res.status(404).json({ message: "Emergency not found" });
      }

      if (emergency.status !== "verified") {
        return res.status(400).json({ message: "Emergency must be verified before assignment" });
      }

      ambulance.assigned_emergency = emergencyId;
      ambulance.status = "en route";
      ambulance.last_updated = Date.now();
      emergency.assigned_ambulance = ambulanceId;
      emergency.status = "dispatched";
      await Promise.all([ambulance.save(), emergency.save()]);

      io.emit("ambulance_assigned", {
        ambulance_id: ambulance._id,
        driver_id: ambulance.driver_id,
        emergency: {
          _id: emergency._id,
          emergency_type: emergency.emergency_type,
          location: emergency.location,
          priority: emergency.priority,
          status: emergency.status,
          coordinates: emergency.coordinates,
          createdAt: emergency.createdAt,
          notes: emergency.notes,
        },
      });

      res.json({ message: "Emergency assigned successfully", ambulance, emergency });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/mark-completed/:ambulanceId", verifyToken, verifyRole(["ambulance_driver"]), async (req, res) => {
    try {
      const { ambulanceId } = req.params;
      const ambulance = await Ambulance.findOne({ _id: ambulanceId, driver_id: req.user.userId });

      if (!ambulance) {
        return res.status(404).json({ message: "Ambulance not found or not authorized" });
      }

      if (!ambulance.assigned_emergency) {
        return res.status(400).json({ message: "No emergency assigned to mark as completed" });
      }

      const emergency = await EmergencyRequest.findById(ambulance.assigned_emergency);
      if (!emergency) {
        return res.status(404).json({ message: "Assigned emergency not found" });
      }

      emergency.status = "completed";
      emergency.assigned_ambulance = null;
      ambulance.assigned_emergency = null;
      ambulance.status = "available";
      ambulance.last_updated = Date.now();
      await Promise.all([ambulance.save(), emergency.save()]);

      io.emit("emergency_completed", {
        ambulance_id: ambulance._id,
        driver_id: ambulance.driver_id,
        emergency_id: emergency._id,
      });

      res.json({ message: "Emergency marked as completed", ambulance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/assigned-emergency", verifyToken, verifyRole(["ambulance_driver"]), async (req, res) => {
    try {
      const ambulance = await Ambulance.findOne({ driver_id: req.user.userId }).populate("assigned_emergency");
      if (!ambulance) {
        return res.status(404).json({ message: "Ambulance not found" });
      }

      if (!ambulance.assigned_emergency) {
        return res.status(200).json([]);
      }

      res.json([ambulance.assigned_emergency]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/my-ambulance", verifyToken, verifyRole(["ambulance_driver"]), async (req, res) => {
    try {
      const ambulance = await Ambulance.findOne({ driver_id: req.user.userId });
      if (!ambulance) {
        return res.status(404).json({ message: "Ambulance not found" });
      }

      res.json(ambulance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // endpoint to fetch available ambulances (drivers)
  router.get("/available", verifyToken, verifyRole(["hospital_staff"]), async (req, res) => {
    try {
      console.log("📡 Fetching available ambulances...");
      const availableAmbulances = await Ambulance.find({ status: "available" })
        .populate("driver_id", "username email");

      console.log(`✅ Found ${availableAmbulances.length} available ambulances.`);
      res.json(availableAmbulances);
    } catch (error) {
      console.error("❌ Error fetching available ambulances:", error);
      res.status(500).json({ message: "❌ Server error. Please try again later." });
    }
  });

  return router;
};