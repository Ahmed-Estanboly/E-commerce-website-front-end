const productCard = (product) => `
  <article class="product-card">
    <img src="${product.image}" alt="${product.name}">
    <div class="product-info">
      <button class="favorite-button" data-favorite="${product.id}">${getFavorites().includes(product.id) ? "♥" : "♡"}</button>
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <p class="price">$${product.price}</p>
      <div class="product-actions">
        <button class="button" type="button" data-add-cart="${product.id}">Add to Cart</button>
        <a class="button button-outline" href="productDetails.html?id=${product.id}">View Details</a>
      </div>
    </div>
  </article>`;

const updateCartCount = () => {
  const cartCount = document.querySelector("[data-cart-count]");
  if (!cartCount) return;

  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
  cartCount.hidden = count === 0;
};

const renderLoading = (element) => {
  if (!element) return;

  element.innerHTML = `
    <div class="loading-state" role="status" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true"></span>
      <span>Loading products...</span>
    </div>
  `;
};

const renderProducts = (list, element) => {
  if (!element) return;
  element.innerHTML = list.length
    ? list.map(productCard).join("")
    : '<p class="empty">No products found.</p>';
};

const showCartToast = (message) => {
  const existingToast = document.querySelector(".cart-toast");
  existingToast?.remove();

  const toast = document.createElement("div");
  toast.className = "cart-toast";
//   toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);

  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 220);
  }, 2200);
};

const renderFeaturedProducts = (products, featuredElement) => {
  if (featuredElement) renderProducts(products.slice(0, 4), featuredElement);
};

const renderFavoriteProducts = (products, favoriteElement) => {
  if (!favoriteElement) return;

  const favoriteProducts = products.filter((product) =>
    getFavorites().includes(product.id),
  );

  favoriteElement.innerHTML = favoriteProducts.length
    ? favoriteProducts.map(productCard).join("")
    : '<p class="empty">No favorite products yet. Tap the heart on any item to save it here.</p>';
};

const renderDetails = (products, detailsElement) => {
  if (!detailsElement) return;

  const product =
    products.find(
      (item) => item.id === Number(new URLSearchParams(location.search).get("id")),
    ) || products[0];

  if (!product) {
    detailsElement.innerHTML = '<p class="empty">Product not found.</p>';
    return;
  }

  detailsElement.innerHTML = `
    <div class="product-card details-image-card">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="form-box">
      <h1>${product.name}</h1>
      <p>${product.category}</p>
      <div class="product-details-meta">
        <p class="product-rating"><span aria-hidden="true">&#9733;</span> ${product.rating?.toFixed(1) || "N/A"} / 5</p>
        <p class="product-warranty">Warranty: ${product.warranty || "No Warranty available"}</p>
      </div>
      <p class="price">$${product.price}</p>
      <p>${product.description || "No Description Found."}</p>
      <button class="button" type="button" data-add-cart="${product.id}">Add to Cart</button>
    </div>
  `;
};

const renderReviews = (products, reviewsElement) => {
  if (!reviewsElement) return;

  const product =
    products.find(
      (item) => item.id === Number(new URLSearchParams(location.search).get("id")),
    ) || products[0];

  if (!product || !product.reviews.length) {
    reviewsElement.innerHTML =
      '<p class="empty">No reviews available for this product.</p>';
    return;
  }

  reviewsElement.innerHTML = product.reviews
    .map(
      (review) => `
        <article class="review-item">
          <div class="review-header">
            <h3>${review.reviewerName || "Anonymous customer"}</h3>
            <span class="review-rating"><span aria-hidden="true">&#9733;</span> ${review.rating || "N/A"} / 5</span>
          </div>
          <p>${review.comment || "No comment provided."}</p>
          <time datetime="${review.date || ""}">${review.date ? new Date(review.date).toLocaleDateString() : ""}</time>
        </article>
      `,
    )
    .join("");
};

const renderCart = (products, cartListElement) => {
  if (!cartListElement) return;

  const items = getCart()
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  cartListElement.innerHTML = items.length
    ? items
        .map(
          (item) =>
            `<div class="cart-item">
              <img src="${item.image}" alt="${item.name}">
              <div>
              <h3>${item.name}</h3>
              <p>$${item.price} each</p>
              <input class="quantity" type="number" min="1" value="${item.quantity}" data-quantity="${item.id}">
              </div>
                <div class="cart-item-actions">
                  <strong>$${item.price * item.quantity}</strong>
                  <button class="remove-button" type="button" data-remove-cart="${item.id}">Remove</button>
                </div>
            </div>`,
        )
        .join("")
    : '<p class="empty">Your cart is empty.</p>';

  const totalEl = document.querySelector("#cart-total");
  if (totalEl) {
    totalEl.textContent = `$${items.reduce((sum, item) => sum + item.price * item.quantity, 0)}`;
  }
};

const renderPreviousOrders = () => {
  const orderSection = document.querySelector(".order");
  if (!orderSection) return;

  const orders = getOrders();

  if (!orders.length) {
    orderSection.innerHTML = "<h2>Previous Orders</h2><p>No previous orders yet.</p>";
    return;
  }

  orderSection.innerHTML = `
    <h2>Previous Orders</h2>
    <div class="orders-list">
      ${orders
        .map(
          (order) => `
            <div class="order-item">
              <p><strong>Order #${order.id}</strong> - ${new Date(order.date).toLocaleDateString()}</p>
              <p>${order.items
                .map((item) => `${item.name} x${item.quantity}`)
                .join("<br> ")}</p>
              <strong>Total: $${order.total}</strong>
              <hr>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
};

const renderCategoryOptions = (products) => {
  const categorySelect = document.querySelector("#category");
  if (!categorySelect) return;

  const categories = [...new Set(products.map((product) => product.category))].sort();
  categorySelect.innerHTML =
    '<option value="">All categories</option>' +
    categories.map((category) => `<option value="${category}">${category}</option>`).join("");
};

const renderPagination = (totalItems, currentPage, pageSize, onPageChange, element) => {
  if (!element) return;

  const pageCount = Math.ceil(totalItems / pageSize);
  if (pageCount <= 1) {
    element.innerHTML = "";
    return;
  }

  const pages = [1, 2];
  if (currentPage > 2) {
    pages.splice(0, pages.length, currentPage - 1, currentPage);
  }
  if (currentPage < pageCount && pageCount > 2) {
    pages.push("ellipsis", pageCount);
  }

  element.innerHTML = `
    <button class="pagination-button" type="button" data-pagination="previous" aria-label="Previous page"${currentPage === 1 ? " disabled" : ""}>Previous</button>
    ${pages
      .filter((page, index) => page !== "ellipsis" || pages[index - 1] !== "ellipsis")
      .map((page) =>
        page === "ellipsis"
          ? '<span class="pagination-ellipsis" aria-hidden="true">...</span>'
          : `<button class="pagination-button${page === currentPage ? " active" : ""}" type="button" data-page="${page}" aria-label="Go to page ${page}"${page === currentPage ? " aria-current=\"page\"" : ""}>${page}</button>`,
      )
      .join("")}
    <button class="pagination-button" type="button" data-pagination="next" aria-label="Next page"${currentPage === pageCount ? " disabled" : ""}>Next</button>
  `;

  element.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => onPageChange(Number(button.dataset.page)));
  });
  element.querySelector('[data-pagination="previous"]')?.addEventListener("click", () =>
    onPageChange(currentPage - 1),
  );
  element.querySelector('[data-pagination="next"]')?.addEventListener("click", () =>
    onPageChange(currentPage + 1),
  );
};

const renderProductList = (products, productListElement) => {
  if (!productListElement) return;

  const search = document.querySelector("#search");
  const category = document.querySelector("#category");
  const sort = document.querySelector("#sort");
  const pagination = document.querySelector("#product-pagination");
  const pageSize = 8;
  let currentPage = 1;

  const update = () => {
    if (!search || !category || !sort) return;

    let list = products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.value.toLowerCase()) &&
        (!category.value || product.category === category.value),
    );

    if (sort.value === "low") list.sort((a, b) => a.price - b.price);
    if (sort.value === "high") list.sort((a, b) => b.price - a.price);

    const pageCount = Math.max(1, Math.ceil(list.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * pageSize;
    renderProducts(list.slice(start, start + pageSize), productListElement);
    renderPagination(list.length, currentPage, pageSize, (page) => {
      currentPage = page;
      update();
    }, pagination);
  };

  [search, category, sort].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        currentPage = 1;
        update();
      });
      input.addEventListener("change", () => {
        currentPage = 1;
        update();
      });
    }
  });

  update();
};

const initThemeToggle = () => {
  const themeToggle = document.querySelector("#theme-toggle");
  if (!themeToggle) return;

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
    setSavedTheme(theme);
    updateThemeButton();
  });
};
