export type Lang = "fr" | "ar";

export const DEFAULT_LANG: Lang = "fr";
export const LANG_COOKIE = "warda-lang";

export const isAr = (lang: Lang) => lang === "ar";
export const dirFor = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");
