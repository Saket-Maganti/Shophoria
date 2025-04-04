const WISHLIST_KEY = "marketverse_wishlist";

export const getWishlist = () => {
  const stored = localStorage.getItem(WISHLIST_KEY);
  const parsed = stored ? JSON.parse(stored) : [];
  console.log("📥 getWishlist →", parsed);
  return parsed;
};

export const addToWishlist = (product) => {
  const current = getWishlist();
  const exists = current.some(item => item.id === product.id);
  if (exists) {
    console.warn("⚠️ Product already in wishlist:", product.id);
    return;
  }
  const updated = [...current, product];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  console.log("❤️ addToWishlist →", updated);
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const removeFromWishlist = (productId) => {
  const updated = getWishlist().filter(item => item.id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  console.log("❌ removeFromWishlist →", updated);
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const clearWishlist = () => {
  localStorage.removeItem(WISHLIST_KEY);
  console.log("🧹 clearWishlist → done");
  window.dispatchEvent(new Event("wishlistUpdated"));
};
