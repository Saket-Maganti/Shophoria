import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, email, address, discount, couponCode, total } = req.body;

    console.log("Creating Stripe session for:", email);
    console.log("Items:", items);
    console.log("Discount:", discount, "Coupon:", couponCode);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Stripe requires amount in cents
        },
        quantity: item.quantity || 1,
      })),
      metadata: {
        address: address || "",
        couponCode: couponCode || "",
        discount: discount?.toString() || "0",
        total: total?.toString() || "0",
      },
      mode: "payment",
      success_url: "https://shophoria-six.vercel.app/success",
      cancel_url: "https://shophoria-six.vercel.app/cancel",
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
}
