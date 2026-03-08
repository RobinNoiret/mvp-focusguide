'use client'

import { X, ChevronDown, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useIsDesktop } from '@/lib/hooks/use-media-query'

export function SidePanel() {
  const { sidePanelOpen, setSidePanelOpen } = useUIStore()
  const isDesktop = useIsDesktop()

  // On desktop, panel is always visible
  const isVisible = isDesktop || sidePanelOpen

  if (!isVisible) {
    return null
  }

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {!isDesktop && sidePanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidePanelOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-screen flex-col border-l border-[#E5E5E5] bg-white',
          'transition-transform duration-300 ease-in-out',
          isDesktop ? 'w-80' : 'w-full sm:w-80',
          !isDesktop && sidePanelOpen ? 'translate-x-0' : '',
          !isDesktop && !sidePanelOpen ? 'translate-x-full' : ''
        )}
        style={{
          boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.05)',
        }}
        role="complementary"
        aria-label="Panel des projets"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-4 py-4">
          <h2 className="text-lg font-semibold text-dark">Projet</h2>
          {!isDesktop && (
            <button
              onClick={() => setSidePanelOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
              aria-label="Fermer le panel"
            >
              <X className="h-5 w-5 text-dark" />
            </button>
          )}
        </div>

        {/* Project selector */}
        <div className="border-b border-[#E5E5E5] p-4">
          <button
            disabled
            className="flex w-full items-center justify-between rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 text-left opacity-60 transition-colors focus:outline-none focus:ring-2 focus:ring-chartreuse"
          >
            <span className="text-muted-foreground">
              Sélectionner un projet...
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body - Empty state */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <Folder className="mb-4 h-16 w-16 text-[#A0A0A0]" />
          <p className="text-[#A0A0A0]">
            Sélectionnez un projet pour voir ses tâches
          </p>
        </div>
      </aside>
    </>
  )
}

// Toggle button for mobile/tablet
export function SidePanelToggle() {
  const { sidePanelOpen, setSidePanelOpen } = useUIStore()
  const isDesktop = useIsDesktop()

  // Don't show toggle on desktop
  if (isDesktop) {
    return null
  }

  return (
    <button
      onClick={() => setSidePanelOpen(!sidePanelOpen)}
      className="fixed bottom-20 right-[4.5rem] z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 md:bottom-6 md:right-24"
      aria-label="Ouvrir le panel des projets"
      aria-expanded={sidePanelOpen}
    >
      <Folder className="h-5 w-5 text-dark" />
    </button>
  )
}
