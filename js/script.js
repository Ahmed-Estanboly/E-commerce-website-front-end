const savedTheme = getSavedTheme();
document.documentElement.dataset.theme = savedTheme;

let products = [];
let productsReady;

initThemeToggle();
updateCartCount();

function addToCart(id) {
  const cart = getCart();
  const item = cart.find((product) => product.id === id);
  item ? item.quantity++ : cart.push({ id, quantity: 1 });
  setCart(cart);
  showCartToast("Product added to cart.");
}

document.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const cartButton = event.target.closest("[data-add-cart]");
  const removeCartButton = event.target.closest("[data-remove-cart]");

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    const favorites = getFavorites();
    const index = favorites.indexOf(id);
    index >= 0 ? favorites.splice(index, 1) : favorites.push(id);
    setFavorites(favorites);
    favoriteButton.textContent = favorites.includes(id) ? "♥" : "♡";

    if (document.querySelector("#favorite-products") && products.length) {
      renderFavoriteProducts(products, document.querySelector("#favorite-products"));
    }
  }

  if (cartButton) addToCart(Number(cartButton.dataset.addCart));

  if (removeCartButton) {
    const id = Number(removeCartButton.dataset.removeCart);
    setCart(getCart().filter((item) => item.id !== id));
    renderCart(products, cartList);
  }
});

const productList = document.querySelector("#product-list");
const featured = document.querySelector("#featured-products");
const favoriteProducts = document.querySelector("#favorite-products");
const details = document.querySelector("#product-details");
const reviews = document.querySelector("#product-reviews");
const cartList = document.querySelector("#cart-list");
const checkoutForm = document.querySelector("#checkout-form");
const orderSection = document.querySelector(".order");

const initializeApp = async () => {
  [productList, featured, favoriteProducts, details, reviews, cartList, orderSection].forEach(renderLoading);
  renderPreviousOrders();
  productsReady = getProducts();
  products = await productsReady;
  renderCategoryOptions(products);
  renderProductList(products, productList);
  renderFeaturedProducts(products, featured);
  renderFavoriteProducts(products, favoriteProducts);
  renderDetails(products, details);
  renderReviews(products, reviews);
  renderCart(products, cartList);
};

initializeApp();

if (checkoutForm)
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cart = getCart();
    if (!cart.length) {
      document.querySelector("#order-message").textContent =
        "Your cart is empty.";
      return;
    }

    await productsReady;

    const orderItems = cart
      .map((item) => {
        const product = products.find((entry) => entry.id === item.id);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean);

    if (!orderItems.length) {
      document.querySelector("#order-message").textContent =
        "Products are still loading. Please try again.";
      return;
    }

    const orders = getOrders();
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: orderItems,
      total: orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    };

    orders.unshift(newOrder);
    setOrders(orders);
    setCart([]);
    renderPreviousOrders();
    renderCart(products, cartList);
    document.querySelector("#order-message").textContent =
      "Thank you. Your order has been placed.";
    checkoutForm.reset();
  });
