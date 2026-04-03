'use client'

import { Button } from '@/components/ui/button'

interface OnboardingTransitionProps {
  isOpen: boolean
  title: string
  onContinue: () => void
}

export function OnboardingTransition({
  isOpen,
  title,
  onContinue,
}: OnboardingTransitionProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md w-full mx-4 text-center">
        <h1 className="text-2xl font-bold text-dark mb-8">{title}</h1>

        <Button
          onClick={onContinue}
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
          Continuer
        </Button>
      </div>
    </div>
  )
}
