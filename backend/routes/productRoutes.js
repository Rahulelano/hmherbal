import express from "express";
import Product from "../models/Product.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper to generate a slug from a name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin)
router.post("/", protectAdmin, async (req, res) => {
  const {
    name,
    tamil,
    category,
    subcategory,
    price,
    mrp,
    image,
    images,
    rating,
    reviews,
    organic,
    trending,
    bestseller,
    description,
    stock,
  } = req.body;

  try {
    const slug = slugify(name);
    
    // Check if slug exists
    const slugExists = await Product.findOne({ slug });
    let finalSlug = slug;
    if (slugExists) {
      finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const mainImage = image || (images && images.length > 0 ? images[0] : "");
    const imagesArray = images && images.length > 0 ? images : (mainImage ? [mainImage] : []);

    const product = new Product({
      name,
      slug: finalSlug,
      tamil,
      category,
      subcategory,
      price: Number(price),
      mrp: Number(mrp),
      image: mainImage,
      images: imagesArray,
      rating: Number(rating || 5),
      reviews: Number(reviews || 0),
      organic: Boolean(organic),
      trending: Boolean(trending),
      bestseller: Boolean(bestseller),
      description,
      stock: Number(stock || 99),
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
router.put("/:id", protectAdmin, async (req, res) => {
  const {
    name,
    tamil,
    category,
    subcategory,
    price,
    mrp,
    image,
    images,
    rating,
    reviews,
    organic,
    trending,
    bestseller,
    description,
    stock,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.tamil = tamil !== undefined ? tamil : product.tamil;
      product.category = category || product.category;
      product.subcategory = subcategory !== undefined ? subcategory : product.subcategory;
      product.price = price !== undefined ? Number(price) : product.price;
      product.mrp = mrp !== undefined ? Number(mrp) : product.mrp;
      product.rating = rating !== undefined ? Number(rating) : product.rating;
      product.reviews = reviews !== undefined ? Number(reviews) : product.reviews;
      product.organic = organic !== undefined ? Boolean(organic) : product.organic;
      product.trending = trending !== undefined ? Boolean(trending) : product.trending;
      product.bestseller = bestseller !== undefined ? Boolean(bestseller) : product.bestseller;
      product.description = description || product.description;
      product.stock = stock !== undefined ? Number(stock) : product.stock;

      // Update images
      if (images !== undefined) {
        product.images = images;
        // Automatically update the main thumbnail string to the first array entry if the array contains items
        if (images.length > 0) {
          product.image = images[0];
        }
      } else if (image !== undefined) {
        product.image = image;
        // If images array is empty, populate it with the main image
        if (!product.images || product.images.length === 0) {
          product.images = [image];
        } else {
          // Replace first index with updated main image
          product.images[0] = image;
        }
      }

      if (name && name !== product.name) {
        product.slug = slugify(name);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
