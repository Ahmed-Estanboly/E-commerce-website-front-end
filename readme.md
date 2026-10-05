# SHOPAHOLIC Store

A lightweight e-commerce storefront built as a static front-end application with vanilla JavaScript. The project pulls product data from the DummyJSON API, renders dynamic storefront pages, and stores cart, favorites, theme preferences, and previous orders in the browser using localStorage.

## Overview

SHOPAHOLIC is a demo online shopping experience designed to showcase:

- Product browsing with search, category filtering, and sorting
- Featured product modules and product detail pages
- Favorites management with save/unsave functionality
- Shopping cart with quantity updates and total calculation
- Checkout flow that records placed orders locally
- Dark/light theme switching
- Responsive storefront layout for desktop and smaller screens

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- DummyJSON public API
- Browser localStorage for persistence

## Project Architecture

This app follows a simple front-end architecture built around page-level rendering and shared utility modules.

### 1. Presentation Layer
Each HTML file represents a storefront page:

- `index.html` — landing page with hero section, featured products, and favorites
- `products.html` — full product catalog with filtering and pagination
- `productDetails.html` — detailed product information and reviews
- `cart.html` — cart summary and item overview
- `checkout.html` — checkout form and previous order history

### 2. Data Access Layer
The API layer lives in `js/api.js`.

Responsibilities:

- Fetches product data from `https://dummyjson.com/products`
- Normalizes raw API fields into the app’s product model
- Handles API errors gracefully by returning an empty list instead of crashing the UI

### 3. Storage Layer
The persistence layer lives in `js/storage.js`.

It manages browser state with `localStorage` for:

- `cart`
- `favorites`
- `theme`
- `orders`

This allows the application to retain user data between page refreshes without a backend.

### 4. UI Rendering Layer
The rendering logic is contained primarily in `js/ui.js`.

It is responsible for:

- Rendering product cards and featured items
- Rendering product details and review cards
- Rendering the cart and totals
- Calculating previous orders
- Updating category selections and pagination
- Toggling the dark/light theme

### 5. App Logic Layer
The main page interaction orchestration is in `js/script.js`.

This file connects the UI to the data and storage layers by:

- Initializing the storefront on page load
- Loading products asynchronously
- Handling add-to-cart actions
- Handling favorite toggles
- Creating orders from the cart on checkout
- Updating cart counts across pages

## Data Flow

1. The app loads a product list from the DummyJSON API.
2. Each product is normalized into a consistent internal shape.
3. The DOM is rendered with product cards, details, and summaries.
4. User actions update the local storage state.
5. The UI re-renders based on the updated state.

This keeps the application lightweight while still providing a realistic e-commerce shopping flow.

## File Structure

```text
.
├── index.html
├── products.html
├── productDetails.html
├── cart.html
├── checkout.html
├── css/
│   └── style.css
├── images/
├── js/
│   ├── api.js
│   ├── script.js
│   ├── storage.js
│   └── ui.js
├── readme.md
└── README instructions (this file)
```

## Features in Detail

### Product Catalog
The product listing supports:

- Search by product name
- Category filtering
- Price sorting (low to high / high to low)
- Pagination across multiple product pages

### Favorites
Users can mark products as favorites using the heart button. Favorite items are stored locally and shown on the home page in the Favorite Products section.

### Cart
The cart allows users to:

- Add products from any product card
- View their full cart on the cart page
- Adjust quantities
- Remove items
- See a live total

### Checkout
The checkout form captures:

- Full name
- Email
- Address

When submitted, the current cart is converted into an order object and saved in localStorage. The user then sees their order in the Previous Orders section.

### Theme Toggle
The application includes a theme switch controlled by a button in the header. The chosen theme is saved to the browser and applied on reload.

### Option 1: Open directly
Open any HTML file in a browser, such as `index.html`.

### Option 2: Run a local web server
If you want a cleaner local development experience, use a simple static server from the project root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Notes

- The app uses the public DummyJSON API, so internet access is required when loading products.
- Product data is stored in the browser, not in a server-side database.
- This project is a frontend demo and is not meant for production-scale e-commerce infrastructure.

## Conclusion

SHOPAHOLIC Store demonstrates a complete client-side storefront flow using plain JavaScript, local storage, and an external product API. The architecture is intentionally simple and easy to understand, making it a good example of a static front-end e-commerce application.

Created by: Ahmed Estanboly