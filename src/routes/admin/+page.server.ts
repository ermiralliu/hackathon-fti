import { deleteUserById, getAllUsers, getAllProducts, updateUserById, deleteProductById, updateProductById } from "$lib/services/admin.service"; 
import { fail, redirect, type Actions } from "@sveltejs/kit"; 
import { Role } from "@prisma/client"; // enum Role

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

export const actions: Actions = {
  deleteUser: async ({ request, url }) => {
    const formData = await request.formData();
    const userId = Number(formData.get("userId"));
  
    try {
      // Prit për përfundimin e fshirjes
      await deleteUserById(userId);
  
      return redirect(303, url.pathname);
    } catch (error) {
      console.error("Error deleting user:", error);
      return fail(500, { error: "Failed to delete user" });
    }
  },

  updateUser: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const email = String(formData.get("email"));
    const username = String(formData.get("username"));
    const role = formData.get("role") as Role;

    try {
      await updateUserById(id, { email, username, role });
      // Kthe të dhënat e përditësuara pas përditësimit
      const users = await getAllUsers();
      const products = await getAllProducts();
      return { success: true, users, products };
    } catch (error) {
      console.error("Error updating user:", error);
      return fail(500, { error: "Failed to update user" });
    }
  },

  deleteProduct: async ({ request }) => {
    const formData = await request.formData();
    const productId = Number(formData.get("productId"));

    try {
      await deleteProductById(productId);
      // Kthe të dhënat e përditësuara pas fshirjes
      const users = await getAllUsers();
      const products = await getAllProducts();
      return { success: true, users, products };
    } catch (error) {
      console.error("Error deleting product:", error);
      return fail(500, { error: "Failed to delete product" });
    }
  },

  updateProduct: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const name = String(formData.get("name"));
    const description = String(formData.get("description"));
    const price = Number(formData.get("price"));

    try {
      await updateProductById(id, { name, description, price });
      // Kthe të dhënat e përditësuara pas përditësimit
      const users = await getAllUsers();
      const products = await getAllProducts();
      return { success: true, users, products };
    } catch (error) {
      console.error("Error updating product:", error);
      return fail(500, { error: "Failed to update product" });
    }
  }
};
