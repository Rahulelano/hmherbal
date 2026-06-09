import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { sendOrderEmail } from "../utils/emailService.js";

const router = express.Router();

// Initialize Razorpay
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create a new order (COD or online)
// @route   POST /api/orders
// @access  Public
router.post("/", async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    address,
    city,
    state,
    zipCode,
    items,
    paymentMethod,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  try {
    // 1. Calculate prices using current DB prices (safer)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findOne({ slug: item.product.slug });
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.product.name} not found` });
      }

      const price = dbProduct.price;
      subtotal += price * item.qty;

      validatedItems.push({
        product: {
          id: dbProduct._id.toString(),
          name: dbProduct.name,
          price: price,
          image: dbProduct.image,
          slug: dbProduct.slug,
        },
        qty: item.qty,
      });

      // Deduct stock if needed (optional, let's decrease slightly)
      dbProduct.stock = Math.max(0, dbProduct.stock - item.qty);
      await dbProduct.save();
    }

    const shipping = subtotal > 499 ? 0 : 49;
    const total = subtotal + shipping;

    // 2. Create local order
    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      zipCode,
      items: validatedItems,
      subtotal,
      shipping,
      total,
      paymentMethod,
      paymentStatus: "Pending",
    });

    if (paymentMethod === "COD") {
      // Direct save and trigger emails
      const savedOrder = await order.save();
      await sendOrderEmail(savedOrder);
      return res.status(201).json({ success: true, order: savedOrder });
    } else if (paymentMethod === "Razorpay") {
      const rzp = getRazorpayInstance();
      const options = {
        amount: Math.round(total * 100), // Amount in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      const rzpOrder = await rzp.orders.create(options);
      
      // Store Razorpay order id
      order.razorpayOrderId = rzpOrder.id;
      const savedOrder = await order.save();

      return res.status(201).json({
        success: true,
        order: savedOrder,
        rzpOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify Razorpay online payment signature
// @route   POST /api/orders/verify
// @access  Public
router.post("/verify", async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  try {
    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpaySignature) {
      order.paymentStatus = "Paid";
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      const updatedOrder = await order.save();

      // Trigger success emails
      await sendOrderEmail(updatedOrder);

      res.json({ success: true, order: updatedOrder });
    } else {
      order.paymentStatus = "Failed";
      await order.save();
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Order verification error:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
router.get("/", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order shipping/delivery status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
router.put("/:id/status", protectAdmin, async (req, res) => {
  const { orderStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      
      // Update payment status to paid if order is marked delivered and was COD
      if (orderStatus === "Delivered" && order.paymentMethod === "COD") {
        order.paymentStatus = "Paid";
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get order details publicly (for order success screen)
// @route   GET /api/orders/public/:id
// @access  Public
router.get("/public/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
