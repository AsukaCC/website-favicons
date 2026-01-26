import zhTranslations from "./zh.json";
import enTranslations from "./en.json";

export type Language = "zh" | "en";

export const translations = {
  zh: zhTranslations,
  en: enTranslations,
};

export function getTranslation(language: Language) {
  return translations[language];
}
