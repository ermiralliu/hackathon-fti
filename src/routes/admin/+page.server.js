import { getAllUsers, getAllProducts } from "$lib/services/admin.service";

export async function load() {
  try {
    const users = await getAllUsers();
    const products = await getAllProducts();

    return {
      users,
      products
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      users: [],
      products: [],
      error: "Failed to fetch data"
    };
  }
}