import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getCart } from "../utils/cartUtils";
import { getWishlist } from "../utils/wishlistUtils";
import { Moon, Sun } from "lucide-react";

function Navbar() {
  const { user, isAdmin, userName } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCart().length);
      setWishlistCount(getWishlist().length);
    };

    updateCounts();
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);
    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight"
        >
          Shophoria
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link to="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                🛒 Cart ({cartCount})
              </Link>

              <Link to="/wishlist" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                ❤️ Wishlist ({wishlistCount})
              </Link>

              <Link to="/orders" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Orders
              </Link>

              <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                👤 My Profile
              </Link>

              {isAdmin && (
                <Link to="/admin" className="text-red-600 hover:text-red-500 font-semibold">
                  Admin
                </Link>
              )}

              <span className="hidden sm:inline text-gray-600 dark:text-gray-300">
                👋 {userName}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Login
              </Link>
              <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Register
              </Link>
              <Link to="/admin-login" className="text-red-500 hover:text-red-600">
                Admin Login
              </Link>
            </>
          )}

          {/* 🌗 Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
