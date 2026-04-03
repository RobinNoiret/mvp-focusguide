'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Calendar, FolderOpen, Clock } from 'lucide-react'

interface OnboardingWizardProps {
  isOpen: boolean
  onComplete: () => void
  onStartTour: () => void
}

const slides = [
  {
    title: 'Bienvenue sur FocusGuide! 👋',
    description:
      'Une application pour vous aider à gérer vos tâches, projets et sessions Pomodoro avec efficacité.',
    icon: CheckCircle2,
  },
  {
    title: "Aujourd'hui - Votre tableau Kanban",
    description:
      'Organisez vos tâches du jour avec le système Kanban. Déplacez vos tâches entre À faire, En cours et Terminé.',
    icon: Calendar,
  },
  {
    title: 'Projets - Structurez votre travail',
    description:
      'Créez des projets pour regrouper vos tâches et mieux organiser votre workflow long terme.',
    icon: FolderOpen,
  },
  {
    title: 'Pomodoro - Optimisez votre focus',
    description:
      'Utilisez la technique Pomodoro pour augmenter votre concentration avec des cycles de travail et de pause.',
    icon: Clock,
  },
]

export function OnboardingWizard({
  isOpen,
  onComplete,
  onStartTour,
}: OnboardingWizardProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

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

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onComplete()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{slide.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-8">
          <Icon className="h-16 w-16 text-primary" />
          <p className="text-center text-sm text-muted-foreground">{slide.description}</p>

          {/* Progress indicator */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={onComplete}
            className="flex-1"
          >
            Ignorer
          </Button>

          {currentSlide > 0 && (
            <Button variant="outline" onClick={handlePrevious} className="flex-1">
              ← Précédent
            </Button>
          )}

          <Button onClick={handleNext} className="flex-1">
            {currentSlide === slides.length - 1 ? 'Démarrer la visite →' : 'Suivant →'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
