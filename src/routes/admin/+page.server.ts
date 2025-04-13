import { invalidateUser, getAllUsers, getAllProducts, updateUserById, deleteProductById, updateProductById } from "$lib/services/admin.service"; 
import { fail, redirect, type Actions } from "@sveltejs/kit"; 
import { Role, ProductType } from "@prisma/client"; // Added ProductType to the imports

export async function load({ url }) {
  const page = Number(url.searchParams.get('page')) || 1;  // Merr faqen aktuale nga URL
  const pageSize = 6;  // Numri i elementeve për faqe

  try {
    const { users, totalPages, currentPage, totalCount } = await getAllUsers(page, pageSize);
    const { products, totalPages: productTotalPages, currentPage: productCurrentPage, totalCount: productTotalCount } = await getAllProducts(page, pageSize);

    return {
      users,
      products,
      totalPages,
      currentPage,
      totalCount,
      productTotalPages,
      productCurrentPage,
      productTotalCount,
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
      await invalidateUser(userId);
      // Return success instead of redirect
      return { 
        success: true,
        message: `User ${userId} invalidated successfully`
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return fail(500, { 
        error: "Failed to delete user",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  },
  updateUser: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const email = String(formData.get("email"));
    const username = String(formData.get("username"));
    const role = formData.get("role") as Role;

    try {
      await updateUserById(id, { email, username, role });  // Heqim përdorimin e transaksionit (tx)

      // Kthe të dhënat e përditësuara pas përditësimit
      const users = await getAllUsers(1, 6);  // Pasi e përditësojmë përdoruesin, mund të ngarkojmë përdoruesit e rinj
      const products = await getAllProducts(1, 6);  // Ngarkojmë produktet e përditësuara
      return { success: true, users, products };
    } catch (error) {
      console.error("Error updating user:", error);
      return fail(500, { error: "Failed to update user" });
    }
  },

  deleteProduct: async ({ request, url }) => {
    const formData = await request.formData();
    const productId = Number(formData.get("productId"));

    try {
      await deleteProductById(productId);  // Heqim përdorimin e transaksionit (tx)

      // Kthe të dhënat e përditësuara pas fshirjes
      const users = await getAllUsers(1, 6);  // Ngarkojmë përdoruesit
      const products = await getAllProducts(1, 6);  // Ngarkojmë produktet
      return { success: true, users, products };
    } catch (error) {
      console.error("Error deleting product:", error);
      return fail(500, { error: "Failed to delete product" });
    }
  },

  updateProduct: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    
    try {
      const updates = {
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        type: String(formData.get("type")) as ProductType,
        availability: formData.get("availability") === "true"
      };
  
      await updateProductById(id, updates);
  
      // Return updated data
      const users = await getAllUsers(1, 6);
      const products = await getAllProducts(1, 6);
      return { success: true, users, products };
    } catch (error) {
      console.error("Error updating product:", error);
      return fail(500, { error: "Failed to update product" });
    }
  }
}; 