import { createFileRoute } from "@tanstack/react-router";
import { Clock, Truck, ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery Policy | H.M Herbal World" },
      { name: "description", content: "Details on processing times, delivery zones, rates, and tracking for H.M Herbal World purchases." },
      { property: "og:title", content: "Shipping & Delivery Policy | H.M Herbal World" },
      { property: "og:url", content: "/shipping" },
    ],
    links: [{ rel: "canonical", href: "/shipping" }],
  }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  const policies = [
    {
      title: "Order Processing Time",
      icon: Clock,
      desc: "All orders are processed and prepared in our Thirupathur facility within 1 to 2 business days (excluding Sundays and national holidays) after payment confirmation. You will receive an email/SMS notification as soon as your order is shipped.",
    },
    {
      title: "Delivery Timelines",
      icon: Truck,
      desc: "We ship orders across India. Once dispatched, standard delivery times are: Metro Cities: 2 to 4 business days. Other Cities and Districts: 4 to 7 business days. Remote or rural locations may take up to 8-10 business days.",
    },
    {
      title: "Shipping Charges",
      icon: ShieldCheck,
      desc: "We offer Free Shipping on all orders above ₹500 across India. For orders below ₹500, a flat shipping and handling fee of ₹50 is charged at checkout.",
    },
    {
      title: "Courier & Tracking Services",
      icon: MapPin,
      desc: "We partner with trusted courier services including DTDC, Blue Dart, Delhivery, Speed Post, and Professional Couriers. You will receive a unique tracking link via email/SMS immediately after dispatch to track your shipment in real-time.",
    },
  ];

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Shipping & Logistics</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">Shipping & Delivery Policy</h1>
          <p className="mt-4 text-muted-foreground text-sm">Last Updated: June 02, 2026</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 max-w-4xl space-y-10">
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft">
          <p className="text-muted-foreground leading-relaxed text-sm">
            At <strong>H.M Herbal World</strong>, we are committed to delivering your herbal formulations and wellness products
            safely and efficiently. Below is our comprehensive shipping policy detailing how we handle packaging, dispatch,
            and logistics across India.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {policies.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="bg-muted/40 border border-border/50 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-lg text-foreground">{p.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft space-y-4">
          <h2 className="font-display text-2xl text-foreground">Important Shipping Notes</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li><strong>Delivery Addresses:</strong> Please ensure your delivery address, PIN code, and mobile number are 100% correct. We are not responsible for delivery delays or failures caused by incorrect details.</li>
            <li><strong>Damaged Packaging:</strong> If you receive a package that is visibly damaged, tampered with, or open, please do not accept the delivery and immediately report it to us at care@hmherbalworld.in with pictures of the package.</li>
            <li><strong>Delayed Delivery:</strong> Occasional delays can occur due to weather anomalies, festival rushes, or unexpected transport disruptions. We will notify you in such rare circumstances.</li>
          </ul>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>For any queries about order shipments, logistics tracking, or delivery delays, contact support:</p>
          <p className="font-semibold text-primary mt-2">care@hmherbalworld.in | +91 94421 77186</p>
          <p className="mt-1">H.M Herbal World, Thirupathur, Tamil Nadu, India</p>
        </div>
      </section>
    </div>
  );
}
