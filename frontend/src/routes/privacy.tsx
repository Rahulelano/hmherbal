import { createFileRoute } from "@tanstack/react-router";
import { Shield, Eye, Lock, RefreshCw, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | H.M Herbal World" },
      { name: "description", content: "Learn how H.M Herbal World protects your personal information. Read our Privacy Policy details." },
      { property: "og:title", content: "Privacy Policy | H.M Herbal World" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: Eye,
      content: (
        <>
          <p>We collect personal information that you provide to us directly when purchasing products or interacting with our store. This includes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li><strong>Contact details:</strong> Your name, billing address, shipping address, email address, and phone number.</li>
            <li><strong>Order details:</strong> Details of transactions you carry out through our website and the fulfillment of your orders.</li>
            <li><strong>Technical data:</strong> IP address, browser type, operating system, and session logs collected automatically through cookies and similar technologies.</li>
          </ul>
        </>
      ),
    },
    {
      title: "2. How We Use Your Information",
      icon: Shield,
      content: (
        <>
          <p>The information we collect is utilized for the following core purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>To process, pack, ship, and deliver the products you purchase.</li>
            <li>To send you order status updates, transactional notifications, and customer support communications.</li>
            <li>To improve our products, customer service quality, and overall website browsing experience.</li>
            <li>To detect, prevent, and address security threats, fraud, or technical issues.</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. Secure Payment Gateway (Razorpay)",
      icon: Lock,
      content: (
        <>
          <p>
            To process payments on our website, we use <strong>Razorpay</strong>, a secure third-party payment gateway.
            Your credit/debit card, netbanking, UPI, or wallet credentials are encrypted and securely transmitted directly
            to Razorpay's processing network.
          </p>
          <div className="mt-3 p-4 bg-primary-soft rounded-2xl text-xs leading-relaxed text-foreground">
            <strong>Payment Security Note:</strong> We do NOT collect, store, or process any payment card numbers, CVVs,
            or banking passwords on our servers. Razorpay complies with the Payment Card Industry Data Security Standard (PCI-DSS)
            to guarantee the highest level of security for all transactional data.
          </div>
        </>
      ),
    },
    {
      title: "4. Cookies and Web Analytics",
      icon: HelpCircle,
      content: (
        <p>
          We use cookies to keep track of your shopping cart contents, understand your preferences for future visits, and compile aggregate data about site traffic.
          You can choose to disable cookies through your browser settings, though doing so might affect the functionality of certain elements on our website.
        </p>
      ),
    },
    {
      title: "5. Data Retention & Security",
      icon: RefreshCw,
      content: (
        <p>
          We implement standard security measures to safeguard your personal details from unauthorized access, alteration, disclosure, or destruction.
          We retain your personal information only as long as is necessary to process transactions, fulfill tax or regulatory requirements, and resolve dispute issues.
        </p>
      ),
    },
  ];

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Legal & Policies</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground text-sm">Last Updated: June 02, 2026</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft space-y-10">
          <p className="text-muted-foreground leading-relaxed text-sm">
            At <strong>H.M Herbal World</strong>, protecting the privacy and confidentiality of our customers is a fundamental priority.
            This Privacy Policy explains how we collect, use, share, and protect your personal information when you visit our website
            or purchase products from us.
          </p>

          <div className="space-y-8">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="border-t border-border/60 pt-8 first:border-t-0 first:pt-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="font-display text-xl md:text-2xl text-foreground">{section.title}</h2>
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed pl-12">
                    {section.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>If you have any questions or concerns about this policy, please write to us at:</p>
            <p className="font-semibold text-primary mt-2">care@hmherbalworld.in</p>
            <p className="mt-1">H.M Herbal World, Thirupathur, Tamil Nadu, India</p>
          </div>
        </div>
      </section>
    </div>
  );
}
