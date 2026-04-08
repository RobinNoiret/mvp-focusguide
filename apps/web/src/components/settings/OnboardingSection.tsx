'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { userService } from '@/services/user-service'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

interface OnboardingSectionProps {
  onRestart: () => void
}

export function OnboardingSection({ onRestart }: OnboardingSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const setOnboardingCompleted = useAuthStore((state) => state.setOnboardingCompleted)

  const handleRestartOnboarding = async () => {
    try {
      setIsLoading(true)
      // Reset onboarding flag to false
      await userService.completeOnboarding(false)
      // Update local state to trigger onboarding display
      useAuthStore.setState((state) => ({
        user: state.user ? { ...state.user, flOnboarding: false } : null,
      }))
      toast.success('Visite guidée réinitialisée. La visite va démarrer dans quelques secondes...')
      onRestart()
    } catch (error) {
      console.error('Failed to restart onboarding:', error)
      toast.error('Impossible de réinitialiser la visite guidée')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="border-b border-ui-border py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-dark">Guided Tour</h2>
          <p className="text-sm text-ui-muted mt-1">
            Restart the guided tour to learn about all features
          </p>
        </div>
        <Button
          onClick={handleRestartOnboarding}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? 'Loading...' : 'Restart Tour'}
        </Button>
      </div>
    </section>
  )
}
