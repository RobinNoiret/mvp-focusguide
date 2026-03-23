'use client'

import { useState } from 'react'
import { CollapsibleSection } from './CollapsibleSection'
import { settingsService, type PomodoroSettings } from '@/services/settings-service'
import { cn } from '@/lib/utils'

interface PomodoroSettingsSectionProps {
  initialSettings: PomodoroSettings
  onUpdate?: (settings: PomodoroSettings) => void
}

export function PomodoroSettingsSection({ initialSettings, onUpdate }: PomodoroSettingsSectionProps) {
  const [settings, setSettings] = useState<PomodoroSettings>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleSettingChange = (key: keyof PomodoroSettings, value: number | boolean) => {
    setSettings({ ...settings, [key]: value })
    setIsDirty(true)
    setError(null)
    setSuccess(false)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      await settingsService.updatePomodoroSettings(settings)
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
    setSettings(initialSettings)
    setIsDirty(false)
    setError(null)
    setSuccess(false)
  }

  return (
    <CollapsibleSection title="Pomodoro Timer">
      <div className="space-y-6">
        {/* Focus Duration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="focusDuration" className="text-sm text-dark font-medium">
              Focus Duration
            </label>
            <span className="text-sm font-semibold text-dark bg-white px-2 py-1 rounded">{settings.focusDuration} min</span>
          </div>
          <input
            type="range"
            id="focusDuration"
            min="1"
            max="60"
            value={settings.focusDuration}
            onChange={(e) => handleSettingChange('focusDuration', parseInt(e.target.value))}
            style={{ '--value': `${(settings.focusDuration / 60) * 100}%` } as React.CSSProperties}
          />
        </div>

        {/* Break Duration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="breakDuration" className="text-sm text-dark font-medium">
              Break Duration
            </label>
            <span className="text-sm font-semibold text-dark bg-white px-2 py-1 rounded">{settings.breakDuration} min</span>
          </div>
          <input
            type="range"
            id="breakDuration"
            min="1"
            max="30"
            value={settings.breakDuration}
            onChange={(e) => handleSettingChange('breakDuration', parseInt(e.target.value))}
            style={{ '--value': `${((settings.breakDuration - 1) / (30 - 1)) * 100}%` } as React.CSSProperties}
          />
        </div>

        {/* Repetitions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="repetitions" className="text-sm text-dark font-medium">
              Repetitions
            </label>
            <span className="text-sm font-semibold text-dark bg-white px-2 py-1 rounded">{settings.repetitions}</span>
          </div>
          <input
            type="range"
            id="repetitions"
            min="1"
            max="10"
            value={settings.repetitions}
            onChange={(e) => handleSettingChange('repetitions', parseInt(e.target.value))}
            style={{ '--value': `${((settings.repetitions - 1) / (10 - 1)) * 100}%` } as React.CSSProperties}
          />
        </div>

        {/* Auto Switch */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-dark font-medium">
            Auto Switch
          </label>
          <button
            onClick={() => handleSettingChange('autoSwitch', !settings.autoSwitch)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0',
              settings.autoSwitch ? 'bg-dark' : 'bg-gray-300'
            )}
            role="switch"
            aria-checked={settings.autoSwitch}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 rounded-full bg-white',
                settings.autoSwitch ? 'translate-x-5' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            Settings saved ✓
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-white">
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-3 py-2 bg-chartreuse text-dark text-sm font-semibold rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleReset}
            disabled={saving || !isDirty}
            className="px-3 py-2 bg-white text-dark text-sm font-semibold border border-gray-300 rounded disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
