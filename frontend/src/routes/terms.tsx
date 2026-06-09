import { createFileRoute } from "@tanstack/react-router";
import { FileText, ShieldAlert, CreditCard, Scale, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | H.M Herbal World" },
      { name: "description", content: "Read our Terms and Conditions of use. Governs purchases, website access, and policies at H.M Herbal World." },
      { property: "og:title", content: "Terms & Conditions | H.M Herbal World" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      icon: FileText,
      content: (
        <p>
          By accessing, browsing, or using this website, you acknowledge that you have read, understood, and agreed to be bound by these
          Terms & Conditions, as well as our Privacy Policy and all applicable laws and regulations. If you do not agree, please do not use this site.
        </p>
      ),
    },
    {
      title: "2. Products, Pricing & Accuracy",
      icon: ShieldAlert,
      content: (
        <>
          <p>
            We strive to display our herbal products as accurately as possible. However, please note that:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>Product packaging, colors, and textures may vary slightly from the images shown.</li>
            <li>We reserve the right to modify pricing, discontinue products, or adjust specifications at any time without prior notice.</li>
            <li>In the event of an incorrect price listing due to typo or system error, we reserve the right to cancel any orders placed for that item.</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. Payments and Billing (via Razorpay)",
      icon: CreditCard,
      content: (
        <>
          <p>
            All purchase transactions made on this website are securely handled via our authorized payment processor, <strong>Razorpay</strong>.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>You agree to provide current, complete, and accurate purchase and account information for all purchases.</li>
            <li>By initiating a payment, you warrant that you are authorized to use the chosen payment method (Credit/Debit Card, UPI, Netbanking, or Wallet).</li>
            <li>We reserve the right to decline or cancel any order if payment is unauthorized, fraudulent, or disputed.</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Governing Law & Jurisdiction",
      icon: Scale,
      content: (
        <p>
          These Terms and Conditions and any separate agreements whereby we provide you Services shall be governed by and construed in
          accordance with the laws of <strong>India</strong>. Any disputes arising under or in connection with these Terms shall be subject
          to the exclusive jurisdiction of the competent courts of <strong>Tamil Nadu, India</strong>.
        </p>
      ),
    },
    {
      title: "5. Intellectual Property",
      icon: HelpCircle,
      content: (
        <p>
          All content on this website, including but not limited to text, graphics, logos, images, digital downloads, and layout designs, is the exclusive
          property of H.M Herbal World and is protected by Indian and international copyright and trademark laws. Unauthorized reproduction is strictly prohibited.
        </p>
      ),
    },
  ];

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Legal & Policies</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">Terms & Conditions</h1>
          <p className="mt-4 text-muted-foreground text-sm">Last Updated: June 02, 2026</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft space-y-10">
          <p className="text-muted-foreground leading-relaxed text-sm">
            Welcome to <strong>H.M Herbal World</strong>. This document outlines the rules, terms, and regulations governing the use of our
            website, services, and the purchase of any products. By placing an order with us, you agree to comply with these terms.
          </p>

          <div className="space-y-8">
            {terms.map((term, idx) => {
              const Icon = term.icon;
              return (
                <div key={idx} className="border-t border-border/60 pt-8 first:border-t-0 first:pt-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="font-display text-xl md:text-2xl text-foreground">{term.title}</h2>
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed pl-12">
                    {term.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>If you have any questions or require clarifications regarding our Terms & Conditions, please contact us at:</p>
            <p className="font-semibold text-primary mt-2">care@hmherbalworld.in</p>
            <p className="mt-1">H.M Herbal World, Thirupathur, Tamil Nadu, India</p>
          </div>
        </div>
      </section>
    </div>
  );
}
