import { setSessionCookie } from '$lib/helpers/session.helper.js';
import { createSession, createUser, findUserByUsername, verifyPassword } from '$lib/services/auth.service.js';
import { error, redirect } from '@sveltejs/kit';

export function load({ params }) {
  const auth = params.auth;
  if (auth !== "register" && auth !== "login") {
    return error(404, "Not Found");
  }
}

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    if (!username || !password)
      return error(400, 'Username and password are required');

    const user = await findUserByUsername(username);
    if (!user || !(await verifyPassword(user, password))) {
      return error(401, 'Invalid credentials');
    }
    const sessionId = await createSession(user.id);
    setSessionCookie(cookies, sessionId);
    return redirect(302, '/');

  },
  register: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    const email = formData.get('email')?.toString();
    const name = formData.get('name')?.toString();
    const role = formData.get('role')?.toString();

    if (!email || !password || ! username) {
      return error(400, 'Email, username and password are required');
    }
    if( role !== 'consumer' && role !== 'farmer'){
      return error(400, 'Role has been given a false role');
    }


    const user = await createUser(email, username, role, password, name);

    if (!user) {
      return error( 409, 'Email already exists');
    }

    const sessionId = await createSession(user.id);
    setSessionCookie(cookies, sessionId);

    throw redirect(302, '/'); // Redirect to home or dashboard
  }
}