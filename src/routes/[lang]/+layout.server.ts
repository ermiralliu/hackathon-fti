import { loadTranslations } from "$lib/translations";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({locals, cookies, params, url}) => {
  let isLogged = false;
  const themeCookie = cookies.get('preference-theme-switch');
  console.log(themeCookie);
  let isDarkMode = false;
  if(locals.user)
    isLogged = true;
  if (themeCookie === 'on') {
    isDarkMode = true;
  }

  const lang = params.lang;
  // console.log("Lang: ", lang);
  // await loadTranslations(lang, url.pathname);

  return {
    lang,
    isLogged,
    isDark: isDarkMode
  }
}