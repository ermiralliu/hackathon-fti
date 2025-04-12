// @ts-nocheck
// src/routes/products/+page.server.js
import { paginate } from '$lib/services/productCatalog.service';
//import { depends}  from '$app/navigation';

export async function load({params, url }) {
  const page = url.searchParams.get('page') || 1;
 // depends(`url:page=${page}`);

  const products = await paginate(page) //params.limit, params.sort, params.search, params.category);
  console.log(page);
  return{
      products: products
  }
}