import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, User, Menu, Phone, MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart, cartCount } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiFetchCategories, apiFetchProducts } from "@/lib/api";

export function Header() {
  const items = useCart((s) => s.items);
  const wishlist = useCart((s) => s.wishlist);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: apiFetchCategories,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: apiFetchProducts,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = query.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  return (
    <>
      {/* Top strip */}
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto px-6 flex justify-between items-center h-9">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Thirupathur, Tamil Nadu</span>
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />9442177186</span>
          </div>
          <div className="flex items-center gap-5">
            <span>Free shipping on orders above ₹499</span>
            <span>•</span>
            <span>Cash on Delivery available</span>
          </div>
        </div>
      </div>

      <header className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "glass shadow-soft" : "bg-background"
      )}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 md:gap-8 h-16 md:h-20">
            <button className="md:hidden p-1 -ml-1" onClick={() => setMenuOpen(true)} aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative h-10 w-10 rounded-full bg-gradient-leaf flex items-center justify-center text-primary-foreground font-display text-lg shadow-glow group-hover:scale-105 transition-transform">
                H
              </div>
              <div className="leading-tight">
                <div className="font-display text-xl md:text-2xl text-primary">H.M Herbal</div>
                <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase -mt-1">World · Thirupathur</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium ml-4">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className="hover:text-primary transition-colors">Categories</button>
                {megaOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[680px]">
                    <div className="bg-card rounded-2xl shadow-card border border-border p-6 grid grid-cols-3 gap-1">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          to="/categories/$slug"
                          params={{ slug: c.slug }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary-soft transition-colors text-sm"
                        >
                          {c.icon && (c.icon.startsWith("/") || c.icon.startsWith("http")) ? (
                            <img src={c.icon} alt="" className="h-5 w-5 rounded-full object-cover shrink-0" />
                          ) : (
                            <span className="text-lg">{c.icon || "🌿"}</span>
                          )}
                          <span>{c.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </nav>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md ml-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Search herbs, powders, oils…"
                className="w-full bg-muted/60 rounded-full pl-11 pr-4 h-11 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
              {searchOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card rounded-xl shadow-card border border-border overflow-hidden">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                    >
                      <img src={p.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">₹{p.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-auto md:ml-0 flex items-center gap-1">
              <button className="md:hidden p-2" aria-label="Search"><Search className="h-5 w-5" /></button>
              <Link to="/wishlist" className="relative p-2 hover:text-primary transition-colors" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-saffron text-[10px] font-bold text-white flex items-center justify-center">{wishlist.length}</span>
                )}
              </Link>
              <Link to="/login" className="hidden sm:block p-2 hover:text-primary transition-colors" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
              <Link to="/cart" className="relative p-2 hover:text-primary transition-colors" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount(items) > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">{cartCount(items)}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-background overflow-y-auto animate-fade-up">
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-display text-xl text-primary">Menu</span>
              <button onClick={() => setMenuOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="p-4 space-y-1">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
                { to: "/cart", label: "Cart" },
                { to: "/wishlist", label: "Wishlist" },
                { to: "/login", label: "Login" },
              ].map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-muted">{l.label}</Link>
              ))}
              <div className="pt-3 mt-3 border-t">
                <div className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">Categories</div>
                {categories.map((c) => (
                  <Link key={c.slug} to="/categories/$slug" params={{ slug: c.slug }} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted text-sm">
                    {c.icon && (c.icon.startsWith("/") || c.icon.startsWith("http")) ? (
                      <img src={c.icon} alt="" className="h-5 w-5 rounded-full object-cover shrink-0" />
                    ) : (
                      <span>{c.icon || "🌿"}</span>
                    )}
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
