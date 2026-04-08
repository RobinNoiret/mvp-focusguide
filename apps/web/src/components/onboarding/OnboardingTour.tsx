'use client'

import { useEffect, useRef } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import './onboarding-tour.css'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/use-translation'

type TourPage = 'today' | 'projects' | 'pomodoro'

interface OnboardingTourProps {
  page: TourPage
  isPageLoaded: boolean
  onNext: (nextPage: TourPage) => void
  onComplete: () => Promise<void>
}

function getTourSteps(t: any): Record<TourPage, any[]> {
  return {
    today: [
      {
        element: '[data-tour="kanban-board"]',
        popover: {
          title: t.onboarding.today.title,
          description: t.onboarding.today.kanbanDescription,
          side: 'top',
        },
      },
      {
        element: '[data-tour="column-todo"]',
        popover: {
          title: t.today.kanban.todo,
          description: t.onboarding.today.todoDescription,
          side: 'right',
        },
      },
      {
        element: '[data-tour="column-in-progress"]',
        popover: {
          title: t.today.kanban.inProgress,
          description: t.onboarding.today.inProgressDescription,
          side: 'right',
        },
      },
      {
        element: '[data-tour="column-done"]',
        popover: {
          title: t.today.kanban.done,
          description: t.onboarding.today.doneDescription,
          side: 'right',
        },
      },
      {
        element: '[data-tour="btn-create-task"]',
        popover: {
          title: t.today.addTask,
          description: t.onboarding.today.createTaskDescription,
          side: 'left',
        },
      },
      {
        element: '[data-tour="side-panel-toggle"]',
        popover: {
          title: 'Importer de vos projets',
          description: t.onboarding.today.importDescription,
          side: 'left',
        },
      },
    ],
    projects: [
      {
        element: '[data-tour="projects-grid"]',
        popover: {
          title: t.projects.title,
          description: t.onboarding.projects.gridDescription,
          side: 'top',
        },
      },
      {
        element: '[data-tour="btn-create-project"]',
        popover: {
          title: t.projects.newProject,
          description: t.onboarding.projects.createDescription,
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="project-card"]',
        popover: {
          title: 'Gestion des projets',
          description: t.onboarding.projects.cardDescription,
          side: 'top',
        },
      },
    ],
    pomodoro: [
      {
        element: '[data-tour="pomodoro-timer"]',
        popover: {
          title: t.pomodoro.title,
          description: t.onboarding.pomodoro.timerDescription,
          side: 'top',
        },
      },
      {
        element: '[data-tour="pomodoro-controls"]',
        popover: {
          title: 'Contrôles du minuteur',
          description: t.onboarding.pomodoro.controlsDescription,
          side: 'top',
        },
      },
      {
        element: '[data-tour="pomodoro-settings"]',
        popover: {
          title: t.pomodoro.settings,
          description: t.onboarding.pomodoro.settingsDescription,
          side: 'top',
        },
      },
    ],
  }
}

export function OnboardingTour({
  page,
  isPageLoaded,
  onNext,
  onComplete,
}: OnboardingTourProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const driverRef = useRef<any>(null)

  useEffect(() => {
    // Navigate to the page if not loaded
    if (!isPageLoaded) {
      const pageUrl = page === 'projects' ? '/projets' : `/${page}`
      router.push(pageUrl)
      return
    }

    // Block clicks outside the popover
    const handleOutsideClick = (e: MouseEvent) => {
      const popover = document.querySelector('.driver-popover')
      const overlay = document.querySelector('.driver-overlay')

      if (popover && overlay && !popover.contains(e.target as Node)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Wait a bit for page to fully render
    const timer = setTimeout(() => {
      const tourSteps = getTourSteps(t)
      const steps = tourSteps[page]

      driverRef.current = driver({
        allowClose: false,
        showProgress: true,
        steps: steps,
        onDestroyStarted: async () => {
          await onComplete()
        },
      })

      driverRef.current.drive()
      document.addEventListener('click', handleOutsideClick, true)
    }, 500)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleOutsideClick, true)
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [page, isPageLoaded, router, onNext, onComplete, t])

  return null
}
