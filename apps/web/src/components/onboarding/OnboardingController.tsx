'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { userService } from '@/services/user-service'
import { toast } from 'sonner'
import { OnboardingWizard } from './OnboardingWizard'
import { OnboardingTour } from './OnboardingTour'

type OnboardingStage = 'wizard' | 'tour' | null

export function OnboardingController() {
  const user = useAuthStore((state) => state.user)
  const setOnboardingCompleted = useAuthStore((state) => state.setOnboardingCompleted)
  const [stage, setStage] = useState<OnboardingStage>(null)

  // Initialize onboarding if user hasn't completed it
  useEffect(() => {
    if (user && !user.flOnboarding) {
      setStage('wizard')
    }
  }, [user])

  const handleWizardComplete = () => {
    setStage(null)
  }

  const handleWizardStartTour = () => {
    setStage('tour')
  }

  const handleTourComplete = async () => {
    try {
      // Mark onboarding as complete on the backend
      await userService.completeOnboarding(true)
      // Update the local state
      setOnboardingCompleted()
      setStage(null)
      toast.success('Bienvenue! Vous avez complété la visite guidée.')
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  return (
    <>
      <OnboardingWizard
        isOpen={stage === 'wizard'}
        onComplete={handleWizardComplete}
        onStartTour={handleWizardStartTour}
      />
      <OnboardingTour isOpen={stage === 'tour'} onComplete={handleTourComplete} />
    </>
  )
}
