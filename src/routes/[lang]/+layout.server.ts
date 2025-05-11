import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({locals, cookies}) => {
  let isLogged = false;
  let isDarkMode = false;
  if(locals.user)
    isLogged = true;

  const themeCookie = cookies.get('preference-theme-switch');
  console.log(themeCookie);
  if (themeCookie === 'on') {
    isDarkMode = true;
  }

  return {
    isLogged,
    isDark: isDarkMode
  }
}