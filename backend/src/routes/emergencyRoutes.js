const express = require("express");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to an 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
  },
});

// Ensure the uploads directory exists (optional here; better in server.js)
const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 * @route   POST /api/emergency/guest-request
 * @desc    Create an emergency transport request for guests (unauthenticated)
 * @access  Public
 */
router.post("/guest-request", upload.single("image"), async (req, res) => {
  try {
    const { latitude, longitude, emergency_type } = req.body;

    // Basic validation for required fields
    if (!latitude || !longitude || !emergency_type) {
      return res.status(400).json({
        message: "❌ Latitude, longitude, and emergency type are required.",
      });
    }

    // Validate emergency_type
    const validEmergencyTypes = ["accident", "burns", "pregnancy", "injury", "medical", "unspecified"];
    if (!validEmergencyTypes.includes(emergency_type)) {
      return res.status(400).json({
        message: "❌ Invalid emergency type. Must be one of: " + validEmergencyTypes.join(", "),
      });
    }

    // Reverse geocode the coordinates to get a human-readable address
    let location = "Unknown (Guest Request)";
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      if (response.data && response.data.display_name) {
        location = response.data.display_name;
      }
    } catch (geocodeError) {
      console.error("❌ Error reverse geocoding location:", geocodeError.message);
      // Fallback to placeholder if geocoding fails
    }

    const newRequest = new EmergencyRequest({
      user_id: null, // No user ID for guest requests
      location, // Use the geocoded address
      emergency_type,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      plus_code: "", // Optional for guests
      victim_name: "Unknown (Guest)", // Placeholder
      victim_age: "",
      victim_sex: "",
      incident_description: "Guest-initiated emergency request via QR code.",
      police_case_no: "",
      status: "pending",
      police_verification: false,
      image: req.file ? `/uploads/${req.file.filename}` : "", // Store image path if uploaded
    });

    await newRequest.save();

    const io = req.app.get("io");
    if (io) {
      console.log("📡 Broadcasting new guest accident report for police verification...");
      io.emit("new_accident_report", newRequest);
    }

    res.status(201).json({ message: "✅ Emergency request submitted successfully!", request: newRequest });
  } catch (error) {
    console.error("❌ Error processing guest emergency request:", error);
    res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
});

/**
 * @route   GET /api/emergency/guest-request
 * @desc    Serve a mobile-friendly page for guest emergency requests
 * @access  Public
 */
router.get("/guest-request", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Emergency Request</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5; }
        h1 { color: #00695C; }
        p { color: #666; }
        button { background-color: #D32F2F; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin: 10px; }
        button:hover { background-color: #C62828; }
        .error { color: red; }
        .success { color: green; }
        #status { margin-top: 20px; }
        input[type="file"] { margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>Request Emergency Help</h1>
      <p>Click the button below to send an emergency request with your location.</p>
      <input type="file" id="imageInput" accept="image/*" />
      <button id="requestButton" onclick="sendEmergencyRequest()">Send Emergency Request</button>
      <p id="status"></p>
      <script>
        function sendEmergencyRequest() {
          const status = document.getElementById("status");
          const requestButton = document.getElementById("requestButton");
          const imageInput = document.getElementById("imageInput");
          status.textContent = "Requesting location...";
          status.className = "";
          requestButton.disabled = true;

          if (!navigator.geolocation) {
            status.textContent = "❌ Geolocation is not supported by your browser.";
            status.className = "error";
            requestButton.disabled = false;
            return;
          }

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const formData = new FormData();
              formData.append("latitude", latitude);
              formData.append("longitude", longitude);
              formData.append("emergency_type", "unspecified");
              if (imageInput.files[0]) {
                formData.append("image", imageInput.files[0]);
              }

              try {
                const response = await fetch(window.location.href, {
                  method: "POST",
                  body: formData,
                });
                const result = await response.json();
                if (response.ok) {
                  status.textContent = "✅ " + result.message;
                  status.className = "success";
                  requestButton.textContent = "Send Another Request";
                  requestButton.disabled = false;
                  imageInput.value = ""; // Clear the file input
                } else {
                  status.textContent = "❌ " + (result.message || "Failed to process request.");
                  status.className = "error";
                  requestButton.disabled = false;
                }
              } catch (err) {
                status.textContent = "❌ Network error. Please try again.";
                status.className = "error";
                requestButton.disabled = false;
              }
            },
            (error) => {
              let message = "❌ Unable to get your location.";
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  message = "❌ Location access denied. Please allow permissions in your browser settings, then try again.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  message = "❌ Location information unavailable.";
                  break;
                case error.TIMEOUT:
                  message = "❌ Location request timed out.";
                  break;
              }
              status.textContent = message;
              status.className = "error";
              requestButton.disabled = false;
            },
            { timeout: 10000, maximumAge: 0 }
          );
        }
      </script>
    </body>
    </html>
  `);
});

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

    const { emergency_type, date, status, priority } = req.query;

    const query = { status: "pending", police_verification: false }; // Default to pending reports

    // Filter by emergency type
    if (emergency_type) query.emergency_type = emergency_type;

    // Filter by status (if provided, overrides the default "pending")
    if (status) {
      query.status = status;
      // If status is not "pending", we should not enforce police_verification: false
      if (status !== "pending") delete query.police_verification;
    }

    // Filter by date (e.g., reports on or after the specified date)
    if (date) query.createdAt = { $gte: new Date(date) };

    // Filter by priority
    if (priority) query.priority = priority;

    const pendingRequests = await EmergencyRequest.find(query)
      .populate("verified_by", "name") // Populate with officer's name instead of username
      .sort({ createdAt: -1 });

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
    emergency.verified_by = req.user.userId; // Set the verifying officer
    await emergency.save();

    const io = req.app.get("io");
    if (io) {
      console.log(`📡 Accident verified: ${requestId} by officer ${req.user.userId}`);
      io.emit("accident_verified", { requestId });
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
 * @route   PUT /api/emergency/add-note/:reportId
 * @desc    Add or update notes for an emergency report
 * @access  Private (Only Police)
 */
router.put("/add-note/:reportId", verifyToken, verifyRole(["police"]), async (req, res) => {
  try {
    const { reportId } = req.params;
    const { note } = req.body;

    const report = await EmergencyRequest.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "❌ Report not found." });
    }

    report.notes = note;
    await report.save();

    res.status(200).json({ message: "✅ Note added successfully!", report });
  } catch (error) {
    console.error("❌ Error adding note:", error);
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