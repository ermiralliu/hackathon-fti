import { locale as activeLocale, defaultLocale, initI18n, supportedLocales, translator } from "$lib/i18n";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({locals, cookies, url}) => {
  let isLogged = false;
  const themeCookie = cookies.get('preference-theme-switch');
  console.log(themeCookie);
  let isDarkMode = false;
  if(locals.user)
    isLogged = true;
  if (themeCookie === 'on') {
    isDarkMode = true;
  }

  const pathLang = url.pathname.split('/')[1];
  let langToSet = defaultLocale; // Fallback to defaultLocale

  if (supportedLocales.includes(pathLang)) {
    langToSet = pathLang;
  }
  if(!translator.initialized)
    await initI18n();
  await activeLocale.set(langToSet);
  console.log("is it initialized: ", translator.initialized);


  return {
    isLogged,
    isDark: isDarkMode
  }
}