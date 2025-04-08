import { useEffect, useState, useCallback } from "react";
import { getWishlist, removeFromWishlist } from "../utils/wishlistUtils";
import { addToCart } from "../utils/cartUtils";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = useCallback(() => {
    const raw = getWishlist();
    const updated = raw.map(item => ({
      ...item,
      quantity: item.quantity ?? 1,
      stock: item.stock ?? item.quantity ?? 1,
    }));
    setWishlist(updated);
  }, []);

  useEffect(() => {
    fetchWishlist();
    window.addEventListener("wishlistUpdated", fetchWishlist);
    return () => window.removeEventListener("wishlistUpdated", fetchWishlist);
  }, [fetchWishlist]);

  const handleRemove = (id) => {
    removeFromWishlist(id);
    fetchWishlist();
  };

  const handleMoveToCart = (item) => {
    if (item.stock === 0) return alert("Item is out of stock and cannot be added to cart.");
    addToCart(item);
    removeFromWishlist(item.id);
    alert("Moved to cart!");
    fetchWishlist();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-pink-600 dark:text-pink-400">❤️ Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map((item) => (
            <li key={item.id} className="flex items-center justify-between border rounded-lg p-4 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border dark:border-gray-700" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">${item.price}</p>
                  {item.stock === 0 && <p className="text-red-500 text-sm mt-1">🚫 Out of Stock</p>}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className={`px-4 py-1.5 rounded text-sm text-white ${item.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                  disabled={item.stock === 0}
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Wishlist;
