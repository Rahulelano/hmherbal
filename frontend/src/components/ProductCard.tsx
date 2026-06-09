import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(product.id));
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-saffron text-white text-[11px] font-semibold px-2 py-1 rounded-full">−{discount}%</span>
          )}
          {product.organic && (
            <span className="bg-primary text-primary-foreground text-[11px] font-semibold px-2 py-1 rounded-full">Organic</span>
          )}
        </div>
        <button
          onClick={() => { toggleWish(product.id); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
          aria-label="Wishlist"
          className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-card transition"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-destructive text-destructive" : ""}`} />
        </button>
        <button
          onClick={() => { add(product); toast.success(`${product.name} added to cart`); }}
          className="absolute bottom-3 left-3 right-3 h-10 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
        >
          <ShoppingBag className="h-4 w-4" /> Quick Add
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Star className="h-3 w-3 fill-saffron text-saffron" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
          <h3 className="font-medium text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
          {product.tamil && <p className="text-xs text-muted-foreground mt-0.5">{product.tamil}</p>}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg text-primary">₹{product.price}</span>
          <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
        </div>
      </div>
    </motion.div>
  );
}
