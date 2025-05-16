export type Language = 'sq' | 'en'; // Premature abstraction like a boss

type LanguageLink = `/${Language}`; // TS is incredible

const language = $state({
  lang : 'sq' as Language,
  link : '/sq' as LanguageLink
});

export function setLang(lang: Language) { // I initially had a typecheck, but that's done top level (I guess)
  language.lang = lang;
  language.link = `/${lang}`;
}

export default language as { readonly lang: Language, readonly link: LanguageLink};