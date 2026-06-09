import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { apiFetchProduct, apiFetchProducts } from "@/lib/api";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const title = `${params.slug.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())} | H.M Herbal World`;
    return {
      meta: [
        { title },
        { name: "description", content: "Authentic traditional herbal product prepared at our Thirupathur workshop." },
        { property: "og:title", content: title },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<string | null>(null);
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => apiFetchProduct(slug),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: apiFetchProducts,
  });

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  const wished = useCart((s) => product ? s.wishlist.includes(product._id || product.id) : false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground mt-4">Gathering herbal details...</span>
      </div>
    );
  }

  if (isError || !product) {
    throw notFound();
  }

  const related = products.filter((p) => p._id !== product._id && p.category === product.category).slice(0, 4);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const checkCod = () => {
    if (pin.length === 6) setPinResult(`✓ COD available at ${pin}. Delivery in 3–5 days.`);
    else setPinResult("Please enter a valid 6-digit PIN.");
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link> <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted group">
            <img src={activeImage || product.image} alt={product.name} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" />
            {product.organic && (
              <span className="absolute top-5 left-5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full z-10">Organic</span>
            )}
          </div>
          
          {/* Gallery Thumbnails */}
          {(() => {
            const imagesArray = product.images && product.images.length > 0 ? product.images : [product.image];
            if (imagesArray.length <= 1) return null;
            return (
              <div className="flex flex-wrap gap-3 mt-4">
                {imagesArray.map((imgUrl, index) => {
                  const isActive = (activeImage || product.image) === imgUrl;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 bg-muted transition-all duration-300 ${
                        isActive
                          ? "border-primary scale-95 shadow-md"
                          : "border-border hover:border-primary/40 hover:scale-102"
                      }`}
                    >
                      <img src={imgUrl} alt={`${product.name} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">{product.category.replace("-", " ")}</div>
          <h1 className="mt-2 font-display text-3xl md:text-5xl leading-tight">{product.name}</h1>
          {product.tamil && <p className="text-muted-foreground italic mt-1">{product.tamil}</p>}

          <div className="mt-4 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-saffron text-saffron" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">· {product.reviews} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl text-primary">₹{product.price}</span>
            <span className="text-lg text-muted-foreground line-through">₹{product.mrp}</span>
            {discount > 0 && <span className="bg-saffron/15 text-saffron text-sm font-semibold px-2.5 py-1 rounded-full">{discount}% OFF</span>}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center bg-muted rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-11 w-11 flex items-center justify-center hover:text-primary"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-11 w-11 flex items-center justify-center hover:text-primary"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={() => { add(product, qty); toast.success(`Added ${qty} × ${product.name}`); }} className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 shadow-glow hover:scale-[1.02] transition-transform">
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
            <button onClick={() => toggleWish(product._id || product.id)} aria-label="Wishlist" className="h-12 w-12 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition">
              <Heart className={`h-5 w-5 ${wished ? "fill-destructive text-destructive" : ""}`} />
            </button>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-muted/60">
            <div className="text-sm font-medium mb-2">Check delivery & COD availability</div>
            <div className="flex gap-2">
              <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN code" maxLength={6} className="flex-1 h-11 px-4 rounded-full bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={checkCod} className="px-5 h-11 rounded-full bg-primary text-primary-foreground text-sm font-medium">Check</button>
            </div>
            {pinResult && <div className="text-xs mt-2 text-primary">{pinResult}</div>}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
            {[{Icon:Truck,t:"Free shipping"},{Icon:ShieldCheck,t:"100% authentic"},{Icon:RotateCcw,t:"7-day returns"}].map(({Icon,t})=>(
              <div key={t} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
                <Icon className="h-4 w-4 text-primary" /><span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
