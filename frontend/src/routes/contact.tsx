import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Mail, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact H.M Herbal World | Thirupathur" },
      { name: "description", content: "Reach H.M Herbal World in Thirupathur. Call +91 94421 77186 or message us on WhatsApp." },
      { property: "og:title", content: "Contact H.M Herbal World" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Get in touch</span>
        <h1 className="mt-2 font-display text-4xl md:text-6xl">We'd love to hear from you</h1>
        <p className="mt-4 text-muted-foreground">For orders, wholesale enquiries or wellness advice — reach us anytime.</p>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-5">
        {[
          { Icon: Phone, t: "Call us", d: "+91 94421 77186", href: "tel:9442177186" },
          { Icon: MessageCircle, t: "WhatsApp", d: "Quick replies", href: "https://wa.me/919442177186" },
          { Icon: MapPin, t: "Visit our shop", d: "Thirupathur, Tamil Nadu" },
        ].map((c) => (
          <a key={c.t} href={c.href} className="block bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-soft transition-all">
            <div className="h-11 w-11 rounded-full bg-primary-soft flex items-center justify-center">
              <c.Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{c.t}</div>
            <div className="mt-1 font-display text-xl">{c.d}</div>
          </a>
        ))}
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-10">
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Thanks! We'll be in touch within 24 hours."); }}
          className="bg-card border border-border rounded-3xl p-8 space-y-4"
        >
          <h2 className="font-display text-2xl">Send a message</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Your name" placeholder="Lakshmi" />
            <Input label="Phone" placeholder="9442177186" />
          </div>
          <Input label="Email" type="email" placeholder="you@example.com" />
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Message</label>
            <textarea required rows={5} className="w-full px-4 py-3 rounded-2xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="How can we help?" />
          </div>
          <button className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition-transform">Send Message</button>
        </form>

        <div className="space-y-5">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="font-display text-2xl mb-4">Shop hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" />Mon – Sat</span><span>9:00 AM – 8:00 PM</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sunday</span><span>10:00 AM – 2:00 PM</span></div>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-border h-64">
            <iframe
              title="Thirupathur map"
              src="https://www.google.com/maps?q=Thirupathur,Tamil+Nadu&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="bg-primary text-primary-foreground rounded-3xl p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs opacity-80 uppercase tracking-wider">Email</div>
              <div className="font-medium">care@hmherbalworld.in</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      <input required {...p} className="w-full h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}
