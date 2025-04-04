import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getCart } from "../utils/cartUtils";
import CouponInput from "../components/CouponInput";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51R5OFBDF0jEtjyIaEJBPWpPesi2yrIoEv6vsbZ8B9RV6MmtkzoDsJwXr2DTUwoJZrVbUsZuuHpQaexPcRZ5x5EUg00j6fThUiu");

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );
  const finalTotal = (subtotal - discount).toFixed(2);

  const handleCouponApply = (couponData) => {
    setCoupon(couponData);
    let discountAmount = 0;

    if (couponData.type === "percentage") {
      discountAmount = (couponData.amount / 100) * subtotal;
    } else if (couponData.type === "flat") {
      discountAmount = couponData.amount;
    }

    if (couponData.minOrder && subtotal < couponData.minOrder) {
      alert(`Minimum order of $${couponData.minOrder} required for this coupon.`);
      setCoupon(null);
      setDiscount(0);
    } else {
      setDiscount(discountAmount);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) return alert("Please enter a shipping address");
    const user = auth.currentUser;
    if (!user || cartItems.length === 0) return;

    setLoading(true);

    try {
      const stripe = await stripePromise;
      const session = await axios.post(
        "/api/create-checkout-session",
        {
          items: cartItems,
          email: user.email,
          address,
          discount,
          couponCode: coupon?.code || null,
          total: parseFloat(finalTotal),
        }
      );
      await stripe.redirectToCheckout({ sessionId: session.data.id });
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      alert("Error creating Stripe checkout session.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">🧾 Checkout</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between py-3 text-gray-800 dark:text-gray-200"
                >
                  <span>{item.name} × {item.quantity || 1}</span>
                  <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Subtotal: <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <CouponInput onApply={handleCouponApply} />

            {discount > 0 && (
              <p className="text-green-600 font-semibold mt-2">
                Discount: -${discount.toFixed(2)} ({coupon?.code})
              </p>
            )}

            <p className="mt-4 mb-6 text-lg font-bold text-indigo-700 dark:text-indigo-400">
              Total: ${finalTotal}
            </p>

            <textarea
              placeholder="Shipping Address"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-900 dark:text-white mb-4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
            >
              {loading ? "Redirecting to Payment..." : "💳 Pay with Stripe"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
