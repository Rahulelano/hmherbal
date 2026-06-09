import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "🌿" }, // Emoji or symbol
    subcategories: [{ type: String }],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
