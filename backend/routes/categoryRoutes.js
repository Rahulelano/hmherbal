import express from "express";
import Category from "../models/Category.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper to generate a slug from a name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin)
router.post("/", protectAdmin, async (req, res) => {
  const { name, icon, subcategories } = req.body;

  try {
    const slug = slugify(name);

    // Check if category already exists
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      slug,
      icon: icon || "🌿",
      subcategories: subcategories || [],
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
router.put("/:id", protectAdmin, async (req, res) => {
  const { name, icon, subcategories } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      if (name) {
        category.slug = slugify(name);
      }
      category.icon = icon || category.icon;
      category.subcategories = subcategories !== undefined ? subcategories : category.subcategories;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category removed" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
