'use client'

import { useState } from 'react'
import { type User } from '@/services/settings-service'
import { Button } from '@/components/ui/button'
import { CollapsibleSection } from './CollapsibleSection'
import { userService } from '@/services/user-service'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

interface AccountSectionProps {
  user: User
  onRestart?: () => void
}

export function AccountSection({ user, onRestart }: AccountSectionProps) {
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
      toast.success('Visite guidée réinitialisée. La visite va démarrer dans quelques secondes...')
      onRestart?.()
    } catch (error) {
      console.error('Failed to restart onboarding:', error)
      toast.error('Impossible de réinitialiser la visite guidée')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CollapsibleSection title="Account Information">
      <div className="space-y-4">
        <div>
          <p className="text-xs text-ui-muted mb-1">Name</p>
          <p className="text-sm text-dark">{user.name}</p>
        </div>

        <div>
          <p className="text-xs text-ui-muted mb-1">Email</p>
          <p className="text-sm text-dark">{user.email}</p>
        </div>

        {user.emailVerified && (
          <p className="text-xs text-green-600">✓ Email verified</p>
        )}

        <div className="pt-2 border-t border-ui-border">
          <p className="text-xs text-ui-muted mb-2">Guided Tour</p>
          <Button
            onClick={handleRestartOnboarding}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? 'Loading...' : 'Restart Tour'}
          </Button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
