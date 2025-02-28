const express = require("express");
const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/emergency/request
 * @desc    Create an emergency transport request (Only Patients)
 * @access  Private (Only Patients)
 */
router.post("/request", verifyToken, verifyRole(["patient"]), async (req, res) => {
  try {
    const {
      location,
      emergency_type,
      latitude,
      longitude,
      plus_code,
      victim_name,
      victim_age,
      victim_sex,
      incident_description,
      police_case_no,
    } = req.body;

    if (!location || !emergency_type || !victim_name || !incident_description) {
      return res.status(400).json({
        message: "❌ Location, emergency type, victim's name, and incident description are required.",
      });
    }

    const newRequest = new EmergencyRequest({
      user_id: req.user.userId,
      location,
      emergency_type,
      coordinates: {
        latitude: latitude || 0,
        longitude: longitude || 0,
      },
      plus_code: plus_code || "",
      victim_name,
      victim_age: victim_age || "",
      victim_sex: victim_sex || "",
      incident_description,
      police_case_no: police_case_no || "",
      status: "pending",
      police_verification: false,
    });

    await newRequest.save();

    const io = req.app.get("io");
    if (io) {
      console.log("📡 Broadcasting new accident report for police verification...");
      io.emit("new_accident_report", newRequest);
      io.emit(`patient_update_${req.user.userId}`, newRequest);
    }

    res.status(201).json({ message: "✅ Emergency request submitted successfully!", request: newRequest });
  } catch (error) {
    console.error("❌ Error processing emergency request:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   GET /api/emergency/pending-accidents
 * @desc    Get all pending accident reports for police verification
 * @access  Private (Only Police)
 */
router.get("/pending-accidents", verifyToken, verifyRole(["police"]), async (req, res) => {
  try {
    console.log("📡 Fetching pending accident reports...");

    const pendingRequests = await EmergencyRequest.find({
      status: "pending",
      police_verification: false,
    }).sort({ createdAt: -1 });

    if (!pendingRequests.length) {
      return res.status(404).json({ message: "⚠ No pending accident cases found." });
    }

    console.log(`✅ Found ${pendingRequests.length} pending accident reports.`);
    res.json(pendingRequests);
  } catch (error) {
    console.error("❌ Error fetching pending accidents:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   GET /api/emergency/my-requests
 * @desc    Get all emergency requests made by the logged-in patient
 * @access  Private (Only Patients)
 */
router.get("/my-requests", verifyToken, verifyRole(["patient"]), async (req, res) => {
  try {
    console.log(`📡 Fetching requests for patient: ${req.user.userId}`);
    const userRequests = await EmergencyRequest.find({ user_id: req.user.userId }).sort({ createdAt: -1 });

    res.json(userRequests);
  } catch (error) {
    console.error("❌ Error fetching user emergency requests:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   PUT /api/emergency/verify/:requestId
 * @desc    Police verify an emergency request
 * @access  Private (Only Police)
 */
router.put("/verify/:requestId", verifyToken, verifyRole(["police"]), async (req, res) => {
  try {
    const { requestId } = req.params;
    const emergency = await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({ message: "❌ Emergency request not found." });
    }

    emergency.police_verification = true;
    emergency.status = "verified";
    await emergency.save();

    const io = req.app.get("io");
    if (io) {
      console.log(`📡 Accident verified: ${requestId}`);
      io.emit("accident_verified", emergency);
      io.emit("new_verified_emergency", emergency);
      io.emit(`patient_update_${emergency.user_id}`, emergency);
    }

    res.json({ message: "✅ Emergency request verified by police.", emergency });
  } catch (error) {
    console.error("❌ Error verifying emergency request:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   GET /api/emergency/verified
 * @desc    Fetch all verified emergency requests (For Hospitals)
 * @access  Private (Only Hospital Staff)
 */
router.get("/verified", verifyToken, verifyRole(["hospital_staff"]), async (req, res) => {
  try {
    console.log("📡 Fetching verified emergencies for hospital staff...");

    const verifiedEmergencies = await EmergencyRequest.find({ status: "verified" }).sort({ createdAt: -1 });

    if (!verifiedEmergencies.length) {
      return res.status(404).json({ message: "⚠ No verified emergencies at the moment." });
    }

    res.json(verifiedEmergencies);
  } catch (error) {
    console.error("❌ Error fetching verified emergencies:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   GET /api/emergency/assigned
 * @desc    Get all dispatched emergencies assigned to the logged-in ambulance driver
 * @access  Private (Only Ambulance Drivers)
 */
router.get("/assigned", verifyToken, verifyRole(["ambulance_driver"]), async (req, res) => {
  try {
    console.log(`📡 Fetching dispatched emergencies for driver: ${req.user.userId}`);

    const assignedEmergencies = await EmergencyRequest.find({
      status: "dispatched",
      assigned_ambulance: req.user.userId,
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${assignedEmergencies.length} dispatched emergencies for this driver.`);

    if (!assignedEmergencies.length) {
      return res.status(404).json({ message: "⚠ No dispatched emergencies assigned to you at the moment." });
    }

    res.json(assignedEmergencies);
  } catch (error) {
    console.error("❌ Error fetching assigned emergencies:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   PUT /api/emergency/dispatch/:requestId
 * @desc    Dispatch an emergency request to an ambulance driver
 * @access  Private (Only Hospital Staff)
 */
router.put("/dispatch/:requestId", verifyToken, verifyRole(["hospital_staff"]), async (req, res) => {
  try {
    const { requestId } = req.params;
    const { ambulanceId } = req.body;

    if (!ambulanceId) {
      return res.status(400).json({ message: "❌ Ambulance ID is required." });
    }

    const driver = await User.findById(ambulanceId);
    if (!driver || !driver.role.includes("ambulance_driver")) {
      return res.status(400).json({ message: "❌ Invalid ambulance driver ID." });
    }

    const emergency = await EmergencyRequest.findById(requestId);
    if (!emergency) {
      return res.status(404).json({ message: "❌ Emergency request not found." });
    }

    if (emergency.status !== "verified") {
      return res.status(400).json({ message: "❌ Only verified emergencies can be dispatched." });
    }

    if (emergency.assigned_ambulance) {
      return res.status(400).json({ message: "❌ This emergency is already assigned to another ambulance." });
    }

    emergency.status = "dispatched";
    emergency.assigned_ambulance = ambulanceId;
    await emergency.save();

    const io = req.app.get("io");
    if (io) {
      console.log(`📡 Ambulance dispatched: ${requestId}`);
      io.emit("ambulance_dispatched", { requestId, ambulanceId });
      io.emit(`patient_update_${emergency.user_id}`, emergency);
    }

    res.json({ message: "🚑 Ambulance dispatched successfully!", emergency });
  } catch (error) {
    console.error("❌ Error dispatching ambulance:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   PUT /api/emergency/mark-completed/:requestId
 * @desc    Ambulance driver marks an emergency request as completed
 * @access  Private (Only Ambulance Drivers)
 */
router.put("/mark-completed/:requestId", verifyToken, verifyRole(["ambulance_driver"]), async (req, res) => {
  try {
    const { requestId } = req.params;
    const emergency = await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({ message: "❌ Emergency request not found." });
    }

    if (emergency.status !== "dispatched") {
      return res.status(400).json({ message: "❌ Only dispatched emergencies can be marked as completed by the driver." });
    }

    if (emergency.assigned_ambulance.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "❌ You are not authorized to mark this emergency as completed." });
    }

    emergency.status = "completed";
    await emergency.save();

    const io = req.app.get("io");
    if (io) {
      console.log(`📡 Emergency marked as completed by driver: ${requestId}`);
      io.emit("patient_arrived", emergency);
      io.emit(`patient_update_${emergency.user_id}`, emergency);
    }

    res.json({ message: "✅ Emergency marked as completed by driver.", emergency });
  } catch (error) {
    console.error("❌ Error marking emergency as completed:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   PUT /api/emergency/confirm-arrival/:requestId
 * @desc    Hospital confirms patient arrival
 * @access  Private (Only Hospital Staff)
 */
router.put("/confirm-arrival/:requestId", verifyToken, verifyRole(["hospital_staff"]), async (req, res) => {
  try {
    const { requestId } = req.params;
    const emergency = await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({ message: "❌ Emergency request not found." });
    }

    emergency.status = "completed";
    await emergency.save();

    const io = req.app.get("io");
    if (io) {
      console.log(`📡 Patient arrived: ${requestId}`);
      io.emit("patient_arrived", emergency);
      io.emit(`patient_update_${emergency.user_id}`, emergency);
    }

    res.json({ message: "🏥 Patient arrival confirmed by hospital.", emergency });
  } catch (error) {
    console.error("❌ Error confirming patient arrival:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

module.exports = router;