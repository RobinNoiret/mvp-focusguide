'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CollapsibleSection } from './CollapsibleSection'
import { userService, type CalendarSettings } from '@/services/user-service'
import { cn } from '@/lib/utils'

interface CalendarSettingsSectionProps {
  initialSettings: CalendarSettings | undefined
  onUpdate?: (settings: CalendarSettings) => void
}

const weekDays = [
  { label: 'Lundi', value: 1 },
  { label: 'Dimanche', value: 0 },
]

export function CalendarSettingsSection({ initialSettings, onUpdate }: CalendarSettingsSectionProps) {
  const [settings, setSettings] = useState<CalendarSettings>(
    initialSettings || { weekStartDay: 1 } // Default to Monday
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const queryClient = useQueryClient()

  const handleSettingChange = (value: number) => {
    setSettings({ weekStartDay: value })
    setIsDirty(true)
    setError(null)
    setSuccess(false)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      await userService.updateCalendarSettings(settings)
      // Invalidate React Query cache to refetch user data
      await queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      setSuccess(true)
      setIsDirty(false)
      onUpdate?.(settings)

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Save settings error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings'
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings(initialSettings || { weekStartDay: 1 })
    setIsDirty(false)
    setError(null)
    setSuccess(false)
  }

  return (
    <CollapsibleSection title="Calendrier">
      <div className="space-y-6">
        {/* Week Start Day */}
        <div className="space-y-3">
          <label className="text-sm text-dark font-medium block">Premier jour de la semaine</label>
          <div className="flex gap-2">
            {weekDays.map((day) => (
              <button
                key={day.value}
                onClick={() => handleSettingChange(day.value)}
                className={cn(
                  'px-4 py-2 rounded text-sm font-medium transition-colors flex-1',
                  settings.weekStartDay === day.value
                    ? 'bg-chartreuse text-dark'
                    : 'bg-gray-100 text-dark hover:bg-gray-200'
                )}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            Paramètres sauvegardés ✓
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-white">
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-3 py-2 bg-chartreuse text-dark text-sm font-semibold rounded disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            onClick={handleReset}
            disabled={saving || !isDirty}
            className="px-3 py-2 bg-white text-dark text-sm font-semibold border border-gray-300 rounded disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
