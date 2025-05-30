// server/middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = "hareesh9486"; // Your JWT secret

// Middleware to verify if the token is valid
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
}

// Middleware to check if the user is an admin
export function verifyAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
}
