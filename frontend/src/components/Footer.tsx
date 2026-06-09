import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Mail, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetchCategories } from "@/lib/api";

export function Footer() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: apiFetchCategories,
  });
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl mb-3">H.M Herbal World</div>
          <p className="text-sm opacity-80 leading-relaxed">
            Traditional Siddha, Ayurveda and organic wellness — sourced and prepared in Thirupathur with love and respect for tradition.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="h-9 w-9 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-70 mb-4">Quick Links</div>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/shop", label: "Shop All" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/wishlist", label: "Wishlist" },
              { to: "/cart", label: "Cart" },
            ].map((l) => (
              <li key={l.to}><Link to={l.to} className="opacity-80 hover:opacity-100 hover:underline underline-offset-4">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-70 mb-4">Categories</div>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 7).map((c) => (
              <li key={c.slug}>
                <Link to="/categories/$slug" params={{ slug: c.slug }} className="opacity-80 hover:opacity-100 hover:underline underline-offset-4">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-70 mb-4">Reach Us</div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />Thirupathur, Tamil Nadu, India</li>
            <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 shrink-0" />+91 94421 77186</li>
            <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 shrink-0" />care@hmherbalworld.in</li>
            <li>
              <a href="https://wa.me/919442177186" className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-primary-foreground text-primary text-sm font-medium hover:scale-105 transition-transform">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto px-6 py-5 text-xs flex flex-col md:flex-row justify-between gap-4 opacity-80">
          <span>© {new Date().getFullYear()} H.M Herbal World. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
            <Link to="/refund" className="hover:underline">Refund Policy</Link>
            <Link to="/shipping" className="hover:underline">Shipping Policy</Link>
            <Link to="/faq" className="hover:underline">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
