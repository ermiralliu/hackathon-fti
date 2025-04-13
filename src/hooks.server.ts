import type { Handle } from '@sveltejs/kit';
import { getUserBySessionId } from '$lib/services/auth.service';
import { getSessionIdFromCookie } from '$lib/helpers/session.helper';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = getSessionIdFromCookie(event.cookies);

  if (sessionId) {
    const user = await getUserBySessionId(sessionId);
    if (user && event.locals.user !== user) {
      event.locals.user = user; // Make user data available in load functions and API routes
    }
    // console.log(JSON.stringify(user));
  }

  return await resolve(event);
}