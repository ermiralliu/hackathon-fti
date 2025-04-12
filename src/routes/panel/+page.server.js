import { redirect } from "@sveltejs/kit";

// @ts-nocheck
export function load(){
    return redirect(302, "/panel/add");
}