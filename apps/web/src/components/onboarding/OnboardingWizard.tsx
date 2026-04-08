'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Calendar, FolderOpen, Clock } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

interface OnboardingWizardProps {
  isOpen: boolean
  onComplete: () => void
  onStartTour: () => void
}

export function OnboardingWizard({
  isOpen,
  onComplete,
  onStartTour,
}: OnboardingWizardProps) {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: t.onboarding.welcome.title,
      description: t.onboarding.welcome.description,
      icon: CheckCircle2,
    },
    {
      title: t.onboarding.today.title,
      description: t.onboarding.today.description,
      icon: Calendar,
    },
    {
      title: t.onboarding.projects.title,
      description: t.onboarding.projects.description,
      icon: FolderOpen,
    },
    {
      title: t.onboarding.pomodoro.title,
      description: t.onboarding.pomodoro.description,
      icon: Clock,
    },
  ]

  // Reset to first slide when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0)
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onStartTour()
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slide = slides[currentSlide] || slides[0]
  const Icon = slide?.icon
  const progress = ((currentSlide + 1) / slides.length) * 100

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-primary">
            {slide?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-8 items-center">
          {Icon && <Icon className="h-14 w-14 text-primary" style={{ opacity: 0.75 }} />}

          <p className="text-center text-base text-primary leading-relaxed">
            {slide?.description}
          </p>

          {/* Progress bar */}
          <div className="w-full">
            <div className="h-1 w-full bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: '#D9FC00' }}
              />
            </div>
            <p className="text-xs text-primary mt-2 text-center">
              {t.onboarding.step} {currentSlide + 1} de {slides.length}
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onComplete}
            className="flex-1 text-primary"
          >
            {t.onboarding.skip}
          </Button>

          {currentSlide > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1"
            >
              {t.onboarding.previous}
            </Button>
          )}

          <Button
            onClick={handleNext}
            className="flex-1 font-semibold transition-colors"
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
            {currentSlide === slides.length - 1 ? t.onboarding.final.cta : t.onboarding.next}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
