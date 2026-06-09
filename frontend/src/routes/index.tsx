import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Truck, ShieldCheck, Sparkles, ChevronRight, Star, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import heroImg from "@/assets/hero-herbs.jpg";
import organicBanner from "@/assets/organic-banner.jpg";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { apiFetchCategories, apiFetchProducts, apiFetchSliders } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "H.M Herbal World — Traditional Herbal Wellness | Thirupathur" },
      { name: "description", content: "Premium Siddha, Ayurvedic and organic herbal products from Thirupathur. Raw herbs, powders, oils and more delivered across India." },
      { property: "og:title", content: "H.M Herbal World — Traditional Herbal Wellness" },
      { property: "og:description", content: "Trusted Siddha, Ayurveda & organic products in Thirupathur." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Store",
        name: "H.M Herbal World",
        address: { "@type": "PostalAddress", addressLocality: "Thirupathur", addressCountry: "IN" },
        telephone: "+91-9442177186",
      }),
    }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoriesGrid />
      <FeaturedProducts title="Bestsellers" subtitle="Loved by thousands across India" filter={(p) => !!p.bestseller} />
      <OrganicBanner />
      <FeaturedProducts title="Trending Now" subtitle="Fresh from our Thirupathur workshop" filter={(p) => !!p.trending} />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
}

function Hero() {
  const { data: slides = [] } = useQuery({
    queryKey: ["sliders"],
    queryFn: apiFetchSliders,
  });

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-hero">
        <Leaf className="absolute top-20 left-[8%] h-10 w-10 text-primary/20 animate-float" style={{ animationDelay: "0s" }} />
        <Leaf className="absolute top-40 right-[12%] h-8 w-8 text-primary/15 animate-float" style={{ animationDelay: "2s" }} />
        <Leaf className="absolute bottom-32 left-[20%] h-6 w-6 text-primary/15 animate-float" style={{ animationDelay: "4s" }} />

        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center pt-12 pb-16 md:pt-20 md:pb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/70 backdrop-blur border border-border text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Crafted in Thirupathur · Since traditions
            </span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
              Traditional Herbal <span className="text-primary italic">Wellness</span> for Modern Life
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg text-balance">
              Trusted Siddha, Ayurveda and organic products — sourced, stone-ground and packed with care in Thirupathur, Tamil Nadu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:scale-105 transition-transform">
                Shop Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-card transition-colors font-medium">
                Explore Categories
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm">
              <Stat number="20+" label="Years of trust" />
              <span className="h-8 w-px bg-border" />
              <Stat number="500+" label="Pure products" />
              <span className="h-8 w-px bg-border" />
              <Stat number="50k+" label="Happy customers" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
              <img src={heroImg} alt="Fresh herbs" className="h-full w-full object-cover" width={1536} height={1024} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-4 md:-left-10 bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 max-w-[240px]"
            >
              <div className="h-12 w-12 rounded-full bg-primary-soft flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">100% Authentic</div>
                <div className="font-medium text-sm">Lab Tested Quality</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  const current = slides[active];

  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[500px] md:min-h-[560px] flex items-center">
      {/* Background slide with crossfade */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, idx) => (
          <motion.div
            key={s._id || idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === active ? 0.22 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
          </motion.div>
        ))}
      </div>

      <Leaf className="absolute top-20 left-[8%] h-10 w-10 text-primary/20 animate-float" style={{ animationDelay: "0s" }} />
      <Leaf className="absolute top-40 right-[12%] h-8 w-8 text-primary/15 animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center pt-12 pb-16 md:pt-20 md:pb-24 relative z-10">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/70 backdrop-blur border border-border text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Traditional Wellness · Thirupathur
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
            {current.title || "Traditional Herbal Wellness"}
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg text-balance">
            {current.subtitle || "Sourced, stone-ground, and packed with care in Thirupathur, Tamil Nadu."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={current.link || "/shop"} className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:scale-105 transition-transform">
              Shop Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card hidden md:block">
          <motion.img
            key={active}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={current.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`h-2.5 rounded-full transition-all ${idx === active ? "w-8 bg-primary" : "w-2.5 bg-primary/30"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-primary">{number}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function TrustStrip() {
  const items = [
    { Icon: Truck, title: "Free Shipping", desc: "On orders above ₹499" },
    { Icon: ShieldCheck, title: "100% Authentic", desc: "Lab tested quality" },
    { Icon: Leaf, title: "Organic & Pure", desc: "Direct from farmers" },
    { Icon: Sparkles, title: "Cash on Delivery", desc: "Pan-India service" },
  ];
  return (
    <section className="border-y border-border bg-card/50">
      <div className="container mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">{title}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoriesGrid() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: apiFetchCategories,
  });

  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <SectionHeader eyebrow="Shop by category" title="Find your wellness ritual" subtitle="From raw herbs to ready-made formulations" />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <Link to="/categories/$slug" params={{ slug: c.slug }} className="group flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-soft transition-all hover:-translate-y-1">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-soft to-accent flex items-center justify-center text-3xl group-hover:scale-110 transition-transform overflow-hidden">
                {c.icon && (c.icon.startsWith("/") || c.icon.startsWith("http")) ? (
                  <img src={c.icon} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  c.icon || "🌿"
                )}
              </div>
              <div className="mt-3 text-sm font-medium leading-tight">{c.name}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts({ title, subtitle, filter }: { title: string; subtitle: string; filter: (p: any) => boolean }) {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: apiFetchProducts,
  });

  const list = products.filter(filter);
  return (
    <section className="container mx-auto px-6 py-16 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-10">
        <SectionHeader eyebrow="Curated for you" title={title} subtitle={subtitle} align="left" />
        <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {list.map((p, i) => <ProductCard key={p._id || p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

function OrganicBanner() {
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <img src={organicBanner} alt="Organic herbs" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="relative grid md:grid-cols-2 gap-6 p-10 md:p-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary-foreground/15 text-xs font-medium mb-4">Certified Organic</span>
            <h3 className="font-display text-3xl md:text-5xl leading-tight text-balance">Pure. Potent.<br />Picked at the source.</h3>
            <p className="mt-4 max-w-md opacity-90 text-balance">Every herb in our range is traceable to its farm. No chemicals, no fillers — just the way nature intended.</p>
            <Link to="/categories/$slug" params={{ slug: "organic" }} className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-foreground text-primary font-medium hover:scale-105 transition-transform">
              Explore Organic Range <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Priya R.", city: "Chennai", text: "The turmeric powder smells incredible — you can tell it's freshly stone-ground. My family swears by it now.", rating: 5 },
    { name: "Karthik S.", city: "Bangalore", text: "Authentic Siddha formulations are hard to find online. H.M Herbal World is the real deal — fast shipping too.", rating: 5 },
    { name: "Lakshmi V.", city: "Coimbatore", text: "Ordered the millet mix and ashwagandha. Quality is premium and packaging is so thoughtful.", rating: 5 },
  ];
  return (
    <section className="bg-primary-soft/40 py-20 mt-12">
      <div className="container mx-auto px-6">
        <SectionHeader eyebrow="Customer love" title="Trusted by thousands" subtitle="Real reviews from real wellness journeys" />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-7 shadow-soft"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-saffron text-saffron" />)}
              </div>
              <p className="text-sm leading-relaxed">"{r.text}"</p>
              <div className="mt-5 pt-5 border-t border-border">
                <div className="font-medium text-sm">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.city}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Are your products 100% authentic and organic?", a: "Yes. Every product is sourced from trusted farms and prepared in our Thirupathur workshop. We share lab certificates on request." },
    { q: "Do you offer Cash on Delivery?", a: "Absolutely — COD is available across India for orders below ₹5,000." },
    { q: "How long does shipping take?", a: "Most orders are delivered within 3–6 business days. Tamil Nadu deliveries usually arrive in 2–3 days." },
    { q: "Can I return a product?", a: "Yes, unopened products can be returned within 7 days. Reach out on WhatsApp for a quick refund." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <SectionHeader eyebrow="Help center" title="Frequently asked" subtitle="Everything you need to know before you shop." align="left" />
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-medium">
                <span>{f.q}</span>
                {open === i ? <Minus className="h-4 w-4 text-primary shrink-0" /> : <Plus className="h-4 w-4 text-primary shrink-0" />}
              </button>
              {open === i && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="container mx-auto px-6 pb-20">
      <div className="rounded-3xl bg-gradient-leaf text-primary-foreground p-10 md:p-16 text-center relative overflow-hidden">
        <Leaf className="absolute top-6 right-10 h-16 w-16 opacity-15 animate-float" />
        <Leaf className="absolute bottom-6 left-10 h-12 w-12 opacity-15 animate-float" style={{ animationDelay: "3s" }} />
        <h3 className="font-display text-3xl md:text-5xl">Wellness wisdom, delivered.</h3>
        <p className="mt-3 opacity-90 max-w-lg mx-auto">Subscribe for traditional recipes, seasonal offers and 10% off your first order.</p>
        <form onSubmit={(e) => e.preventDefault()} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required placeholder="your@email.com" className="flex-1 h-12 px-5 rounded-full bg-card text-foreground outline-none focus:ring-4 focus:ring-primary-foreground/20" />
          <button className="h-12 px-7 rounded-full bg-card text-primary font-medium hover:scale-105 transition-transform">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle, align = "center" }: { eyebrow: string; title: string; subtitle: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-xl"}>
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
      <h2 className="mt-2 font-display text-3xl md:text-5xl leading-tight text-balance">{title}</h2>
      <p className="mt-3 text-muted-foreground text-balance">{subtitle}</p>
    </div>
  );
}
