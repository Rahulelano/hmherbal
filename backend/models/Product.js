import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tamil: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    image: { type: String, required: true }, // Local path or web URL
    images: [{ type: String }],             // Array of all images (gallery)
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
    organic: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    description: { type: String, required: true },
    stock: { type: Number, default: 99 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
