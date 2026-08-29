import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, t as translate } from "../lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, ...args: string[]) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("fasaldoc_lang") as Language | null;
    if (stored === "ur" || stored === "en") {
      setLangState(stored);
      document.documentElement.dir = stored === "ur" ? "rtl" : "ltr";
      document.documentElement.lang = stored;
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("fasaldoc_lang", newLang);
    document.documentElement.dir = newLang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const t = (key: string, ...args: string[]) => translate(key, lang, ...args);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);