import { redirect } from "@sveltejs/kit";

export async function load(){
  return redirect(303, '/consumer/purchases/1');
}