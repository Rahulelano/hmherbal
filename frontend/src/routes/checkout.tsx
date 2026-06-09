import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart, cartTotal } from "@/lib/cart-store";
import { apiCreateOrder, apiVerifyPayment } from "@/lib/api";
import { toast } from "sonner";
import { ShieldCheck, Truck, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | H.M Herbal World" },
      { name: "description", content: "Review your details and place your order securely." },
    ],
  }),
  component: CheckoutPage,
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const subtotal = cartTotal(items);
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay">("COD");

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl">No items in your cart</h1>
        <p className="text-muted-foreground mt-2">Add products to your cart before checking out.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      items: items.map((i) => ({
        product: { slug: i.product.slug, name: i.product.name },
        qty: i.qty,
      })),
      paymentMethod,
    };

    try {
      const res = await apiCreateOrder(orderData);

      if (paymentMethod === "COD") {
        if (res.success) {
          clearCart();
          toast.success("Order placed successfully!");
          navigate({
            to: "/order-success",
            search: { id: res.order._id },
          });
        }
      } else if (paymentMethod === "Razorpay") {
        if (res.success && res.rzpOrderId) {
          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            toast.error("Razorpay payment gateway failed to load. Check your internet connection.");
            setLoading(false);
            return;
          }

          const options = {
            key: res.key,
            amount: res.amount,
            currency: "INR",
            name: "H.M Herbal World",
            description: "Traditional Herbal Products",
            order_id: res.rzpOrderId,
            handler: async function (response: any) {
              setLoading(true);
              try {
                const verifyRes = await apiVerifyPayment({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });

                if (verifyRes.success) {
                  clearCart();
                  toast.success("Payment successful! Order confirmed.");
                  navigate({
                    to: "/order-success",
                    search: { id: verifyRes.order._id },
                  });
                } else {
                  toast.error("Payment verification failed.");
                }
              } catch (err: any) {
                toast.error(err.message || "Payment verification failed.");
              } finally {
                setLoading(false);
              }
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            notes: {
              address: formData.address,
            },
            theme: {
              color: "#1b4332",
            },
          };

          const rzp = new window.Razorpay(options);
          
          rzp.on("payment.failed", function (response: any) {
            toast.error("Payment failed. Please try again.");
            console.error("Payment failed reason:", response.error.description);
          });

          rzp.open();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error placing order");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="mb-8 flex items-center gap-3">
        <Link to="/cart" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Secure Checkout</span>
          <h1 className="font-display text-3xl md:text-4xl mt-1">Shipping & Billing</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="font-display text-2xl border-b border-border pb-3 text-primary">Contact Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="9876543210" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="john@example.com" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="font-display text-2xl border-b border-border pb-3 text-primary">Shipping Address</h2>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Street Address</label>
              <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full p-4 rounded-2xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Flat/House No, Street, Locality" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Thirupathur" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">State</label>
                <select name="state" value={formData.state} onChange={handleInputChange} className="w-full h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Pondicherry">Pondicherry</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">PIN Code</label>
                <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} maxLength={6} className="w-full h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="630211" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="font-display text-2xl border-b border-border pb-3 text-primary">Payment Method</h2>
            <div className="space-y-4">
              <label className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${paymentMethod === "COD" ? "border-primary bg-primary-soft/30" : "border-border hover:bg-muted/40"}`}>
                <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="mt-1 text-primary focus:ring-primary" />
                <div>
                  <div className="font-medium text-sm text-foreground">Cash on Delivery (COD)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Pay with cash when order is delivered to your doorstep.</div>
                </div>
              </label>

              <label className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${paymentMethod === "Razorpay" ? "border-primary bg-primary-soft/30" : "border-border hover:bg-muted/40"}`}>
                <input type="radio" name="paymentMethod" value="Razorpay" checked={paymentMethod === "Razorpay"} onChange={() => setPaymentMethod("Razorpay")} className="mt-1 text-primary focus:ring-primary" />
                <div>
                  <div className="font-medium text-sm text-foreground">Pay Online (Razorpay)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Pay instantly with Card, Netbanking, UPI, and Wallet. Secure connection.</div>
                </div>
              </label>
            </div>
          </div>
        </form>

        <aside className="bg-card border border-border rounded-3xl p-6 h-fit sticky top-28 space-y-6">
          <h2 className="font-display text-2xl border-b border-border pb-3 text-primary">Your Order</h2>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.product.id} className="flex gap-3 text-sm">
                <img src={i.product.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-muted" />
                <div className="flex-1">
                  <div className="font-medium text-foreground line-clamp-1">{i.product.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">₹{i.product.price} × {i.qty}</div>
                </div>
                <div className="font-semibold text-primary">₹{i.product.price * i.qty}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            <div className="border-t border-border pt-3 mt-3 flex justify-between font-display text-lg font-bold text-primary">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button disabled={loading} onClick={handleSubmit} className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-glow disabled:opacity-75 disabled:pointer-events-none">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>Place Order (₹{total})</>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
              <ShieldCheck className="h-4 w-4 text-primary" /> 256-bit Secure Encryption
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
              <Truck className="h-4 w-4 text-primary" /> Fast Dispatch from Thirupathur
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
