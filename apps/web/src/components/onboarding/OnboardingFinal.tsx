'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/use-translation'

interface OnboardingFinalProps {
  isOpen: boolean
  onComplete: () => Promise<void>
}

export function OnboardingFinal({ isOpen, onComplete }: OnboardingFinalProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const handleStartClick = async () => {
    await onComplete()
    router.push('/today')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <div className="h-16 w-16 mx-auto rounded-full bg-[color:var(--color-brand-primary)] flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-[color:var(--color-brand-dark)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-dark mb-3">{t.onboarding.final.title}</h1>

        <p className="text-base text-dark mb-8 leading-relaxed" style={{ opacity: 0.8 }}>
          {t.onboarding.final.description}
        </p>

        <Button
          onClick={handleStartClick}
          className="w-full py-3 font-semibold transition-colors"
          style={{
            backgroundColor: '#D9FC00',
            color: '#262626',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#C9F600'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#D9FC00'
          }}
        >
          {t.onboarding.final.cta}
        </Button>
      </div>
    </div>
  )
}
