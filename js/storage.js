const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const setCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount?.();
};
const getFavorites = () =>
  JSON.parse(localStorage.getItem("favorites") || "[]");
const setFavorites = (favorites) =>
  localStorage.setItem("favorites", JSON.stringify(favorites));
const getSavedTheme = () => localStorage.getItem("theme") || "light";
const setSavedTheme = (theme) => localStorage.setItem("theme", theme);
const getOrders = () => JSON.parse(localStorage.getItem("orders") || "[]");
const setOrders = (orders) =>
  localStorage.setItem("orders", JSON.stringify(orders));
