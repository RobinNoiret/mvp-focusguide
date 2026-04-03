'use client'

import { useEffect, useRef } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useRouter } from 'next/navigation'

type TourPage = 'today' | 'projects' | 'pomodoro'

interface OnboardingTourProps {
  page: TourPage
  isPageLoaded: boolean
  onNext: (nextPage: TourPage) => void
  onComplete: () => Promise<void>
}

const tourSteps: Record<TourPage, any[]> = {
  today: [
    {
      element: '[data-tour="kanban-board"]',
      popover: {
        title: 'Tableau Kanban - Organisez votre jour',
        description:
          'Voici votre tableau Kanban avec quatre colonnes : Backlog, À faire, En cours, et Done. Glissez-déposez vos tâches pour les mettre à jour.',
        side: 'top',
      },
    },
    {
      element: '[data-tour="column-todo"]',
      popover: {
        title: 'À faire aujourd\'hui',
        description:
          'Cette colonne contient les tâches que vous avez planifiées pour aujourd\'hui. Vous pouvez ajouter de nouvelles tâches ou en importer de vos projets.',
        side: 'right',
      },
    },
    {
      element: '[data-tour="column-in-progress"]',
      popover: {
        title: 'En cours',
        description:
          'Déplacez vos tâches ici quand vous commencez à les travailler. Cela vous aide à suivre votre progression et votre focus.',
        side: 'right',
      },
    },
    {
      element: '[data-tour="column-done"]',
      popover: {
        title: 'Done - Célébrez vos accomplissements',
        description:
          'Les tâches complétées apparaissent ici. Glissez vos tâches finies pour célébrer chaque accomplissement!',
        side: 'right',
      },
    },
    {
      element: '[data-tour="btn-create-task"]',
      popover: {
        title: 'Créer une tâche',
        description:
          'Cliquez ici pour créer une nouvelle tâche. Donnez-lui un nom et choisissez sa colonne de départ.',
        side: 'left',
      },
    },
    {
      element: '[data-tour="side-panel-toggle"]',
      popover: {
        title: 'Importer de vos projets',
        description:
          'Cliquez ici pour ouvrir le panneau latéral. Vous pouvez importer des tâches de vos projets dans votre vue quotidienne.',
        side: 'left',
      },
    },
  ],
  projects: [
    {
      element: '[data-tour="projects-grid"]',
      popover: {
        title: 'Vos projets',
        description:
          'Ici vous voyez tous vos projets. Cliquez sur un projet pour voir ses tâches organisées dans son propre tableau Kanban.',
        side: 'top',
      },
    },
    {
      element: '[data-tour="btn-create-project"]',
      popover: {
        title: 'Créer un projet',
        description:
          'Cliquez ici pour créer un nouveau projet. Donnez-lui un nom et une description pour organiser votre travail à long terme.',
        side: 'bottom',
      },
    },
    {
      element: '[data-tour="project-card"]',
      popover: {
        title: 'Gestion des projets',
        description:
          'Chaque projet a son propre tableau Kanban. Créez des tâches, glissez-les entre colonnes, et organisez votre travail efficacement.',
        side: 'top',
      },
    },
  ],
  pomodoro: [
    {
      element: '[data-tour="pomodoro-timer"]',
      popover: {
        title: 'Minuteur Pomodoro',
        description:
          'Ceci est votre minuteur Pomodoro. Il vous aide à gérer des cycles de travail focalisé et des pauses régulières pour une productivité optimale.',
        side: 'top',
      },
    },
    {
      element: '[data-tour="pomodoro-controls"]',
      popover: {
        title: 'Contrôles du minuteur',
        description:
          'Utilisez ces boutons pour démarrer/pauser le minuteur, le réinitialiser, ou l\'arrêter. Vous pouvez aussi utiliser vos raccourcis clavier (Espace, R, S).',
        side: 'top',
      },
    },
    {
      element: '[data-tour="pomodoro-settings"]',
      popover: {
        title: 'Configurer vos cycles',
        description:
          'Cliquez ici pour ajuster la durée de travail, de pause, le nombre de cycles et l\'auto-switch. Personnalisez selon votre préférence!',
        side: 'top',
      },
    },
  ],
}

export function OnboardingTour({
  page,
  isPageLoaded,
  onNext,
  onComplete,
}: OnboardingTourProps) {
  const router = useRouter()
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
      const steps = tourSteps[page]
      const finalStep = {
        element: '#nav-today',
        popover: {
          title:
            page === 'today'
              ? 'Découvrez les Projets'
              : page === 'projects'
                ? 'Essayez Pomodoro'
                : 'Vous êtes prêt!',
          description:
            page === 'today'
              ? 'Vous avez découvert le tableau Aujourd\'hui. Voyons maintenant comment gérer vos projets à long terme.'
              : page === 'projects'
                ? 'Excellente compréhension des projets! Maintenant, utilisez Pomodoro pour rester concentré.'
                : 'Vous maîtrisez maintenant toutes les fonctionnalités de FocusGuide. Commencez à gérer votre productivité!',
          side: 'right',
        },
      }

      driverRef.current = driver({
        allowClose: false,
        showProgress: true,
        steps: [...steps, finalStep],
        onDestroyStarted: async () => {
          if (page === 'today') {
            onNext('projects')
          } else if (page === 'projects') {
            onNext('pomodoro')
          } else {
            await onComplete()
          }
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
  }, [page, isPageLoaded, router, onNext, onComplete])

  return null
}
