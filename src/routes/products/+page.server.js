// @ts-nocheck
// src/routes/products/+page.server.js
import { paginate, addProdRequest } from '$lib/services/productCatalog.service';
import {error} from '@sveltejs/kit';
//import { depends}  from '$app/navigation';

export async function load({params, url, request }) {
  const page = url.searchParams.get('page') || 1;
  let searchString = url.searchParams.get("searchString")?.toString();
  if(searchString) {
    const products = await paginate(page, 6, searchString);
    return{
      products: products
    }
  }

  const products = await paginate(page);
  console.log(page);
  return{
      products: products
  }
}

export const actions = {
    addProdRequest: async ({ request, locals }) => {
        const form = await request.formData();
        const consumerId = locals.user?.id ?? 1;

        const message = form.get("message")?.toString();
        const productId = Number(form.get("productId"));
        const quantity = form.get("quantity")?.toString();
        try {

            // Add product to database
            const product = await addProdRequest(consumerId, productId, { 
                message,
                quantity,
            });

            return {
                success: true,
                product,
                message: "Product added successfully"
            };
            
        } catch (err) {
          console.log(err.message);
            return error(500, {
                err: 'Server Error',
                message: error.message || 'Failed to add product'
            });
        }
    }
};