'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  sidePanelOpen: boolean
  mobileMenuOpen: boolean

  // Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidePanel: () => void
  setSidePanelOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidePanelOpen: false,
      mobileMenuOpen: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      toggleSidePanel: () =>
        set((state) => ({ sidePanelOpen: !state.sidePanelOpen })),

      setSidePanelOpen: (open) =>
        set({ sidePanelOpen: open }),

      setMobileMenuOpen: (open) =>
        set({ mobileMenuOpen: open }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidePanelOpen: state.sidePanelOpen,
      }),
    }
  )
)
