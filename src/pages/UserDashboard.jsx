import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getCart } from "../utils/cartUtils";
import { getWishlist } from "../utils/wishlistUtils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function UserDashboard() {
  const { user, userName } = useAuth();
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]); // Added coupons state
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    const fetchOrdersReviewsAndCoupons = async () => {
      if (!user) return;

      const orderQ = query(collection(db, "orders"), where("userId", "==", user.uid));
      const orderSnap = await getDocs(orderQ);
      const orderList = orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));

      const reviewQ = query(collection(db, "reviews"), where("userId", "==", user.uid));
      const reviewSnap = await getDocs(reviewQ);
      const reviewList = reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewList);

      // Fetch coupons (assuming global coupons for simplicity; adjust query if user-specific)
      const couponSnap = await getDocs(collection(db, "coupons"));
      const couponList = couponSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCoupons(couponList);
    };

    setCartCount(getCart().length);
    setWishlistCount(getWishlist().length);
    fetchOrdersReviewsAndCoupons();
  }, [user]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteDoc(doc(db, "reviews", reviewId));
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    alert("Review deleted successfully.");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        👤 Welcome, {userName}
      </h1>

      {/* Section Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveSection("profile")}
          className={`px-4 py-2 rounded ${activeSection === "profile" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveSection("orders")}
          className={`px-4 py-2 rounded ${activeSection === "orders" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveSection("reviews")}
          className={`px-4 py-2 rounded ${activeSection === "reviews" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveSection("rewards")}
          className={`px-4 py-2 rounded ${activeSection === "rewards" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
        >
          Rewards
        </button>
      </div>

      {activeSection === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 border rounded shadow p-4 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Profile Info</h2>
            <p className="text-gray-700 dark:text-gray-300">📧 {user?.email}</p>
            <p className="text-gray-700 dark:text-gray-300">🧍 {userName}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border rounded shadow p-4 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
            <p className="text-gray-700 dark:text-gray-300">🛒 Items in Cart: {cartCount}</p>
            <p className="text-gray-700 dark:text-gray-300">❤️ Wishlist Items: {wishlistCount}</p>
          </div>
        </motion.div>
      )}

      {activeSection === "orders" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-white dark:bg-gray-800 border rounded shadow p-4 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">🧾 Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">You have no recent orders.</p>
          ) : (
            <ul className="space-y-4">
              {orders.slice(0, 3).map((order) => {
                const total = parseFloat(order.total || 0);
                return (
                  <li key={order.id} className="border-b pb-2 border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Order ID:</span> {order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date: {order.createdAt?.toDate().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total: ${total.toFixed(2)}</p>
                    {order.status && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Status: {order.status}</p>
                    )}
                    {order.couponCode && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Coupon Used: <span className="font-mono">{order.couponCode}</span></p>
                    )}
                    <Link to={`/invoice/${order.id}`} className="text-indigo-600 hover:underline text-sm">
                      View Invoice →
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.div>
      )}

      {activeSection === "reviews" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white dark:bg-gray-800 border rounded shadow p-4 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">📝 My Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">You haven't written any reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review.id} className="border-b pb-2 border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Product:</span> {review.productId}</p>
                  <p className="text-gray-700 dark:text-gray-300">⭐ Rating: {review.rating}</p>
                  <p className="text-gray-600 dark:text-gray-400">{review.text}</p>
                  <div className="mt-2 space-x-2">
                    <Link to={`/product/${review.productId}`} className="text-indigo-600 hover:underline text-sm">Edit Review</Link>
                    <button onClick={() => handleDeleteReview(review.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      {activeSection === "rewards" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }} // Slightly longer delay for visual hierarchy
          className="mt-6 bg-white dark:bg-gray-800 border rounded shadow p-4 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">🎁 My Rewards</h2>
          {coupons.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No rewards available right now.</p>
          ) : (
            <ul className="space-y-4">
              {coupons.map((coupon) => (
                <li key={coupon.id} className="border-b pb-2 border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Code:</span> <span className="font-mono">{coupon.code}</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Type:</span> {coupon.type}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Amount:</span> {coupon.amount}{coupon.type === "percentage" ? "%" : "$"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Min Order:</span> ${coupon.minOrder || 0}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Expires:</span> {coupon.expiresAt || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default UserDashboard;