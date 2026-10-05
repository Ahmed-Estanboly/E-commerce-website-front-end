const API_URL = "https://dummyjson.com/products";

const normalizeProduct = (product) => ({
  id: product.id,
  name: product.title,
  category: product.category,
  price: product.price,
  image:
    product.thumbnail || product.images?.[0] ||
    "images/fallbackProduct.svg",
  description: product.description,
});

const getProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();
    return Array.isArray(data.products)
      ? data.products.map(normalizeProduct)
      : [];
  } catch (error) {
    console.error("Product fetch failed:", error);
    return [];
  }
};
