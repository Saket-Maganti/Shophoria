import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { addToCart } from "../utils/cartUtils";
import { addToWishlist } from "../utils/wishlistUtils";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

function ProductDetails() {
  const { id } = useParams();
  const { user, userName } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [userReviewId, setUserReviewId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    };

    const fetchReviews = async () => {
      const ref = collection(db, "reviews");
      const q = query(ref, where("productId", "==", id));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);

      if (user) {
        const existing = data.find(r => r.userId === user.uid);
        if (existing) {
          setReviewText(existing.text);
          setRating(existing.rating);
          setUserReviewId(existing.id);
        }
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id, user]);

  const handleAddReview = async () => {
    if (!user) return alert("Login to add a review");
    if (!reviewText.trim()) return;

    const reviewData = {
      productId: id,
      userId: user.uid,
      userName,
      text: reviewText,
      rating,
      createdAt: new Date()
    };

    if (userReviewId) {
      await updateDoc(doc(db, "reviews", userReviewId), reviewData);
      alert("Review updated!");
    } else {
      await addDoc(collection(db, "reviews"), reviewData);
      alert("Review added!");
    }

    setReviewText("");
    setRating(5);
    setUserReviewId(null);
    const snap = await getDocs(query(collection(db, "reviews"), where("productId", "==", id)));
    setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDeleteReview = async () => {
    if (!userReviewId) return;
    await deleteDoc(doc(db, "reviews", userReviewId));
    setReviewText("");
    setRating(5);
    setUserReviewId(null);
    const snap = await getDocs(query(collection(db, "reviews"), where("productId", "==", id)));
    setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    alert("Review deleted.");
  };

  if (!product) return <p className="p-6 text-gray-600 dark:text-gray-300">Loading...</p>;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg shadow-lg"
        />

        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{product.category}</p>
          <p className="text-green-600 dark:text-green-400 font-bold text-2xl mb-3">${product.price}</p>

          {avgRating && (
            <p className="text-yellow-500 font-medium mb-3">
              ⭐ {avgRating} avg rating ({reviews.length} reviews)
            </p>
          )}

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
              onClick={() => {
                addToCart(product);
                alert("Added to cart!");
              }}
            >
              🛒 Add to Cart
            </button>
            <button
              className="bg-pink-600 text-white px-5 py-2 rounded-lg shadow hover:bg-pink-700"
              onClick={() => {
                if (!user) return alert("Please login to use wishlist");
                addToWishlist(product);
                alert("Added to wishlist!");
              }}
            >
              ❤️ Wishlist
            </button>
          </div>
        </div>
      </motion.div>

      {/* ⭐ Review Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">📝 Product Reviews</h3>

        {user && (
          <div className="mb-6 space-y-3">
            <textarea
              rows={3}
              placeholder="Write your review..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 dark:bg-gray-900 dark:text-white"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex items-center gap-3 flex-wrap">
              <select
                className="border dark:bg-gray-900 dark:text-white px-3 py-1 rounded"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                ))}
              </select>
              <button
                onClick={handleAddReview}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {userReviewId ? "Update Review" : "Submit Review"}
              </button>
              {userReviewId && (
                <button
                  onClick={handleDeleteReview}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No reviews yet. Be the first to review!</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded shadow">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                  <span className="text-yellow-500 font-medium">⭐ {review.rating}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
