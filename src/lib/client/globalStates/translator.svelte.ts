import type { Translations } from "@sveltekit-i18n/base";
import type { Modifier, Parser } from "@sveltekit-i18n/parser-default";

// This is here for absolutely no reason, and it isn't used anywhere

export type Translator = Translations.TranslationFunction<Parser.Params<Parser.PayloadDefault, Modifier.NumberProps & Modifier.AgoProps & Modifier.DateProps & Modifier.CurrencyProps>>

const translator = $state({
  t: (str: string) => str
}) as {
  t: Translator
};

export default translator;

// function setTranslator(){}