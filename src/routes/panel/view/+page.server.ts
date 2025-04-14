import { paginateUserProducts } from '$lib/services/productCatalog.service';
import { error, fail, type Actions } from "@sveltejs/kit"; 
import { deleteProduct, updateProduct } from "$lib/services/farmer.service";
import type { PageServerLoad } from '../$types';
import { ProductType } from '@prisma-types';

export const load: PageServerLoad = async ({url, locals }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  // nese Number(url.searchParams.get('page')) esht NaN, or-i na jep 1.

  const products = await paginateUserProducts(locals.user ? locals.user.id : 1, page) //params.limit, params.sort, params.search, params.category);
  console.log(page);
  return{
      products: products
  }
}


export const actions: Actions = {

  deleteProduct: async ({ request, locals }) => {
    const formData = await request.formData();
    const productId = Number(formData.get("productId"));
    const userId = locals.user.userId;

    try {
      await deleteProduct(productId, userId);  // Heqim përdorimin e transaksionit (tx)

      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error deleting product:", error);
      return fail(500, { error: "Failed to delete product" });
    }
  },

  updateProduct: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const name = String(formData.get("name"));
    const typeStr = String(formData.get("type"));
    if(!Object.keys(ProductType).includes(typeStr))
      return error(400, 'Invalid product type provided.');;
    const description = String(formData.get("description"));
    const price = Number(formData.get("price"));
    // const photo = formData.get("photo"); // Keep as File object

    try {
      // Update product - verify farmer owns it
      await updateProduct(id, { 
        name, 
        type: typeStr as ProductType, // e kemi kontrolluar te ajo me includes pak me lart 
        price, 
        description, 
        // ...(imagePath && { imagePath }) // Only include if imagePath exists
      });
      // const fullProduct = await prisma.product.findUnique({
      //   where: { id },
      //   include: { farmer: true }
      // });


      return {
        success: true,
        // product: fullProduct,
        message: "Product updated successfully"
      };
      
    } catch (err) {
      console.error('Update error:', err);
      const message = err instanceof Error ? err.message : 'Failed to update product';
      return fail(500, {message});
    }
  }
} satisfies Actions;