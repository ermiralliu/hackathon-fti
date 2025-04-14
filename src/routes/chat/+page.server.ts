import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { User } from "@prisma-types";

export const load: PageServerLoad = ({locals}) => {
  const user = locals.user as User;
  console.log(JSON.stringify(user));
  // room -> do perdoret per te marre mesazhet me kete person specifik nga params ndoshta

  // funksioni i databazes
  // return
}

export const actions = {
  sendMessage : async ({url})=>{
    // funksioni qe mesazhi kalohet ne databaze
    return redirect(303, url.pathname);
  }
} satisfies Actions;