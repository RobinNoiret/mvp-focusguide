'use client'

import { useState } from 'react'
import { type User } from '@/services/settings-service'
import { Button } from '@/components/ui/button'
import { CollapsibleSection } from './CollapsibleSection'
import { userService } from '@/services/user-service'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'

interface AccountSectionProps {
  user: User
  onRestart?: () => void
}

export function AccountSection({ user, onRestart }: AccountSectionProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleRestartOnboarding = async () => {
    try {
      setIsLoading(true)
      // Reset onboarding flag to false
      await userService.completeOnboarding(false)
      // Update local state to trigger onboarding display
      useAuthStore.setState((state) => ({
        user: state.user ? { ...state.user, flOnboarding: false } : null,
      }))
      toast.success(t.settings.account.restartSuccess)
      onRestart?.()
    } catch (error) {
      console.error('Failed to restart onboarding:', error)
      toast.error(t.settings.account.restartFailed)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CollapsibleSection title={t.settings.account.title}>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-ui-muted mb-1">{t.settings.account.name}</p>
          <p className="text-sm text-dark">{user.name}</p>
        </div>

        <div>
          <p className="text-xs text-ui-muted mb-1">{t.settings.account.email}</p>
          <p className="text-sm text-dark">{user.email}</p>
        </div>

        {user.emailVerified && (
          <p className="text-xs text-green-600">{t.settings.account.emailVerified}</p>
        )}

        <div className="pt-2 border-t border-ui-border">
          <p className="text-xs text-ui-muted mb-2">{t.settings.account.guidedTour}</p>
          <Button
            onClick={handleRestartOnboarding}
            disabled={isLoading}
            variant="outline"
            size="sm"
            title={t.settings.account.restartTooltip}
          >
            {isLoading ? t.common.loading : t.settings.account.restartTour}
          </Button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
