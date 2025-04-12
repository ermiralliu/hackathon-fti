import type { User } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export function load({params, locals}){
  const user = locals.user as User;
  console.log(JSON.stringify(user));
  // room -> do perdoret per te marre mesazhet me kete person specifik nga params ndoshta

  // funksioni i databazes
  // return
}

export const actions = {
  sendMessage : async ({request, url})=>{
    // funksioni qe mesazhi kalohet ne databaze
    return redirect(303, url.pathname);
  }
}