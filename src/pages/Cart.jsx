import {
  getCart,
  clearCart,
  removeFromCart,
  updateCartItem,
} from "../utils/cartUtils";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = () => setItems(getCart());
    fetch();
    window.addEventListener("cartUpdated", fetch);
    return () => window.removeEventListener("cartUpdated", fetch);
  }, []);

  const handleQtyChange = (id, quantity) => {
    if (quantity <= 0) return;
    updateCartItem(id, quantity);
    setItems(getCart());
  };

  const getTotal = () =>
    items
      .reduce((total, item) => total + item.quantity * parseFloat(item.price), 0)
      .toFixed(2);

  const handleClear = () => {
    clearCart();
    setItems([]);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setItems(getCart());
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      alert("Please login to proceed to checkout.");
      return;
    }

    const order = {
      items,
      total: parseFloat(getTotal()),
    };

    localStorage.setItem("last_order", JSON.stringify(order));
    navigate("/checkout");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">🛒 Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center border p-4 rounded dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-700 text-xl font-semibold rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="text-gray-800 dark:text-white">{item.quantity}</span>
                    <button
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-700 text-xl font-semibold rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                  🗑 Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t pt-6 dark:border-gray-700">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                Total:{" "}
                <span className="text-green-600 dark:text-green-400">
                  ${getTotal()}
                </span>
              </p>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleClear}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded"
                >
                  🧹 Clear Cart
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded"
                >
                  ✅ Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
