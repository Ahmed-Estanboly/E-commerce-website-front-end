const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.dataset.theme = savedTheme;

const products = [
  {
    id: 1,
    name: "Classic White Sneaker",
    category: "Shoes",
    price: 65,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
  {
    id: 2,
    name: "Leather Travel Bag",
    category: "Bags",
    price: 90,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
  },
  {
    id: 3,
    name: "Minimal Watch",
    category: "Accessories",
    price: 75,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600",
  },
  {
    id: 4,
    name: "Cotton Casual Shirt",
    category: "Clothing",
    price: 40,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
  },
  {
    id: 5,
    name: "Everyday Sunglasses",
    category: "Accessories",
    price: 35,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
  },
  {
    id: 6,
    name: "Running Shoes",
    category: "Shoes",
    price: 80,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
];

const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const setCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));
const getFavorites = () =>
  JSON.parse(localStorage.getItem("favorites") || "[]");

const themeToggle = document.querySelector("#theme-toggle");
if (themeToggle) {
  const updateThemeButton = () => {
    themeToggle.textContent =
      document.documentElement.dataset.theme === "dark"
        ? "Light mode"
        : "Dark mode";
  };
  updateThemeButton();
  themeToggle.addEventListener("click", () => {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    updateThemeButton();
  });
}

const productCard = (product) =>
  `<article class="product-card"><img src="${product.image}" alt="${product.name}"><div class="product-info"><button class="favorite-button" data-favorite="${product.id}">${getFavorites().includes(product.id) ? "♥" : "♡"}</button><h3>${product.name}</h3><p>${product.category}</p><p class="price">$${product.price}</p><div class="product-actions"><button class="button" type="button" data-add-cart="${product.id}">Add to Cart</button><a class="button button-outline" href="productDetails.html?id=${product.id}">View Details</a></div></div></article>`;
const renderProducts = (list, element) => {
  element.innerHTML = list.length
    ? list.map(productCard).join("")
    : '<p class="empty">No products found.</p>';
};

function addToCart(id) {
  const cart = getCart();
  const item = cart.find((product) => product.id === id);
  item ? item.quantity++ : cart.push({ id, quantity: 1 });
  setCart(cart);
  alert("Product added to cart.");
}

document.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const cartButton = event.target.closest("[data-add-cart]");
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    const favorites = getFavorites();
    const index = favorites.indexOf(id);
    index >= 0 ? favorites.splice(index, 1) : favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    favoriteButton.textContent = favorites.includes(id) ? "♥" : "♡";
  }
  if (cartButton) addToCart(Number(cartButton.dataset.addCart));
});

const productList = document.querySelector("#product-list");
if (productList) {
  const search = document.querySelector("#search");
  const category = document.querySelector("#category");
  const sort = document.querySelector("#sort");
  const update = () => {
    let list = products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.value.toLowerCase()) &&
        (!category.value || product.category === category.value),
    );
    if (sort.value === "low") list.sort((a, b) => a.price - b.price);
    if (sort.value === "high") list.sort((a, b) => b.price - a.price);
    renderProducts(list, productList);
  };
  [search, category, sort].forEach((input) =>
    input.addEventListener("input", update),
  );
  update();
}

const featured = document.querySelector("#featured-products");
if (featured) renderProducts(products.slice(0, 4), featured);

const details = document.querySelector("#product-details");
if (details) {
  const product =
    products.find(
      (item) =>
        item.id === Number(new URLSearchParams(location.search).get("id")),
    ) || products[0];
  details.innerHTML = `<div class="product-card"><img src="${product.image}" alt="${product.name}"></div><div class="form-box"><h1>${product.name}</h1><p>${product.category}</p><p class="price">$${product.price}</p><p>A practical, high-quality product made for everyday use.</p><button class="button" data-add-cart="${product.id}">Add to Cart</button></div>`;
}

const cartList = document.querySelector("#cart-list");
if (cartList) {
  const items = getCart().map((item) => ({
    ...products.find((product) => product.id === item.id),
    quantity: item.quantity,
  }));
  cartList.innerHTML = items.length
    ? items
        .map(
          (item) =>
            `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>$${item.price} each</p><input class="quantity" type="number" min="1" value="${item.quantity}" data-quantity="${item.id}"></div><strong>$${item.price * item.quantity}</strong></div>`,
        )
        .join("")
    : '<p class="empty">Your cart is empty.</p>';
  document.querySelector("#cart-total").textContent =
    `$${items.reduce((sum, item) => sum + item.price * item.quantity, 0)}`;
  cartList.addEventListener("change", (event) => {
    if (!event.target.matches("[data-quantity]")) return;
    const cart = getCart();
    const item = cart.find(
      (product) => product.id === Number(event.target.dataset.quantity),
    );
    if (item) item.quantity = Math.max(1, Number(event.target.value));
    setCart(cart);
    location.reload();
  });
}

const checkoutForm = document.querySelector("#checkout-form");
if (checkoutForm)
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.removeItem("cart");
    document.querySelector("#order-message").textContent =
      "Thank you. Your order has been placed.";
    checkoutForm.reset();
  });
