import language, { setLang, type Language } from '$lib/client/globalStates/language.svelte';
import { loadTranslations, locale } from '$lib/translations';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({data, params, url})=>{
  const lang = params.lang;
  console.log("Lang: ", lang);
  locale.set(lang);
  await loadTranslations(lang, url.pathname);
  setLang(lang as Language);

  return {
    lang,
    ...data
  };
}