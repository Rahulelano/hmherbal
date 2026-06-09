import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Slider from "./models/Slider.js";

// Routes imports
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Seed function for default values (Admin, Categories, Products, Slider)
const seedDatabase = async () => {
  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments({});
    if (adminCount === 0) {
      await Admin.create({
        username: "admin",
        password: "admin123", // Pre-saved hook will hash this
      });
      console.log("Seeded default admin (admin / admin123)");
    }

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments({});
    if (categoryCount === 0) {
      const defaultCategories = [
        { slug: "raw-herbs", name: "Raw Herbs", icon: "🌿", subcategories: ["Neem", "Tulsi", "Root Herbs"] },
        { slug: "herbal-powders", name: "Herbal Powders", icon: "🥣", subcategories: ["Amla Powder", "Turmeric Powder", "Ashwagandha Powder"] },
        { slug: "unani", name: "Unani Medicine", icon: "⚗️", subcategories: ["Formulations", "Tonics"] },
        { slug: "siddha", name: "Siddha Medicine", icon: "🪔", subcategories: ["Choornam", "Lehyam"] },
        { slug: "ayurveda", name: "Ayurvedic Medicine", icon: "🍃", subcategories: ["Arishtam", "Tailam"] },
        { slug: "baby-care", name: "Baby Care", icon: "👶", subcategories: ["Massage Oil", "Baby Bath Powder"] },
        { slug: "dry-fruits", name: "Dry Fruits & Nuts", icon: "🥜", subcategories: ["Almonds", "Cashews", "Dry Fruit Mix"] },
        { slug: "seeds", name: "Seeds", icon: "🌱", subcategories: ["Chia Seeds", "Flax Seeds"] },
        { slug: "pooja", name: "Pooja Products", icon: "🪷", subcategories: ["Brass Diya", "Incense Sticks"] },
        { slug: "sirudanyam", name: "Sirudanyam", icon: "🌾", subcategories: ["Millet Mix", "Ragi Mix"] },
        { slug: "perfume-oils", name: "Perfume Essence Oil", icon: "💧", subcategories: ["Jasmine Oil", "Sandalwood Oil"] },
        { slug: "general", name: "General Products", icon: "🛒", subcategories: ["General Health", "Soaps"] },
        { slug: "chemicals", name: "Chemicals", icon: "🧪", subcategories: ["Laboratory", "General Oils"] },
        { slug: "organic", name: "Organic Products", icon: "♻️", subcategories: ["Organic Ghee", "Honey"] },
      ];
      await Category.insertMany(defaultCategories);
      console.log("Seeded default categories");
    }

    // 3. Seed Products
    const productCount = await Product.countDocuments({});
    if (productCount === 0) {
      const defaultProducts = [
        {
          name: "Ashwagandha Root Powder",
          slug: "ashwagandha-root-powder",
          tamil: "அமுக்கிரா",
          category: "herbal-powders",
          subcategory: "Ashwagandha Powder",
          price: 299,
          mrp: 399,
          image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400",
          rating: 4.8,
          reviews: 412,
          organic: true,
          bestseller: true,
          description: "Pure ashwagandha root powder, stone-ground in small batches. Supports vitality, stamina and restful sleep."
        },
        {
          name: "Cold Pressed Herbal Oil",
          slug: "cold-pressed-herbal-oil",
          category: "perfume-oils",
          subcategory: "Jasmine Oil",
          price: 549,
          mrp: 699,
          image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400",
          rating: 4.9,
          reviews: 287,
          trending: true,
          description: "Slow cold-pressed in amber glass. A nourishing blend of 7 traditional herbs."
        },
        {
          name: "Organic Turmeric Powder",
          slug: "organic-turmeric-powder",
          tamil: "மஞ்சள்",
          category: "herbal-powders",
          subcategory: "Turmeric Powder",
          price: 149,
          mrp: 199,
          image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400",
          rating: 4.7,
          reviews: 920,
          organic: true,
          bestseller: true,
          description: "High-curcumin Salem turmeric, sun-dried and stone-milled the traditional way."
        },
        {
          name: "Premium Dry Fruits Mix",
          slug: "premium-dry-fruits-mix",
          category: "dry-fruits",
          subcategory: "Dry Fruit Mix",
          price: 849,
          mrp: 999,
          image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=400",
          rating: 4.6,
          reviews: 156,
          trending: true,
          description: "Hand-picked almonds, cashews, pistachios and raisins. Resealable jar."
        },
        {
          name: "Neem Leaf Powder",
          slug: "neem-leaf-powder",
          tamil: "வேம்பு",
          category: "raw-herbs",
          subcategory: "Neem",
          price: 199,
          mrp: 249,
          image: "https://images.unsplash.com/photo-1563483783225-fd53262b6628?auto=format&fit=crop&q=80&w=400",
          rating: 4.8,
          reviews: 534,
          organic: true,
          description: "Bitter, cooling and purifying. Daily wellness from the village neem tree."
        },
        {
          name: "Brass Pooja Essentials",
          slug: "brass-pooja-set",
          category: "pooja",
          subcategory: "Brass Diya",
          price: 1299,
          mrp: 1599,
          image: "https://images.unsplash.com/photo-1609137144813-9a74c207b51b?auto=format&fit=crop&q=80&w=400",
          rating: 4.9,
          reviews: 88,
          description: "Handcrafted brass diya, kumkum holder and incense stand."
        },
        {
          name: "Sirudanyam Millet Mix",
          slug: "sirudanyam-millet-mix",
          tamil: "சிறுதானியம்",
          category: "sirudanyam",
          subcategory: "Millet Mix",
          price: 399,
          mrp: 499,
          image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=400",
          rating: 4.7,
          reviews: 220,
          organic: true,
          bestseller: true,
          description: "Six traditional millets — foxtail, kodo, little, barnyard, browntop and pearl."
        },
        {
          name: "Siddha Immunity Booster",
          slug: "siddha-immunity-booster",
          category: "siddha",
          subcategory: "Choornam",
          price: 449,
          mrp: 599,
          image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400",
          rating: 4.6,
          reviews: 174,
          trending: true,
          description: "Classical Siddha formulation prepared in Thirupathur — daily immunity support."
        }
      ];
      const defaultProductsWithImages = defaultProducts.map((p) => ({
        ...p,
        images: [p.image],
      }));
      await Product.insertMany(defaultProductsWithImages);
      console.log("Seeded default products");
    }

    // 4. Seed Slider settings
    const sliderCount = await Slider.countDocuments({});
    if (sliderCount === 0) {
      await Slider.create({
        slides: [
          {
            imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
            title: "Traditional Herbal Wellness",
            subtitle: "Stone-ground herbal powders and traditional Siddha medicines from Thirupathur.",
            link: "/shop",
            active: true
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
            title: "100% Organic Products",
            subtitle: "Purity guaranteed directly from certified local farms.",
            link: "/shop",
            active: true
          }
        ]
      });
      console.log("Seeded default hero slides");
    }
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
};

// Seed database on startup
seedDatabase();

// API Routes mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// Static uploads route
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve built frontend assets in production
const distPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // SPA fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // Development greeting
  app.get("/", (req, res) => {
    res.send("API Server is running in development mode...");
  });
}

const PORT = process.env.PORT || 7610;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
