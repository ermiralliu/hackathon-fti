import { redirect, type Handle } from '@sveltejs/kit';
import { getUserBySessionId } from '$lib/services/auth.service';
import { getSessionIdFromCookie } from '$lib/helpers/session.helper';

const allAllowed = ['/products', '/login', '/register', '/logout']; // top level routes

const defaultLocale = 'sq';
const supportedLocales = ['sq', 'en'];

export const handle: Handle = async ({ event, resolve }) => {
  let user = null;
  let sessionId: string | undefined;

  if (!event.locals.user && (sessionId = getSessionIdFromCookie(event.cookies))) {
    user = await getUserBySessionId(sessionId);
    if (user) {
      event.locals.user = user; // Make user data available in load functions and API routes
    }
  }
  // Check if the path already has a language prefix

  const { pathname } = event.url;
  const lang = pathname.split('/')[1];
  
  const hasLanguagePrefix = supportedLocales.includes(lang);
  // Redirect to default locale if no prefix and not the root path
  // Redirect to default locale if no language prefix and it's the root path
  if (!hasLanguagePrefix && pathname === '/') {
    throw redirect(303, `/${defaultLocale}`);
  }
  // Redirect to default locale if no language prefix and it's not a public top-level route
  if (!hasLanguagePrefix && pathname !== '/' && !allAllowed.includes(pathname)) {
    throw redirect(303, `/${defaultLocale}${pathname}`);
  }
  
  const isPublic = [
    '/',
    ...supportedLocales.map(loc => '/' + loc),
    ...allAllowed.map(route => (hasLanguagePrefix ? `/${lang}${route}` : route)),
  ].some(e => pathname.startsWith(e));
  
  if (isPublic) {
    // If it's a public page, resolve it.  The resolveSuccess function is now redundant
    if (hasLanguagePrefix) {
      // locale.set(lang);
      return await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', lang),
      });
    }
    return await resolve(event,{
      transformPageChunk: ({ html }) => html.replace('%lang%', defaultLocale),
    });
  }

  const isTopRouteOfCurrentUrl = (route: string) => pathname.startsWith(route) || (pathname === route);

  if (!user) {
    throw redirect(303, `/${lang}/login`);
  } else if (user.role === 'farmer' && !isTopRouteOfCurrentUrl(`/${lang}/panel`)) {
    throw redirect(303, `/${lang}/panel/add`);
  } else if (user.role === 'consumer' && !isTopRouteOfCurrentUrl(`/${lang}/consumer`)) {
    throw redirect(303, `/${lang}/consumer/purchases/1`);
  }

  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang),
  });
};