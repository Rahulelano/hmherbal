import oil from "@/assets/product-oil.jpg";
import turmeric from "@/assets/product-turmeric.jpg";
import ashwagandha from "@/assets/product-ashwagandha.jpg";
import dryfruits from "@/assets/product-dryfruits.jpg";
import neem from "@/assets/product-neem.jpg";
import pooja from "@/assets/product-pooja.jpg";
import millets from "@/assets/product-millets.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tamil?: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  rating: number;
  reviews: number;
  organic?: boolean;
  trending?: boolean;
  bestseller?: boolean;
  description: string;
};

export const categories = [
  { slug: "raw-herbs", name: "Raw Herbs", icon: "🌿" },
  { slug: "herbal-powders", name: "Herbal Powders", icon: "🥣" },
  { slug: "unani", name: "Unani Medicine", icon: "⚗️" },
  { slug: "siddha", name: "Siddha Medicine", icon: "🪔" },
  { slug: "ayurveda", name: "Ayurvedic Medicine", icon: "🍃" },
  { slug: "baby-care", name: "Baby Care", icon: "👶" },
  { slug: "dry-fruits", name: "Dry Fruits & Nuts", icon: "🥜" },
  { slug: "seeds", name: "Seeds", icon: "🌱" },
  { slug: "pooja", name: "Pooja Products", icon: "🪷" },
  { slug: "sirudanyam", name: "Sirudanyam", icon: "🌾" },
  { slug: "perfume-oils", name: "Perfume Essence Oil", icon: "💧" },
  { slug: "general", name: "General Products", icon: "🛒" },
  { slug: "chemicals", name: "Chemicals", icon: "🧪" },
  { slug: "organic", name: "Organic Products", icon: "♻️" },
];

export const products: Product[] = [
  { id: "1", slug: "ashwagandha-root-powder", name: "Ashwagandha Root Powder", tamil: "அமுக்கிரா", category: "herbal-powders", price: 299, mrp: 399, image: ashwagandha, rating: 4.8, reviews: 412, organic: true, bestseller: true, description: "Pure ashwagandha root powder, stone-ground in small batches. Supports vitality, stamina and restful sleep." },
  { id: "2", slug: "cold-pressed-herbal-oil", name: "Cold Pressed Herbal Oil", category: "perfume-oils", price: 549, mrp: 699, image: oil, rating: 4.9, reviews: 287, trending: true, description: "Slow cold-pressed in amber glass. A nourishing blend of 7 traditional herbs." },
  { id: "3", slug: "organic-turmeric-powder", name: "Organic Turmeric Powder", tamil: "மஞ்சள்", category: "herbal-powders", price: 149, mrp: 199, image: turmeric, rating: 4.7, reviews: 920, organic: true, bestseller: true, description: "High-curcumin Salem turmeric, sun-dried and stone-milled the traditional way." },
  { id: "4", slug: "premium-dry-fruits-mix", name: "Premium Dry Fruits Mix", category: "dry-fruits", price: 849, mrp: 999, image: dryfruits, rating: 4.6, reviews: 156, trending: true, description: "Hand-picked almonds, cashews, pistachios and raisins. Resealable jar." },
  { id: "5", slug: "neem-leaf-powder", name: "Neem Leaf Powder", tamil: "வேம்பு", category: "raw-herbs", price: 199, mrp: 249, image: neem, rating: 4.8, reviews: 534, organic: true, description: "Bitter, cooling and purifying. Daily wellness from the village neem tree." },
  { id: "6", slug: "brass-pooja-set", name: "Brass Pooja Essentials", category: "pooja", price: 1299, mrp: 1599, image: pooja, rating: 4.9, reviews: 88, description: "Handcrafted brass diya, kumkum holder and incense stand." },
  { id: "7", slug: "sirudanyam-millet-mix", name: "Sirudanyam Millet Mix", tamil: "சிறுதானியம்", category: "sirudanyam", price: 399, mrp: 499, image: millets, rating: 4.7, reviews: 220, organic: true, bestseller: true, description: "Six traditional millets — foxtail, kodo, little, barnyard, browntop and pearl." },
  { id: "8", slug: "siddha-immunity-booster", name: "Siddha Immunity Booster", category: "siddha", price: 449, mrp: 599, image: ashwagandha, rating: 4.6, reviews: 174, trending: true, description: "Classical Siddha formulation prepared in Thirupathur — daily immunity support." },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (slug: string) => products.filter((p) => p.category === slug);
