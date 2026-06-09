import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, Ban, CheckCircle, PackageOpen, Truck } from "lucide-react";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy | H.M Herbal World" },
      { name: "description", content: "Understand our cancellation window, return eligibility, and refund timeline at H.M Herbal World." },
      { property: "og:title", content: "Refund & Cancellation Policy | H.M Herbal World" },
      { property: "og:url", content: "/refund" },
    ],
    links: [{ rel: "canonical", href: "/refund" }],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  const steps = [
    {
      title: "Step 1: Contact Support",
      icon: PackageOpen,
      desc: "Within 7 days of receiving your order, email care@hmherbalworld.in with your Order ID and photo/video evidence of any damaged or incorrect products.",
    },
    {
      title: "Step 2: Verification",
      icon: CheckCircle,
      desc: "Our quality team in Thirupathur will review your request. If approved, we will request you to ship the product back or initiate a direct replacement.",
    },
    {
      title: "Step 3: Return Shipment",
      icon: Truck,
      desc: "Items must be returned in their original packaging, unused and unopened, to ensure security and hygiene protocols for natural herbal items.",
    },
    {
      title: "Step 4: Refund Processing",
      icon: ArrowLeftRight,
      desc: "Once the package is inspected, we issue a refund to your original payment method (via Razorpay) within 5-7 business days.",
    },
  ];

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Legal & Policies</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">Refund & Cancellation Policy</h1>
          <p className="mt-4 text-muted-foreground text-sm">Last Updated: June 02, 2026</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 max-w-4xl space-y-8">
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft">
          <div className="flex gap-4 items-start mb-6">
            <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl mb-2">Order Cancellation Policy</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We begin processing orders immediately. You can cancel your order **before it is dispatched** for a full refund.
                Once an order has been handed over to our courier partner (typically within 12-24 hours of placement), it cannot be cancelled.
                To request cancellation, please contact us at **+91 94421 77186** or email **care@hmherbalworld.in** immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft">
          <h2 className="font-display text-2xl mb-4">Returns and Replacements</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Since our products are natural herbs, organic powders, and dietary supplements, we maintain strict hygiene guidelines.
            We only accept returns and offer refunds or replacements under the following conditions:
          </p>
          <ul className="list-disc pl-5 mb-8 space-y-2 text-sm text-muted-foreground">
            <li>The product received was damaged in transit or defective.</li>
            <li>The product received does not match your ordered item.</li>
            <li>The product packaging is sealed, unopened, and unused.</li>
          </ul>

          <h3 className="font-display text-xl mb-6 text-foreground">Return & Refund Process</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-muted/40 border border-border/50 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-semibold text-sm">{s.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft">
          <h2 className="font-display text-2xl mb-3">Refund Timeline</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Approved refunds are credited to the customer's bank account, credit/debit card, or wallet through the original payment mode (Razorpay).
            The refund amount will show up in your account within <strong>5-7 business days</strong> from the date of refund approval.
            We do not offer cash refunds.
          </p>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Need support or help with an order? Get in touch with us:</p>
          <p className="font-semibold text-primary mt-2">care@hmherbalworld.in | +91 94421 77186</p>
          <p className="mt-1">H.M Herbal World, Thirupathur, Tamil Nadu, India</p>
        </div>
      </section>
    </div>
  );
}
