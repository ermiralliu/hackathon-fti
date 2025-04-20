// src/lib/server/session.ts
import type { Cookies } from '@sveltejs/kit';
import type { SerializeOptions } from 'cookie';

export const SESSION_COOKIE_NAME = 'sessionid';

const SESSION_COOKIE_OPTIONS: SerializeOptions & { path: string } = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	path: '/',
	maxAge: 30 * 24 * 60 * 60, // Matches SESSION_EXPIRY_SECONDS
	sameSite: 'lax',
};

export function setSessionCookie(cookies: Cookies, sessionId: string) {
	cookies.set(SESSION_COOKIE_NAME, sessionId, SESSION_COOKIE_OPTIONS);
}

export function clearSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function getSessionIdFromCookie(cookies: Cookies): string | undefined {
	return cookies.get(SESSION_COOKIE_NAME);
}