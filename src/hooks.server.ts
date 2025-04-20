import { redirect, type Handle } from '@sveltejs/kit';
import { getUserBySessionId } from '$lib/services/auth.service';
import { getSessionIdFromCookie } from '$lib/helpers/session.helper';

const allAllowed = ['/products', '/login', '/register']; // top level routes

export const handle: Handle = async ({ event, resolve }) => {
  let user = null;
  let sessionId: string | undefined;
  if (!event.locals.user && (sessionId = getSessionIdFromCookie(event.cookies))) {
    user = await getUserBySessionId(sessionId);
    if (user) {
      event.locals.user = user; // Make user data available in load functions and API routes
    }
  }
  
  const isPublic = allAllowed.some((e)=> event.url.pathname.startsWith(e)) || event.url.pathname === '/';
  if(isPublic)
    return await resolve(event);

  const isTopRouteOfCurrentUrl  = (route: string) => event.url.pathname.startsWith(route) 
    ||  (event.url.pathname === route);

  if (!user) {
    if (!allAllowed.includes(event.url.pathname))
      throw redirect(303, '/login');
    return await resolve(event);
  } else if ( user.role === 'farmer' && !isTopRouteOfCurrentUrl('/panel')) {
    throw redirect(303, '/panel/add');
  } else if( user.role === 'consumer' && !isTopRouteOfCurrentUrl('/consumer')) {
    throw redirect(303, '/consumer/purchases/1');
  } 
  return await resolve(event);
}