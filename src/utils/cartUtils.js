import { getAuth } from "firebase/auth";

const CART_KEY = (uid) => `shophoria_cart_${uid || "guest"}`;

const getUserKey = () => {
  const user = getAuth().currentUser;
  return CART_KEY(user?.uid);
};

export const getCart = () => {
  const stored = localStorage.getItem(getUserKey());
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (product) => {
  if (!product?.id) return;

  const key = getUserKey();
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const removeFromCart = (productId) => {
  const key = getUserKey();
  const updated = getCart().filter(item => item.id !== productId);
  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const updateCartItem = (productId, quantity) => {
  const key = getUserKey();
  const cart = getCart().map(item =>
    item.id === productId ? { ...item, quantity } : item
  );
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const clearCart = () => {
  const key = getUserKey();
  localStorage.removeItem(key);
  window.dispatchEvent(new Event("cartUpdated"));
};
