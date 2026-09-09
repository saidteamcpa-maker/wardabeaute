import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, type Lang } from "./i18n-shared";

export function getLangServer(): Lang {
  try {
    const c = cookies().get(LANG_COOKIE);
    if (c?.value === "ar") return "ar";
    if (c?.value === "fr") return "fr";
    return DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}
