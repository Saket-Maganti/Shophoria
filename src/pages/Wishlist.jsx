import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../utils/wishlistUtils";
import { addToCart } from "../utils/cartUtils";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetch = () => setWishlist(getWishlist());
    fetch();
    window.addEventListener("wishlistUpdated", fetch);
    return () => window.removeEventListener("wishlistUpdated", fetch);
  }, []);

  const handleRemove = (id) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
    alert("Moved to cart!");
    setWishlist(getWishlist());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-pink-600 dark:text-pink-400">❤️ Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between border rounded-lg p-4 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border dark:border-gray-700"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">${item.price}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm"
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
