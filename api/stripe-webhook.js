import Stripe from "stripe";
import { buffer } from "micro";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase init
const firebaseConfig = { /* your config here */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Required for Stripe
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      await addDoc(collection(db, "orders"), {
        userId: session.client_reference_id || "",
        email: session.customer_email,
        products: [], // you'd need to map this in metadata
        total: session.amount_total / 100,
        address: session.metadata?.address || "",
        discount: session.metadata?.discount || "0",
        couponCode: session.metadata?.couponCode || "",
        createdAt: serverTimestamp(),
      });

      return res.status(200).end("Order saved!");
    } catch (error) {
      console.error("Firestore error:", error);
      return res.status(500).end("Failed to save order.");
    }
  }

  res.status(200).end("Event received");
}
