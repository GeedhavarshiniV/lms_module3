// Your existing function - KEEP IT
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// ✅ ADD THIS NEW FUNCTION (flexible role checking)
export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "User not authenticated",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions.",
          requiredRoles: allowedRoles,
          userRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error("ROLE MIDDLEWARE ERROR:", error);
      return res.status(500).json({
        message: "Authorization error",
        error: error.message,
      });
    }
  };
};