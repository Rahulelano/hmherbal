import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle, ShoppingBag, Truck, CreditCard, Leaf } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions (FAQ) | H.M Herbal World" },
      { name: "description", content: "Got questions? Find answers about our organic herbs, secure payments via Razorpay, delivery times, and refund options." },
      { property: "og:title", content: "Frequently Asked Questions (FAQ) | H.M Herbal World" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FAQPage,
});

type Category = "all" | "general" | "shipping" | "payments" | "products";

interface FAQItem {
  id: string;
  category: Category;
  q: string;
  a: React.ReactNode;
}

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const categoriesList: { id: Category; label: string; icon: any }[] = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "general", label: "General & Orders", icon: ShoppingBag },
    { id: "shipping", label: "Shipping & Delivery", icon: Truck },
    { id: "payments", label: "Payments & Refunds", icon: CreditCard },
    { id: "products", label: "Our Herbs", icon: Leaf },
  ];

  const faqs: FAQItem[] = [
    {
      id: "g1",
      category: "general",
      q: "Where is H.M Herbal World based?",
      a: "Our physical workshop and retail storefront are based in Thirupathur, Tamil Nadu, India. All our traditional formulations, sourcing, and packaging are handled here with the utmost care.",
    },
    {
      id: "g2",
      category: "general",
      q: "How can I contact customer support?",
      a: "You can reach us by email at care@hmherbalworld.in, call us at +91 94421 77186, or click the WhatsApp button in the footer to message us directly. Our support hours are Mon-Sat 9 AM to 8 PM.",
    },
    {
      id: "s1",
      category: "shipping",
      q: "How long does shipping take?",
      a: "We process and ship all orders within 1-2 business days. Metro deliveries across India take 2-4 business days, while other areas and districts take 4-7 business days. You will receive a courier tracking number via SMS/Email as soon as your package is dispatched.",
    },
    {
      id: "s2",
      category: "shipping",
      q: "What are your shipping charges?",
      a: "We offer Free Shipping across India on all orders of ₹500 or more. For orders below ₹500, a flat shipping fee of ₹50 is applied at checkout.",
    },
    {
      id: "p1",
      category: "payments",
      q: "What payment methods do you accept?",
      a: (
        <div>
          <p>We accept a wide range of safe and secure payment options through our partner payment gateway, <strong>Razorpay</strong>:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>UPI:</strong> GPay, PhonePe, Paytm, BHIM, and other bank apps.</li>
            <li><strong>Cards:</strong> All major Indian and International Credit & Debit cards (Visa, MasterCard, RuPay, Maestro, Diners, American Express).</li>
            <li><strong>Net Banking:</strong> Over 50+ major Indian banks supported.</li>
            <li><strong>Wallets:</strong> Amazon Pay, Mobikwik, PhonePe Wallet, and more.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "p2",
      category: "payments",
      q: "Are online payments secure on your website?",
      a: "Yes, 100%. We secure our transactions using Razorpay, which is PCI-DSS Level 1 compliant (the highest industry standard). None of your card or bank account details are stored on our servers. The entire payment transaction is fully encrypted.",
    },
    {
      id: "p3",
      category: "payments",
      q: "What is your refund policy?",
      a: "If you receive a damaged, defective, or incorrect product, please reach out to us at care@hmherbalworld.in within 7 days of delivery. Upon approval, we will process a replacement or refund. Approved refunds will be credited back via Razorpay/original payment mode within 5-7 business days.",
    },
    {
      id: "pr1",
      category: "products",
      q: "Are your herbal products 100% natural?",
      a: "Absolutely. All our products are sourced directly from sustainable local farms in Tamil Nadu and prepared without any chemical additives, preservatives, artificial colors, or adulteration.",
    },
    {
      id: "pr2",
      category: "products",
      q: "Should I consult a physician before using these herbal products?",
      a: "While our products are natural herbs and traditional home remedies, we always recommend consulting a qualified Ayurvedic/Siddha doctor or general practitioner before starting any supplement, especially if you have pre-existing medical conditions, are pregnant, or are taking prescription medication.",
    },
  ];

  const filteredFaqs = activeCategory === "all" ? faqs : faqs.filter(f => f.category === activeCategory);

  return (
    <div>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Help & Support</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">Frequently Asked Questions</h1>
          <p className="mt-4 text-muted-foreground text-sm">Have a question? We've got answers. Select a category below to filter.</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-soft scale-105"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft">
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-border/50 last:border-0 py-2">
                  <AccordionTrigger className="font-display text-base md:text-lg text-foreground hover:no-underline hover:text-primary py-3">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No questions found in this category.
            </div>
          )}
        </div>

        <div className="bg-primary-soft border border-primary/10 rounded-3xl p-6 text-center mt-12 max-w-2xl mx-auto">
          <h3 className="font-display text-xl text-foreground mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">We are happy to assist you with order status, bulk inquiries, or product choices.</p>
          <a
            href="mailto:care@hmherbalworld.in"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:scale-105 transition-transform"
          >
            Email Customer Care
          </a>
        </div>
      </section>
    </div>
  );
}
