import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Award, Heart, Users } from "lucide-react";
import organic from "@/assets/organic-banner.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About H.M Herbal World | Our Story from Thirupathur" },
      { name: "description", content: "Founded in Thirupathur, H.M Herbal World blends traditional Siddha and Ayurveda with modern wellness." },
      { property: "og:title", content: "About H.M Herbal World" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Our Story</span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl leading-tight">Wellness, the way our grandmothers knew it.</h1>
          <p className="mt-5 text-muted-foreground text-lg">From a small herbal shop in Thirupathur to homes across India — our journey has always been about purity and trust.</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <img src={organic} alt="Organic herbs" loading="lazy" className="rounded-3xl shadow-card" />
        <div>
          <h2 className="font-display text-3xl md:text-4xl">Rooted in tradition. Built for today.</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            H.M Herbal World began as a humble effort to keep Siddha and Ayurvedic traditions alive in our community.
            Today, we work with farmers across Tamil Nadu to source the purest herbs, prepare them in our Thirupathur
            workshop, and ship them to homes that value wellness done right.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Every product passes through our quality checks. Every order is packed with care. Because healing has always
            been personal — and we treat it that way.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { Icon: Leaf, t: "100% Natural", d: "Pure, unadulterated ingredients sourced direct from farmers." },
            { Icon: Award, t: "Quality First", d: "Every batch is tested for purity, potency and safety." },
            { Icon: Heart, t: "Family Owned", d: "Three generations of herbal wisdom in every bottle." },
            { Icon: Users, t: "50,000+ Customers", d: "Trusted by wellness families across India." },
          ].map((v) => (
            <div key={v.t} className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary-soft flex items-center justify-center">
                <v.Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-xl">{v.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
