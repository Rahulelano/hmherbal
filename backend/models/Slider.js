import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  link: { type: String, default: "/shop" },
  active: { type: Boolean, default: true },
});

const sliderSchema = new mongoose.Schema(
  {
    slides: [slideSchema],
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;
