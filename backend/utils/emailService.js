import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true, // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendOrderEmail = async (order) => {
  try {
    const transporter = createTransporter();

    const itemsListHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">₹${item.product.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">₹${item.product.price * item.qty}</td>
      </tr>
    `
      )
      .join("");

    const emailContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px;">H.M HERBAL WORLD</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.85;">Traditional Wellness from Thirupathur</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px; background-color: #ffffff; color: #334155;">
          <h2 style="margin-top: 0; color: #1b4332; font-size: 20px;">Thank you for your order!</h2>
          <p style="font-size: 14px; line-height: 1.6;">Dear <strong>${order.customerName}</strong>, we have received your order and are processing it with care at our Thirupathur workshop. Below are your order details.</p>

          <!-- Order Summary Info -->
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; font-size: 14px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Order ID:</td>
                <td style="padding: 4px 0; font-weight: bold; text-align: right;">#${order._id}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Payment Method:</td>
                <td style="padding: 4px 0; font-weight: bold; text-align: right;">${order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment (Razorpay)"}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Payment Status:</td>
                <td style="padding: 4px 0; font-weight: bold; text-align: right; color: ${order.paymentStatus === "Paid" ? "#15803d" : "#b45309"};">${order.paymentStatus}</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <h3 style="color: #1b4332; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 25px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f1f5f9; color: #475569; text-align: left;">
                <th style="padding: 10px;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Subtotal:</td>
                <td style="padding: 4px 0; text-align: right;">₹${order.subtotal}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b;">Shipping:</td>
                <td style="padding: 4px 0; text-align: right;">${order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</td>
              </tr>
              <tr style="font-size: 16px; font-weight: bold; color: #1b4332;">
                <td style="padding: 8px 0 0 0; border-top: 1px solid #cbd5e1;">Grand Total:</td>
                <td style="padding: 8px 0 0 0; text-align: right; border-top: 1px solid #cbd5e1;">₹${order.total}</td>
              </tr>
            </table>
          </div>

          <!-- Shipping Details -->
          <h3 style="color: #1b4332; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px;">Shipping Details</h3>
          <div style="font-size: 14px; line-height: 1.6; background-color: #f8fafc; border-radius: 12px; padding: 20px;">
            <strong>${order.customerName}</strong><br />
            ${order.address},<br />
            ${order.city}, ${order.state} - ${order.zipCode}<br />
            Phone: ${order.customerPhone}<br />
            Email: ${order.customerEmail}
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 5px 0;">H.M Herbal World, Thirupathur, Tamil Nadu, India</p>
          <p style="margin: 0;">For queries, contact us on WhatsApp/Phone at +91-9442177186</p>
        </div>
      </div>
    `;

    // 1. Send confirmation to the Customer
    const mailOptionsCustomer = {
      from: `"H.M Herbal World" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation #${order._id} - H.M Herbal World`,
      html: emailContent,
    };
    await transporter.sendMail(mailOptionsCustomer);
    console.log(`Email successfully sent to customer: ${order.customerEmail}`);

    // 2. Send notification to the Admin
    const mailOptionsAdmin = {
      from: `"HMHW E-Commerce System" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || "hmherbalworld1998@gmail.com",
      subject: `[New Order Alert] Order #${order._id} placed by ${order.customerName}`,
      html: `
        <div style="padding: 10px; background-color: #fee2e2; border: 1px solid #f87171; border-radius: 8px; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 14px;">
          <strong>Attention Admin:</strong> A new order has been placed on H.M Herbal World. Please review the details below to pack and ship.
        </div>
        ${emailContent}
      `,
    };
    await transporter.sendMail(mailOptionsAdmin);
    console.log(`Order notification successfully sent to admin: ${process.env.ADMIN_EMAIL}`);
  } catch (error) {
    console.error("Failed to send order emails:", error);
  }
};
