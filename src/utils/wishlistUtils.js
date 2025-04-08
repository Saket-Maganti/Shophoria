import { getAuth } from "firebase/auth";

const WISHLIST_KEY = (uid) => `shophoria_wishlist_${uid || "guest"}`;

const getUserKey = () => {
  const user = getAuth().currentUser;
  return WISHLIST_KEY(user?.uid);
};

export const getWishlist = () => {
  const stored = localStorage.getItem(getUserKey());
  return stored ? JSON.parse(stored) : [];
};

export const addToWishlist = (product) => {
  if (!product?.id) return;

  const key = getUserKey();
  const wishlist = getWishlist();
  const exists = wishlist.some(item => item.id === product.id);
  if (exists) return;
  const updated = [...wishlist, product];
  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const removeFromWishlist = (productId) => {
  const key = getUserKey();
  const updated = getWishlist().filter(item => item.id !== productId);
  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const clearWishlist = () => {
  const key = getUserKey();
  localStorage.removeItem(key);
  window.dispatchEvent(new Event("wishlistUpdated"));
};
