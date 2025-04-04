const CART_KEY = "marketverse_cart";

export const getCart = () => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const removeFromCart = (productId) => {
  const updated = getCart().filter(item => item.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const updateCartItem = (productId, quantity) => {
  const cart = getCart().map(item =>
    item.id === productId ? { ...item, quantity } : item
  );
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
};
