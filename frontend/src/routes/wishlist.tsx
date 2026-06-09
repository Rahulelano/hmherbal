import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist | H.M Herbal World" }] }),
  component: WishPage,
});

function WishPage() {
  const wishlist = useCart((s) => s.wishlist);
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl md:text-5xl mb-8">Your Wishlist</h1>
      {list.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-4">No favourites yet.</p>
          <Link to="/shop" className="mt-6 inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground">Discover products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
