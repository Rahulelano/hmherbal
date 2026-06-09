import { MessageCircle, Phone } from "lucide-react";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href="https://wa.me/919442177186"
        aria-label="WhatsApp"
        className="h-13 w-13 h-[52px] w-[52px] rounded-full bg-[#25D366] text-white shadow-card flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href="tel:9442177186"
        aria-label="Call"
        className="h-[52px] w-[52px] rounded-full bg-primary text-primary-foreground shadow-card flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}
