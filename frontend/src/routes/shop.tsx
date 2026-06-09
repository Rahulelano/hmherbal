import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetchCategories, apiFetchProducts } from "@/lib/api";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Herbal Products | H.M Herbal World" },
      { name: "description", content: "Browse our full range of herbal, ayurvedic and organic products." },
      { property: "og:title", content: "Shop — H.M Herbal World" },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

function Shop() {
  const [cat, setCat] = useState<string | null>(null);
  const [sort, setSort] = useState("featured");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: apiFetchCategories,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: apiFetchProducts,
  });

  let list = cat ? products.filter((p) => p.category === cat) : products;
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold">Shop</div>
        <h1 className="font-display text-4xl md:text-5xl mt-2">All Products</h1>
        <p className="text-muted-foreground mt-2">{list.length} authentic herbal products</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-2">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Categories
          </div>
          <button onClick={() => setCat(null)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${!cat ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
            All Products
          </button>
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setCat(c.slug)} className={`flex items-center w-full text-left px-3 py-2 rounded-lg text-sm transition ${cat === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              {c.icon && (c.icon.startsWith("/") || c.icon.startsWith("http")) ? (
                <img src={c.icon} alt="" className="h-5 w-5 rounded-full object-cover mr-2 shrink-0" />
              ) : (
                <span className="mr-2 text-base leading-none">{c.icon || "🌿"}</span>
              )}
              <span>{c.name}</span>
            </button>
          ))}
        </aside>

        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">Sort by</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-card border border-border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30">
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {list.map((p, i) => <ProductCard key={p._id || p.id} product={p} index={i} />)}
          </div>
          {list.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No products in this category yet. <Link to="/shop" className="text-primary underline">View all</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
