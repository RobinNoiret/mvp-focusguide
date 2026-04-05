'use client'

import { useEffect, useState } from 'react'
import { userService } from '@/services/user-service'
import { useTranslation } from '@/hooks/use-translation'
import type { User } from '@/services/settings-service'
import { AccountSection } from '@/components/settings/AccountSection'
import { PomodoroSettingsSection } from '@/components/settings/PomodoroSettingsSection'
import { LanguageSelectorSection } from '@/components/settings/LanguageSelectorSection'

export default function SettingsPage() {
  const { t } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const data = await userService.getMe()
      setUser(data as User)
    } catch (err) {
      setError(t.errors.loadFailed)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-ui-muted">{t.common.loading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="border-b border-ui-border px-6 py-6">
          <h1 className="text-2xl font-semibold text-dark">Paramètres</h1>
        </div>

        {/* Settings Sections */}
        <div className="px-6">
          {user && (
            <>
              <AccountSection user={user} onRestart={fetchUser} />
              <LanguageSelectorSection />
              <PomodoroSettingsSection initialSettings={user.pomodoro_settings} onUpdate={fetchUser} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
