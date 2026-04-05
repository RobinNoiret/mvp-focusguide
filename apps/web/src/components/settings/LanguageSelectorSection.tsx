'use client'

import { useTranslation } from '@/hooks/use-translation'
import { type Locale } from '@/i18n'
import { Button } from '@/components/ui/button'
import { CollapsibleSection } from './CollapsibleSection'
import { cn } from '@/lib/utils'

const languages: { locale: Locale; label: string }[] = [
  { locale: 'fr', label: 'Français' },
  { locale: 'en', label: 'English' },
]

export function LanguageSelectorSection() {
  const { t, locale, setLocale } = useTranslation()

  return (
    <CollapsibleSection title={t.settings.language.title}>
      <div className="space-y-4">
        <div className="flex gap-2">
          {languages.map(({ locale: lang, label }) => (
            <Button
              key={lang}
              onClick={() => setLocale(lang)}
              variant={locale === lang ? 'default' : 'outline'}
              size="sm"
              className={cn(
                locale === lang && 'bg-chartreuse text-dark hover:bg-chartreuse/90'
              )}
            >
              {label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-ui-muted">
          {locale === 'fr' ? 'Langue actuelle : Français' : 'Current language: English'}
        </p>
      </div>
    </CollapsibleSection>
  )
}
