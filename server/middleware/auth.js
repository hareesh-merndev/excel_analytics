import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hareesh9486"; // Prefer env for security

// ✅ Middleware to verify token
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No valid token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Attaching user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ✅ Middleware to verify admin access
export function verifyAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
}
