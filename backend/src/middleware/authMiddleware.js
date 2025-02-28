const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "❌ Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "⚠ Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "❌ Invalid token." });
  }
};

// Middleware to check if the user has the required role
exports.verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "❌ Access denied. User role not found." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `🚫 Access denied. Required roles: ${roles.join(", ")}` });
    }

    next();
  };
};
