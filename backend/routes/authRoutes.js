import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get admin profile (verify token)
// @route   GET /api/auth/profile
// @access  Private (Admin)
router.get("/profile", protectAdmin, async (req, res) => {
  res.json(req.admin);
});

export default router;
