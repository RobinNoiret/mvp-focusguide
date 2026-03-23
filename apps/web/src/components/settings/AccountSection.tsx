'use client'

import { type User } from '@/services/settings-service'
import { CollapsibleSection } from './CollapsibleSection'

interface AccountSectionProps {
  user: User
}

export function AccountSection({ user }: AccountSectionProps) {
  return (
    <CollapsibleSection title="Account Information">
      <div className="space-y-3">
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
      </div>
    </CollapsibleSection>
  )
}
