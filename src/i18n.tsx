import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'sw'
// A piece of text in both languages.
export type L = { en: string; sw: string }

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (text: L) => string }

const LangContext = createContext<Ctx>({ lang: 'en', setLang: () => {}, t: (x) => x.en })

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'sw') return saved
  } catch {
    // storage unavailable
  }
  return 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // storage unavailable
    }
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang, t: (x) => x[lang] }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
