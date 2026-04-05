import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { en } from '../i18n/en'
import { es } from '../i18n/es'
import type { Translations } from '../i18n/en'

type Lang = 'en' | 'es'

interface LanguageStore {
  lang: Lang
  t: Translations
  setLang: (lang: Lang) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: 'en',
      t: en,
      setLang: (lang) => set({ lang, t: lang === 'en' ? en : es }),
    }),
    { name: 'ais-lang' }
  )
)

export function useTranslation(): Translations {
  return useLanguageStore((s) => s.t)
}
