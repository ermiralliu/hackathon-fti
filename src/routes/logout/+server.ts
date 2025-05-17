import { clearSessionCookie, SESSION_COOKIE_NAME } from "$lib/helpers/session.helper"
import { deleteSession } from "$lib/services/auth.service"
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, locals }) => {
  console.log('called');
  const sessionId = cookies.get(SESSION_COOKIE_NAME);
  if (sessionId) {
    console.log(`Attempting to delete session ID: ${sessionId} from database/store.`);
    await deleteSession(sessionId);
    console.log('Session successfully deleted from database/store.');
    clearSessionCookie(cookies);
    console.log('Session cookie deleted.');
    locals.user = null;
  } else {
    // User wasn't logged in, nothing to delete server-side
    console.log('Logout requested, but no session cookie found.');
  }

  // throw redirect(303, '/'); // we prefer throws to redirects
  return json({ 
    success: true, 
    // type: 'redirect', 
    location: `/${locals.lang}` 
  });
}

// export const GET: RequestHandler = ()=>{
//   return json({
//     message: 'haha',
//     mommy: 'baba'
//   });
// }