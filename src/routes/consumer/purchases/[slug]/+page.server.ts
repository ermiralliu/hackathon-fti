import { paginateProductRequest } from "$lib/services/consumer.service.js";

import { error } from "@sveltejs/kit";

export async function load({params, locals}){
  const user = locals.user;
  const page = Number(params.slug);
  if(isNaN(page))
    return error(404, 'Wrong page url');

  return await paginateProductRequest(page, 10, user.id);
}