'use client'

import { useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

interface OnboardingTourProps {
  isOpen: boolean
  onComplete: () => void
}

export function OnboardingTour({ isOpen, onComplete }: OnboardingTourProps) {
  useEffect(() => {
    if (!isOpen) return

    const driverInstance = driver({
      allowClose: true,
      overlayClickNext: false,
      showProgress: true,
      onDestroyStarted: () => {
        onComplete()
      },
      steps: [
        {
          element: '#nav-today',
          popover: {
            title: "Aujourd'hui - Votre tableau Kanban",
            description:
              'Cliquez ici pour voir votre tableau Kanban. Vous pouvez créer des tâches et les déplacer entre À faire, En cours et Terminé.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#nav-projects',
          popover: {
            title: 'Projets - Structurez votre travail',
            description:
              'Ici, vous pouvez créer et gérer vos projets. Chaque projet peut contenir plusieurs tâches liées.',
            side: 'right',
            align: 'center',
          },
        },
        {
          element: '#nav-pomodoro',
          popover: {
            title: 'Pomodoro - Optimisez votre focus',
            description:
              "Utilisez la technique Pomodoro pour gérer vos sessions de travail. C'est un excellent moyen d'améliorer votre productivité.",
            side: 'right',
            align: 'end',
          },
        },
      ],
    })

    driverInstance.drive()

    return () => {
      driverInstance.destroy()
    }
  }, [isOpen, onComplete])

  return null
}
