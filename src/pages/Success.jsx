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

function Success() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing your order...");

  useEffect(() => {
    const orderFromStorage = localStorage.getItem("last_order");

    const saveOrder = async () => {
      if (!user || !orderFromStorage) return;

      const order = JSON.parse(orderFromStorage);

      try {
        // 1. Save the order
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

        // 2. Auto-decrement quantity for each product
        for (const item of order.items || []) {
          const productRef = doc(db, "products", item.id);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const currentQty = productSnap.data().quantity || 0;
            const newQty = Math.max(0, currentQty - (item.quantity || 1));
            await updateDoc(productRef, { quantity: newQty });
          }
        }

        // 3. Clear local storage and trigger cart UI update
        localStorage.removeItem("marketverse_cart");
        localStorage.removeItem("last_order");

        const event = new Event("cartUpdated");
        window.dispatchEvent(event);

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
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-green-600 mb-4">🎉 Thank you from Shophoria!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{message}</p>
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
