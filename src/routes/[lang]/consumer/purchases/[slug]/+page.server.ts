import { paginateProductRequest } from "$lib/services/consumer.service.js";

import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad =  async({params, locals}) => {
  const user = locals.user;
  
  // @ts-ignore // using an annotation cause ts isn't understanding that it's correct
  const page = Number(params.slug);

  if(isNaN(page))
    return error(404, 'Wrong page url');  // kjo thjesht duhet te beje redirect ngl
  return await paginateProductRequest(user.id, page, 10);
}