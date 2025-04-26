import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userSchema.js";
dotenv.config();

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization required - please login"
      });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || "");
    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found"
      });
    }
    req.user = user;
    next();

  } catch (error) {
    console.error("Authentication middleware error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Session expired - please login again"
      });
    }
    return res.status(500).json({
      success: false,
      message: "Authentication server error"
    });
  }
};

export default authenticateUser;