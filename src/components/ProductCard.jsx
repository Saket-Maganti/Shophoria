import { Link } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import { addToWishlist } from "../utils/wishlistUtils";
import { useAuth } from "../context/AuthContext";
import { Heart, ShoppingCart } from "lucide-react";

function ProductCard({ product }) {
  const { user } = useAuth();

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart`);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      alert("Please login to use wishlist.");
      return;
    }
    addToWishlist(product);
    alert(`${product.name} added to wishlist`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition overflow-hidden border dark:border-gray-700">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-48 object-cover transition-transform hover:scale-105"
        />
        <div className="p-4 space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
          <p className="text-green-600 dark:text-green-400 font-bold text-base">
            ${parseFloat(product.price).toFixed(2)}
          </p>

          {/* Quantity Info */}
          {product.quantity === 0 ? (
            <p className="text-red-600 font-semibold">🚫 Out of Stock</p>
          ) : product.quantity < 10 ? (
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              Only {product.quantity} left in stock
            </p>
          ) : null}
        </div>
      </Link>

      {/* Buttons */}
      <div className="flex justify-between items-center px-4 py-3 border-t dark:border-gray-600">
        <button
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
            product.quantity === 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
        <button
          onClick={handleAddToWishlist}
          disabled={product.quantity === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
            product.quantity === 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-pink-600 hover:bg-pink-700 text-white"
          }`}
        >
          <Heart size={16} /> Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
