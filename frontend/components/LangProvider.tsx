"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LANG, getLangClient, setLangCookie, type Lang } from "@/lib/lang-client";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function LangProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang ?? DEFAULT_LANG);

  useEffect(() => {
    setLangState(getLangClient());
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang === "ar" ? "ar-MA" : "fr";
    el.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-ar", lang === "ar");
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangCookie(l);
    setLangState(l);
    router.refresh();
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
