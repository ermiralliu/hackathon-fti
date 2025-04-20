import type { PageServerLoad } from "./panel/$types";

export const load: PageServerLoad = ({locals}) => {
  let isLogged = false;
  if(locals.user)
    isLogged = true;
  return {
    isLogged
  }
}