'use client'

import { type User } from '@/services/settings-service'
import { CollapsibleSection } from './CollapsibleSection'

interface AccountSectionProps {
  user: User
}

export function AccountSection({ user }: AccountSectionProps) {
  return (
    <CollapsibleSection title="Account Information">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-ui-muted uppercase tracking-wide">
            Name
          </label>
          <p className="mt-2 text-base text-dark font-medium">{user.name}</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-ui-muted uppercase tracking-wide">
            Email
          </label>
          <p className="mt-2 text-base text-dark font-medium">{user.email}</p>
        </div>

        {user.emailVerified && (
          <div className="flex items-center gap-2 pt-2">
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
            <span className="text-sm text-green-600 font-medium">Email verified</span>
          </div>
        )}

        {!user.emailVerified && (
          <div className="flex items-center gap-2 pt-2">
            <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
            <span className="text-sm text-yellow-600 font-medium">Email not verified</span>
          </div>
        )}
      </div>
    </CollapsibleSection>
  )
}
