'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Sidebar } from '@/components/layout/Sidebar'
import { OnboardingController } from '@/components/onboarding/OnboardingController'
import { useUIStore } from '@/stores/ui-store'
import { useIsMobile, useIsTablet } from '@/lib/hooks/use-media-query'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarCollapsed } = useUIStore()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  // Calculate content margin based on sidebar state
  const sidebarWidth = isMobile ? 0 : isTablet || sidebarCollapsed ? 64 : 240

  return (
    <ProtectedRoute>
      <div className="h-screen bg-light flex flex-col overflow-hidden">
        <OnboardingController />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main
            className={cn(
              'flex-1 transition-all duration-300 overflow-hidden',
              isMobile ? 'pb-16' : ''
            )}
            style={{
              marginLeft: sidebarWidth,
            }}
            role="main"
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
