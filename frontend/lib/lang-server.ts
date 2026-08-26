import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, type Lang } from "./i18n-shared";

export function getLangServer(): Lang {
  try {
    const c = cookies().get(LANG_COOKIE);
    return c?.value === "ar" ? "ar" : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}
