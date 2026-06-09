import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, ShoppingBag, Phone, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type SearchParams = {
  id: string;
};

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      id: (search.id as string) || "",
    };
  },
  head: () => ({
    meta: [{ title: "Order Success | H.M Herbal World" }],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { id } = Route.useSearch();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        // Since it's public success, we fetch order. Wait, our order GET endpoint is admin protected,
        // but we can create a public endpoint or fetch via a public check.
        // Wait! Let's check how to retrieve order detail without auth.
        // In orderRoutes.js we don't have a public GET /api/orders/:id route.
        // Let's add a public endpoint GET /api/orders/public/:id in orderRoutes.js?
        // Yes, that is extremely useful for displaying invoice details on success screen without requiring admin auth!
        // Let's create a fetch request to /api/orders/public/${id}
        const response = await fetch(`/api/orders/public/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          console.error("Failed to load public order detail");
        }
      } catch (error) {
        console.error("Error fetching success order details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  return (
    <div className="container mx-auto px-6 py-16 max-w-2xl text-center">
      <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-soft flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-primary-soft flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-display text-4xl text-foreground">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          Thank you for choosing H.M Herbal World. Your wellness order has been received and is being prepared in Thirupathur.
        </p>

        {id && (
          <div className="mt-6 px-4 py-2 rounded-full bg-muted text-xs font-mono text-muted-foreground select-all">
            Order Reference ID: #{id}
          </div>
        )}

        {loading ? (
          <div className="w-full mt-8 py-4 text-sm text-muted-foreground">Loading invoice breakdown...</div>
        ) : order ? (
          <div className="w-full mt-8 border-t border-border pt-8 text-left space-y-4">
            <h3 className="font-display text-lg text-primary">Delivery Summary</h3>
            <div className="bg-muted/60 rounded-2xl p-5 text-sm space-y-1">
              <div className="font-medium">{order.customerName}</div>
              <div className="text-muted-foreground">{order.address}</div>
              <div className="text-muted-foreground">{order.city}, {order.state} - {order.zipCode}</div>
              <div className="text-muted-foreground">Phone: {order.customerPhone}</div>
            </div>

            <h3 className="font-display text-lg text-primary mt-6">Ordered Items</h3>
            <div className="space-y-3 bg-muted/30 rounded-2xl p-5">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-border/50 last:border-0 pb-2 last:pb-0">
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{item.product.name}</span>
                    <span className="text-muted-foreground ml-2">× {item.qty}</span>
                  </div>
                  <span className="font-semibold text-primary">₹{item.product.price * item.qty}</span>
                </div>
              ))}
              <div className="border-t border-border dashed pt-3 mt-3 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-primary text-base pt-1">
                  <span>Paid via {order.paymentMethod === "COD" ? "COD" : "Online"}:</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link to="/shop" className="flex-1 h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <ShoppingBag className="h-4 w-4" /> Continue Shopping
          </Link>
          <a href="https://wa.me/919442177186" target="_blank" rel="noopener noreferrer" className="flex-1 h-12 px-8 rounded-full border border-border bg-card text-foreground font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors">
            <Phone className="h-4 w-4 text-emerald-600" /> WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}
