import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, cartTotal } from "@/lib/cart-store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart | H.M Herbal World" }, { name: "description", content: "Review your herbal selections." }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = cartTotal(items);
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="h-24 w-24 rounded-full bg-primary-soft mx-auto flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-display text-4xl mt-6">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Discover our herbal essentials to fill it up.</p>
        <Link to="/shop" className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium">
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl md:text-5xl mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.product.id} className="flex gap-4 bg-card border border-border rounded-2xl p-4">
              <img src={i.product.image} alt={i.product.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <Link to="/product/$slug" params={{ slug: i.product.slug }} className="font-medium hover:text-primary">{i.product.name}</Link>
                <div className="text-sm text-muted-foreground">₹{i.product.price} each</div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-muted rounded-full">
                    <button onClick={() => setQty(i.product.id, i.qty - 1)} className="h-8 w-8 flex items-center justify-center"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-medium">{i.qty}</span>
                    <button onClick={() => setQty(i.product.id, i.qty + 1)} className="h-8 w-8 flex items-center justify-center"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-primary">₹{i.product.price * i.qty}</span>
                    <button onClick={() => remove(i.product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-card border border-border rounded-2xl p-6 h-fit sticky top-28">
          <h2 className="font-display text-2xl mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <Row label="Subtotal" value={`₹${subtotal}`} />
            <Row label="Shipping" value={shipping === 0 ? "FREE" : `₹${shipping}`} />
            <div className="border-t border-border pt-3 mt-3">
              <Row label="Total" value={`₹${total}`} bold />
            </div>
          </div>
          <input placeholder="Coupon code" className="w-full mt-5 h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <Link to="/checkout" className="w-full mt-3 h-12 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center">
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="block text-center text-sm text-primary mt-4 hover:underline">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-display text-lg" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "text-primary" : ""}>{value}</span>
    </div>
  );
}
