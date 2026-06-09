import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { apiFetchCategories, apiFetchProducts } from "@/lib/api";

export const Route = createFileRoute("/categories/$slug")({
  head: ({ params }) => {
    const title = `${params.slug.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())} | H.M Herbal World`;
    return {
      meta: [
        { title },
        { name: "description", content: `Shop authentic products from H.M Herbal World, Thirupathur.` },
        { property: "og:title", content: title },
        { property: "og:url", content: `/categories/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/categories/${params.slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: apiFetchCategories,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: apiFetchProducts,
  });

  const cat = categories.find((c) => c.slug === slug);
  if (!cat) throw notFound();

  const list = products.filter((p) => p.category === slug);

  return (
    <div className="container mx-auto px-6 py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link> <span className="mx-2">/</span>
        <span className="text-foreground">{cat.name}</span>
      </nav>

      <div className="rounded-3xl bg-gradient-hero p-10 md:p-14 mb-10 text-center">
        <div className="flex justify-center mb-3">
          {cat.icon && (cat.icon.startsWith("/") || cat.icon.startsWith("http")) ? (
            <img src={cat.icon} alt="" className="h-24 w-24 rounded-full object-cover shadow-soft animate-float" />
          ) : (
            <div className="text-6xl">{cat.icon || "🌿"}</div>
          )}
        </div>
        <h1 className="font-display text-4xl md:text-5xl">{cat.name}</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Premium {cat.name.toLowerCase()} curated by H.M Herbal World, Thirupathur.</p>
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {list.map((p, i) => <ProductCard key={p._id || p.id} product={p} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">More {cat.name.toLowerCase()} arriving soon.</p>
          <Link to="/shop" className="mt-5 inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground">Browse all products</Link>
        </div>
      )}
    </div>
  );
}
