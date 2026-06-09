import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiFetchOrders, apiUpdateOrderStatus } from "@/lib/api";
import { toast } from "sonner";
import { useAdminToken } from "./admin";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Eye,
  Loader2
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const token = useAdminToken();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const data = await apiFetchOrders(token);
      setOrders(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await apiUpdateOrderStatus(orderId, newStatus, token);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute stats
  const totalSales = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.total, 0);
  
  const processingCount = orders.filter((o) => o.orderStatus === "Processing").length;
  const completedCount = orders.filter((o) => o.orderStatus === "Delivered").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of orders, sales, and analytics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Revenue" value={`₹${totalSales}`} desc="Paid orders" Icon={IndianRupee} color="from-emerald-500/20 to-teal-500/20 text-emerald-600" />
        <StatCard title="Total Orders" value={orders.length} desc="Lifetime orders" Icon={ShoppingBag} color="from-blue-500/20 to-indigo-500/20 text-blue-600" />
        <StatCard title="Processing" value={processingCount} desc="Awaiting packing/shipment" Icon={Clock} color="from-amber-500/20 to-orange-500/20 text-amber-600" />
        <StatCard title="Completed" value={completedCount} desc="Delivered orders" Icon={CheckCircle2} color="from-purple-500/20 to-pink-500/20 text-purple-600" />
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Orders List */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h2 className="font-display text-xl text-primary flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Recent Orders
            </h2>
            <button onClick={loadOrders} className="text-xs text-primary font-medium hover:underline">Refresh</button>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/30">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="p-3 font-mono text-xs text-muted-foreground select-all">#{order._id.slice(-6)}</td>
                      <td className="p-3">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                      </td>
                      <td className="p-3 font-semibold text-primary">₹{order.total}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.orderStatus === "Processing" ? "bg-amber-100 text-amber-700" :
                          order.orderStatus === "Shipped" ? "bg-blue-100 text-blue-700" :
                          order.orderStatus === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                          "bg-rose-100 text-rose-700"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs ${order.paymentStatus === "Paid" ? "text-emerald-600 font-medium" : "text-amber-600"}`}>
                          {order.paymentMethod} ({order.paymentStatus})
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 w-8 rounded-full bg-primary-soft hover:bg-primary hover:text-white flex items-center justify-center text-primary transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Panel */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-6">
          <h2 className="font-display text-xl text-primary border-b border-border pb-3">Order Details</h2>
          {selectedOrder ? (
            <div className="space-y-5">
              {/* Client Block */}
              <div className="text-sm space-y-1 bg-muted/40 p-4 rounded-2xl">
                <div className="font-bold text-base">{selectedOrder.customerName}</div>
                <div className="text-muted-foreground">{selectedOrder.customerEmail}</div>
                <div className="text-muted-foreground">Phone: {selectedOrder.customerPhone}</div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Shipping Address:</div>
                  <div className="mt-1">{selectedOrder.address}</div>
                  <div>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.zipCode}</div>
                </div>
              </div>

              {/* Items Block */}
              <div className="space-y-2.5">
                <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Items:</div>
                <div className="space-y-2 max-h-48 overflow-y-auto bg-muted/20 p-3 rounded-2xl">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-border/40 last:border-0 last:pb-0">
                      <div>
                        <div className="font-semibold">{item.product.name}</div>
                        <div className="text-[10px] text-muted-foreground">₹{item.product.price} × {item.qty}</div>
                      </div>
                      <div className="font-bold">₹{item.product.price * item.qty}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="text-sm space-y-1 border-t border-border pt-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Shipping:</span>
                  <span>₹{selectedOrder.shipping}</span>
                </div>
                <div className="flex justify-between font-bold text-primary text-base pt-1">
                  <span>Total Amount:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="text-xs space-y-1 bg-muted/40 p-3 rounded-xl font-mono text-muted-foreground">
                <div>Method: {selectedOrder.paymentMethod}</div>
                <div>Status: {selectedOrder.paymentStatus}</div>
                {selectedOrder.razorpayOrderId && <div>Rzp Order: {selectedOrder.razorpayOrderId}</div>}
                {selectedOrder.razorpayPaymentId && <div>Rzp Pay: {selectedOrder.razorpayPaymentId}</div>}
              </div>

              {/* Status Manager */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update Status</label>
                <div className="flex gap-2">
                  <select
                    disabled={updatingId !== null}
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="flex-1 h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-muted-foreground">
              Select an order from the list to view billing information, products, and update shipment status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, Icon, color }: { title: string; value: any; desc: string; Icon: any; color: string }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-soft flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <div className="font-display text-3xl font-bold mt-1 text-foreground">{value}</div>
        <span className="text-xs text-muted-foreground mt-0.5 block">{desc}</span>
      </div>
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
