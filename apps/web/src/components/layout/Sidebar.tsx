'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  Calendar,
  Folder,
  Timer,
  Menu,
  X,
  MoreVertical,
  LogOut,
  Settings,
  CheckSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import { authService } from '@/services/auth-service'
import { useIsMobile, useIsTablet } from '@/lib/hooks/use-media-query'
import { AppIcon } from '@/components/icons/AppIcon'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  disabled?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/today', icon: Home },
  { label: 'Calendrier', href: '/calendar', icon: Calendar },
  { label: 'To Do', href: '/to-do', icon: CheckSquare },
  { label: 'Projets', href: '/projets', icon: Folder },
  { label: 'Pomodoro', href: '/pomodoro', icon: Timer },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  // On tablet, sidebar is always collapsed
  const isCollapsed = isTablet || sidebarCollapsed

  const handleLogout = async () => {
    await authService.logout()
    router.push('/login')
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Mobile bottom navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile overlay menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-4 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <AppIcon variant="black" className="h-6 w-6" />
                    <span className="text-xl font-light font-display text-dark">Focus Guide</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 hover:bg-gray-100"
                    aria-label="Fermer le menu"
                  >
                    <X className="h-5 w-5 text-dark" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4" role="navigation">
                  <ul className="space-y-2">
                    {navItems.map((item) => {
                      const isActive = item.href === '/projets'
                        ? pathname.startsWith('/projets')
                        : pathname === item.href
                      const Icon = item.icon

                      return (
                        <li key={item.href}>
                          {item.disabled ? (
                            <span
                              className="flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground opacity-50"
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </span>
                          ) : (
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
                                isActive
                                  ? 'bg-chartreuse font-semibold text-dark'
                                  : 'text-dark hover:bg-gray-100'
                              )}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </nav>

                {/* User profile */}
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chartreuse text-sm font-semibold text-dark">
                      {getInitials(user?.name)}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="truncate font-medium text-dark">{user?.name}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="rounded-lg p-2 hover:bg-gray-100"
                      aria-label="Se déconnecter"
                    >
                      <LogOut className="h-5 w-5 text-dark" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Bottom navigation bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white" role="navigation">
          <ul className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = item.href === '/projets'
                ? pathname.startsWith('/projets')
                : pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  {item.disabled ? (
                    <span className="flex flex-col items-center p-2 opacity-50">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex flex-col items-center rounded-lg p-2 transition-colors',
                        isActive ? 'bg-chartreuse' : 'hover:bg-gray-100'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className={cn('h-5 w-5', isActive ? 'text-dark' : 'text-dark')} />
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </>
    )
  }

  // Desktop/Tablet sidebar
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header with logo */}
      <div className="flex items-center border-b border-border p-4 gap-3 transition-all duration-300">
        <AppIcon variant="black" className="h-6 w-6 flex-shrink-0" />
        <span className={cn(
          'text-lg font-light font-display text-dark transition-all duration-300 whitespace-nowrap overflow-hidden',
          isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        )}>
          Focus Guide
        </span>
      </div>

      {/* Toggle button */}
      {!isTablet && (
        <button
          onClick={toggleSidebar}
          className={cn(
            'absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:bg-gray-50',
          )}
          aria-label={isCollapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
        >
          {isCollapsed ? (
            <Menu className="h-3 w-3 text-dark" />
          ) : (
            <X className="h-3 w-3 text-dark" />
          )}
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3" role="navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/projets'
              ? pathname.startsWith('/projets')
              : pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                {item.disabled ? (
                  <span
                    className={cn(
                      'flex items-center rounded-lg px-3 py-3 text-muted-foreground opacity-50',
                      isCollapsed ? 'justify-center' : 'gap-3'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-3 transition-colors',
                      isCollapsed ? 'justify-center' : 'gap-3',
                      isActive
                        ? 'bg-chartreuse font-semibold text-dark'
                        : 'text-dark hover:bg-gray-100'
                    )}
                    title={isCollapsed ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User profile section */}
      <div className="relative border-t border-border p-3">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-3 hover:bg-gray-100',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}
          aria-expanded={userMenuOpen}
          aria-haspopup="true"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-chartreuse text-sm font-semibold text-dark">
            {getInitials(user?.name)}
          </div>
          {!isCollapsed && (
            <>
              <span className="flex-1 truncate text-left font-medium text-dark">
                {user?.name}
              </span>
              <MoreVertical className="h-4 w-4 text-dark" />
            </>
          )}
        </button>

        {/* User dropdown menu */}
        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <div
              className={cn(
                'absolute bottom-full z-50 mb-2 w-48 rounded-lg border border-border bg-white py-1 shadow-lg',
                isCollapsed ? 'left-full ml-2' : 'left-3'
              )}
            >
              <Link
                href="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-dark hover:bg-gray-100"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <hr className="my-1 border-border" />
              <button
                onClick={() => {
                  setUserMenuOpen(false)
                  handleLogout()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-dark hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
