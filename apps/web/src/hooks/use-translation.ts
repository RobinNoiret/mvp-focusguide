'use client'

import { getTranslations } from '@/i18n'
import { useLocaleStore } from '@/stores/locale-store'

export function useTranslation() {
  const { locale, setLocale } = useLocaleStore()
  const t = getTranslations(locale)

  return {
    t,
    locale,
    setLocale,
  }
}
