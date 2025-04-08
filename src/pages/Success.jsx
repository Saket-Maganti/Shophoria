import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { clearCart } from "../utils/cartUtils";

function Success() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing your order...");
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    const orderFromStorage = localStorage.getItem("last_order");

    const saveOrder = async () => {
      if (!user || !orderFromStorage) return;

      const order = JSON.parse(orderFromStorage);

      try {
        // Save the order
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          email: user.email,
          products: order.items || [],
          total: order.total || 0,
          address: order.address || "N/A",
          discount: order.discount || 0,
          couponCode: order.couponCode || "",
          createdAt: serverTimestamp(),
        });

        // Auto-decrement product quantity
        for (const item of order.items || []) {
          const productRef = doc(db, "products", item.id);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const currentQty = productSnap.data().quantity || 0;
            const newQty = Math.max(0, currentQty - (item.quantity || 1));
            await updateDoc(productRef, { quantity: newQty });
          }
        }

        clearCart();
        localStorage.removeItem("last_order");

        setOrderSummary(order);
        setMessage("✅ Payment successful! Your order has been placed.");
      } catch (err) {
        console.error("Error saving order:", err);
        setMessage("⚠️ Payment succeeded but failed to save your order.");
      }
    };

    saveOrder();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-green-600 mb-4">🎉 Thank you from Shophoria!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{message}</p>

        {orderSummary && (
          <div className="text-left text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-bold mb-2">🧾 Order Summary:</h2>
            <ul className="mb-3">
              {orderSummary.items.map((item, index) => (
                <li key={index} className="flex justify-between mb-1">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {orderSummary.discount > 0 && (
              <p className="text-green-600 font-medium">
                Discount: -${orderSummary.discount.toFixed(2)} ({orderSummary.couponCode})
              </p>
            )}
            <p className="font-semibold text-indigo-600 mt-1">Total Paid: ${orderSummary.total.toFixed(2)}</p>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded"
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}

export default Success;
