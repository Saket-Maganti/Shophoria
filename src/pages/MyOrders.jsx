import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const orderList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">You have no orders yet.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map(order => {
            const items = order.products || order.items || [];
            const total = parseFloat(order.total || 0).toFixed(2);
            const discount = order.discount || 0;
            const couponCode = order.couponCode || "—";
            const address = order.address || "Not Provided";

            return (
              <li
                key={order.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-800 dark:text-white font-medium">
                    Order ID: <span className="font-mono text-sm">{order.id}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {order.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <p><strong>Total:</strong> ${total}</p>
                  <p><strong>Discount:</strong> ${parseFloat(discount).toFixed(2)}</p>
                  <p><strong>Coupon:</strong> {couponCode}</p>
                  <p><strong>Shipping Address:</strong> {address}</p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold text-gray-800 dark:text-white mb-2">Items:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {items.map((item, index) => (
                      <li key={index}>
                        {item.name} × {item.quantity || 1} — ${parseFloat(item.price).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/invoice/${order.id}`}
                    className="inline-block text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
                  >
                    📄 View Invoice
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MyOrders;
