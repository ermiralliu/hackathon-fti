import I18n from '@sveltekit-i18n/base';
import parser from '@sveltekit-i18n/parser-default';

const i18n = new I18n({
  initLocale: 'en',
  fallbackLocale: 'en',
  loaders: [
    {
      locale: 'en',
      key: 'top-bar',
      loader: async () => (await import(`../locales/top-bar/en.json`)).default,
      routes: [/\/.*/],
    },
    {
      locale: 'sq',
      key: 'top-bar',
      loader: async () => (await import(`../locales/top-bar/al.json`)).default,
      routes: [/\/.*/],
    },
    {
      locale: 'en',
      key: 'home',
      routes: ['/en'],
      loader: async () => (await import('../locales/en.json')).default
    },
    {
      locale: 'sq',
      key: 'home',
      routes: ['/sq'],
      loader: async () => (await import(`../locales/al.json`)).default
    },
    // ... other loaders
  ],
  parser: parser()
  // log: ...,    // Configure logging
});

export const { t, locale, locales, loading, loadTranslations } = i18n;