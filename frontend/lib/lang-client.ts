import { DEFAULT_LANG, LANG_COOKIE, type Lang } from "./i18n-shared";

export type { Lang } from "./i18n-shared";
export { DEFAULT_LANG, LANG_COOKIE } from "./i18n-shared";

export function getLangClient(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const m = document.cookie.match(/(?:^|; )warda-lang=([^;]+)/);
  return m?.[1] === "ar" ? "ar" : DEFAULT_LANG;
}

export function setLangCookie(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=31536000;samesite=lax`;
}
