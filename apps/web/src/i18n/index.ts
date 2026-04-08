import { fr } from './fr'
import { en } from './en'

export type Locale = 'fr' | 'en'
export type Translations = typeof fr

const translations = {
  fr,
  en,
} as const

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}

export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'fr'
  const stored = localStorage.getItem('locale-storage')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return parsed.locale || 'fr'
    } catch {
      return 'fr'
    }
  }
  return 'fr'
}

export { fr, en }
