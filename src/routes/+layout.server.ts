import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({locals, cookies}) => {
  let isLogged = false;
  const themeCookie = cookies.get('preference-theme-switch');
  console.log(themeCookie);
  let isDarkMode = false;
  if(locals.user)
    isLogged = true;
  if (themeCookie === 'on') {
    isDarkMode = true;
  }

  return {
    isLogged,
    isDark: isDarkMode
  }
}