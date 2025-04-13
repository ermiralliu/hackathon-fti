import { paginateProductsForFarmer } from '$lib/services/adminOnFarmer.service.js';
import { redirect } from '@sveltejs/kit';

export async function load({params, locals}){
  const farmerId = Number(params.farmerId);
  let page = Number(params.pageNr);
  // ne rastin e perdorimit te stringave te pavlefshme ne url, do kemi redirect ne faqen e pare (me baze)
  if(isNaN(farmerId))
    return redirect(303, `/admin/panel/1/view/1`);  
  if(isNaN(page))
    return redirect(303, `/admin/panel/${farmerId}/view/1`);
  const products = await paginateProductsForFarmer(farmerId);
  return products;
}

