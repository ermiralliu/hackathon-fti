// @ts-nocheck
// src/routes/products/+page.server.js
import { paginateUserProducts } from '$lib/services/productCatalog.service';
import { fail, redirect, type Actions } from "@sveltejs/kit"; 
import { deleteProduct, updateProduct } from "$lib/services/farmer.service";
import { saveImageToStaticFolder } from "$lib/helpers/saveImage.helper";

//import { depends}  from '$app/navigation';

export async function load({params, url, locals }) {
  const page = url.searchParams.get('page') || 1;
 // depends(`url:page=${page}`);

  const products = await paginateUserProducts(locals.user ? locals.user.id : 1, page) //params.limit, params.sort, params.search, params.category);
  console.log(page);
  return{
      products: products
  }
}


export const actions: Actions = {

  deleteProduct: async ({ request, url }) => {
    const formData = await request.formData();
    const productId = Number(formData.get("productId"));

    try {
      await deleteProduct(productId);  // Heqim përdorimin e transaksionit (tx)

      
      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error deleting product:", error);
      return fail(500, { error: "Failed to delete product" });
    }
  },

  updateProduct: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const name = String(formData.get("name"));
    const type = String(formData.get("type"));
    const description = String(formData.get("description"));
    const price = Number(formData.get("price"));
    // const photo = formData.get("photo"); // Keep as File object

    try {
      // let imagePath = null;
      
      // // Process image if provided (and it's a File)
      // if (photo instanceof File && photo.size > 0) {
      //   imagePath = await saveImageToStaticFolder(photo);
      // }

      // Update product - verify farmer owns it
      const product = await updateProduct(id, { 
        name, 
        type, 
        price, 
        description, 
        // ...(imagePath && { imagePath }) // Only include if imagePath exists
      });

      const fullProduct = await prisma.product.findUnique({
        where: { id },
        include: { farmer: true }
      });


      return {
        success: true,
        product: fullProduct,
        message: "Product updated successfully"
      };
      
    } catch (err) {
      console.error('Update error:', err);
      return fail(500, {
        error: 'Server Error',
        message: err.message || 'Failed to update product'
      });
    }
  }
};