// lib/i18n.js
import { init, register, locale, t, isLoading as svelteIsLoading, waitLocale as svelteWaitLocale, getLocaleFromNavigator } from 'svelte-i18n';

export const supportedLocales = ['en', 'al'];
export const defaultLocale = 'al';

register('en', () => import('../locales/en.json'));
register('al', () => import('../locales/al.json'));

// init() is async. svelte-i18n handles making `t` work once a locale is loaded.
// The initialLocale here might be overridden by the layout load function based on the URL.
export const translator = {
  initialized: false
};

export const initI18n = async () => {
  await init({
    fallbackLocale: defaultLocale,
    initialLocale: defaultLocale, // or detect from browser: getBrowserLocale({ fallback: 'en' })
  });
  translator.initialized = true;
};

const h = t;

export { t, locale };
export const isLoading = svelteIsLoading; // Export reactive store
export const waitLocale = svelteWaitLocale; // Export waitLocale function