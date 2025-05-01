// src/routes/products/+page.server.js
import { paginate, addProdRequest } from '$lib/services/productCatalog.service';
import { ProductType } from '$prisma-client';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad =  async({ url }) => {  // the docs use arrow functions so i guess this is it
  const page = Number(url.searchParams.get('page')) || 1;
  const searchString = url.searchParams.get("searchString")?.toString();
  const typeParam = url.searchParams.get("type")?.toString();
  const typeFilter = typeParam && Object.keys(ProductType).includes(typeParam) 
    ? typeParam as ProductType 
    : undefined;
  // console.log(Object.keys(ProductType));

  const products = await paginate(page, 6, searchString, typeFilter); // kto paginate do emertohen into sth better

  return {
    products: products,
    allTypes: Object.keys(ProductType),
  }
};

export const actions = {
  addProdRequest: async ({ request, locals }) => {
    const form = await request.formData();
    const consumerId = locals.user?.id ?? 1;

    const message = form.get("message")?.toString() ?? null;
    const productId = Number(form.get("productId"));
    const quantity = form.get("quantity")?.toString() ?? null;
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
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log('An unexpected error occurred:', err);
      }
      return error(500, 'Server Error');
    }
  }
} satisfies Actions; 