import { loadTranslations, locale } from '$lib/translations';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({data, params, url})=>{
  const lang = params.lang;
  console.log("Lang: ", lang);
  locale.set(lang);
  await loadTranslations(lang, url.pathname);

  return {
    lang,
    ...data
  };
}