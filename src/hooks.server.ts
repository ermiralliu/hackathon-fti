import { redirect, type Handle } from '@sveltejs/kit';
import { getUserBySessionId } from '$lib/services/auth.service';
import { getSessionIdFromCookie } from '$lib/helpers/session.helper';

const allAllowed = ['products', 'login', 'register', 'logout']; // top level routes

const defaultLocale = 'sq';
const supportedLocales = ['sq', 'en'] as const;
type SupportedLocales = typeof supportedLocales[number];


export const handle: Handle = async ({ event, resolve }) => {
  let sessionId: string | undefined;

  // 1. User Authentication Check
  if (!event.locals.user && (sessionId = getSessionIdFromCookie(event.cookies))) {
    let user = await getUserBySessionId(sessionId);
    if (user) {
      event.locals.user = user;
    }
  }

  // 2. Language Determination
  const { pathname } = event.url;
  const paths = pathname.split('/');

  const langFromUrl = paths[1];
  const hasLanguagePrefix = supportedLocales.includes(langFromUrl as SupportedLocales);

  console.log("isEnglishHook: ", event.cookies.get('preference-language-switch'));
  console.log("Before run: ", event.locals.lang);
  if (hasLanguagePrefix && event.locals.lang !== langFromUrl) {
    event.locals.lang = langFromUrl as SupportedLocales;
  } else if (!event.locals.lang) {
    const cookie = event.cookies.get('preference-language-switch');
    console.log("Cookie: ", cookie);
    console.log(cookie === 'on' ? 'en' : 'sq');
    let lang: SupportedLocales = defaultLocale;
    if (cookie) {
      lang = (cookie === 'on') ? 'en' : 'sq';
    }
    event.locals.lang = lang;
  }
  console.log("After run: ", event.locals.lang);

  const lang = event.locals.lang;
  // 3. Redirect for Root and Non-Prefixed Paths (ADJUSTED)
  if (!hasLanguagePrefix) {
    if(paths[1] === 'logout'){
      return await resolve(event);
    }
    throw redirect(303, `/${lang}${pathname}`);
  } // we redirect before checking if public

  // 3.5. Public Route Check
  console.log(paths);
  console.log(paths[2]);
  if (paths.length === 2 || allAllowed.includes(paths[2])) {  // first case is '/'
    return await resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%lang%', lang),
    });
  }

  // 4. Authentication and Role-Based Redirection (MOVED UP)
  const user = event.locals.user;

  // IMPORTANT: Check authentication FIRST
  if (!user) {
    throw redirect(303, `/${lang}/login`);
  } else if (user.role === 'farmer' && paths[2] !== 'panel') {
    throw redirect(303, `/${lang}/panel/add`);
  } else if (user.role === 'consumer' && paths[2] !== 'consumer') {
    throw redirect(303, `/${lang}/consumer/purchases/1`);
  }


  // 6. Resolve the Request
  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang),
  });
};
