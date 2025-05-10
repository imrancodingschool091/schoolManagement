import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
  try {
    // Get token from the Authorization header (e.g., Bearer <token>)
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token

    if (!token) return res.status(401).json({ error: "Access Denied, No Token" });

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    
    next(); // Continue to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
};
