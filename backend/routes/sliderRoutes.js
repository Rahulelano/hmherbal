import express from "express";
import Slider from "../models/Slider.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get active slides
// @route   GET /api/sliders
// @access  Public
router.get("/", async (req, res) => {
  try {
    let slider = await Slider.findOne({});
    
    // Seed default slides if none exist
    if (!slider) {
      slider = new Slider({
        slides: [
          {
            imageUrl: "/assets/hero-herbs.jpg",
            title: "Traditional Herbal Wellness for Modern Life",
            subtitle: "Trusted Siddha, Ayurveda and organic products — sourced, stone-ground and packed with care in Thirupathur, Tamil Nadu.",
            link: "/shop",
            active: true
          }
        ]
      });
      await slider.save();
    }
    
    // Filter active slides for public response
    const activeSlides = slider.slides.filter(slide => slide.active);
    res.json(activeSlides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all slides (for admin)
// @route   GET /api/sliders/admin
// @access  Private (Admin)
router.get("/admin", protectAdmin, async (req, res) => {
  try {
    let slider = await Slider.findOne({});
    if (!slider) {
      slider = new Slider({ slides: [] });
      await slider.save();
    }
    res.json(slider.slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update slider settings
// @route   PUT /api/sliders
// @access  Private (Admin)
router.put("/", protectAdmin, async (req, res) => {
  const { slides } = req.body;

  try {
    let slider = await Slider.findOne({});
    if (!slider) {
      slider = new Slider({ slides });
    } else {
      slider.slides = slides;
    }

    const updatedSlider = await slider.save();
    res.json(updatedSlider.slides);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
