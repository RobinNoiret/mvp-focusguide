'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { userService } from '@/services/user-service'
import { toast } from 'sonner'
import { OnboardingWizard } from './OnboardingWizard'
import { OnboardingTour } from './OnboardingTour'
import { OnboardingFinal } from './OnboardingFinal'

type OnboardingStage = 'wizard' | 'tour-today' | 'tour-projects' | 'tour-pomodoro' | 'final' | null
type TourPage = 'today' | 'projects' | 'pomodoro'

export function OnboardingController() {
  const user = useAuthStore((state) => state.user)
  const setOnboardingCompleted = useAuthStore((state) => state.setOnboardingCompleted)
  const pathname = usePathname()
  const [stage, setStage] = useState<OnboardingStage>(null)
  const [currentTourPage, setCurrentTourPage] = useState<TourPage>('today')

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
    setCurrentTourPage('today')
    setStage('tour-today')
  }

  const handleTourNext = (nextPage: TourPage) => {
    setCurrentTourPage(nextPage)
    setStage(`tour-${nextPage}` as OnboardingStage)
  }

  const handleTourComplete = async () => {
    setStage('final')
  }

  const handleFinalComplete = async () => {
    try {
      // Mark onboarding as complete on the backend
      await userService.completeOnboarding(true)
      // Update the local state
      setOnboardingCompleted()
      setStage(null)
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  const isTodayPage = pathname.startsWith('/today')
  const isProjectsPage = pathname.startsWith('/projets')
  const isPomodoroPage = pathname.startsWith('/pomodoro')

  return (
    <>
      <OnboardingWizard
        isOpen={stage === 'wizard'}
        onComplete={handleWizardComplete}
        onStartTour={handleWizardStartTour}
      />
      {stage?.startsWith('tour-') && (
        <OnboardingTour
          page={currentTourPage}
          onNext={handleTourNext}
          onComplete={handleTourComplete}
          isPageLoaded={
            (currentTourPage === 'today' && isTodayPage) ||
            (currentTourPage === 'projects' && isProjectsPage) ||
            (currentTourPage === 'pomodoro' && isPomodoroPage)
          }
        />
      )}
      <OnboardingFinal
        isOpen={stage === 'final'}
        onComplete={handleFinalComplete}
      />
    </>
  )
}
