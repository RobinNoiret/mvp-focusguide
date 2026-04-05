'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import { useUpdatePomodoroSettings } from '@/hooks/useUpdatePomodoroSettings'
import { useTranslation } from '@/hooks/use-translation'
import { cn } from '@/lib/utils'

function getSettingsSchema(t: any) {
  return z.object({
    focusDuration: z
      .number()
      .int()
      .min(1, t.settings.pomodoro.minimumMessage)
      .max(60, 'Maximum 60 minutes'),
    breakDuration: z
      .number()
      .int()
      .min(1, t.settings.pomodoro.minimumMessage)
      .max(30, 'Maximum 30 minutes'),
    repetitions: z
      .number()
      .int()
      .min(1, 'Minimum 1 cycle')
      .max(10, 'Maximum 10 cycles'),
    autoSwitch: z.boolean(),
  })
}

type SettingsFormData = z.infer<ReturnType<typeof getSettingsSchema>>

interface PomodoroSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PomodoroSettingsModal({
  isOpen,
  onClose,
}: PomodoroSettingsModalProps) {
  const { settings, isRunning, updateSettings, stopTimer } = usePomodoroStore()
  const updateSettingsMutation = useUpdatePomodoroSettings()
  const { t } = useTranslation()
  const [showWarning, setShowWarning] = useState(false)
  const [pendingSettings, setPendingSettings] = useState<SettingsFormData | null>(null)

  const settingsSchema = getSettingsSchema(t)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    // AC 8: Pre-fill current values
    defaultValues: settings,
  })

  const onSubmit = (data: SettingsFormData) => {
    // Always show confirmation to reset timer when applying new settings
    setPendingSettings(data)
    setShowWarning(true)
    onClose() // Close modal immediately, confirmation will show on top
  }

  const applySettings = async (data: SettingsFormData) => {
    try {
      // AC 3: Update store
      updateSettings(data)

      // AC 3, 11: Persist to backend
      await updateSettingsMutation.mutateAsync(data)
    } finally {
      // Always close modal after attempting to save, regardless of success or error
      onClose()
    }
  }

  const handleConfirmChange = async () => {
    if (!pendingSettings) return

    // Apply new settings first, then reset timer with new values
    updateSettings(pendingSettings)
    // Persist to backend
    await updateSettingsMutation.mutateAsync(pendingSettings)
    // Reset timer to use new settings
    stopTimer()

    setShowWarning(false)
    setPendingSettings(null)
  }

  const handleCancelChange = () => {
    setShowWarning(false)
    setPendingSettings(null)
  }

  return (
    <>
      {/* AC 1, 2: Settings modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#262626]">
              {t.settings.pomodoro.title}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 py-4">
              {/* AC 2: Focus duration (1-60 min) */}
              <div className="space-y-2">
                <Label htmlFor="focusDuration">
                  {t.settings.pomodoro.focusDuration}
                </Label>
                <Input
                  id="focusDuration"
                  type="number"
                  {...register('focusDuration', { valueAsNumber: true })}
                  className={errors.focusDuration ? 'border-red-500' : ''}
                />
                {errors.focusDuration && (
                  <p className="text-sm text-red-500">
                    {errors.focusDuration.message}
                  </p>
                )}
              </div>

              {/* AC 2: Break duration (1-30 min) */}
              <div className="space-y-2">
                <Label htmlFor="breakDuration">
                  {t.settings.pomodoro.breakDuration}
                </Label>
                <Input
                  id="breakDuration"
                  type="number"
                  {...register('breakDuration', { valueAsNumber: true })}
                  className={errors.breakDuration ? 'border-red-500' : ''}
                />
                {errors.breakDuration && (
                  <p className="text-sm text-red-500">
                    {errors.breakDuration.message}
                  </p>
                )}
              </div>

              {/* AC 2: Repetitions (1-10) */}
              <div className="space-y-2">
                <Label htmlFor="repetitions">
                  {t.settings.pomodoro.repetitions}
                </Label>
                <Input
                  id="repetitions"
                  type="number"
                  {...register('repetitions', { valueAsNumber: true })}
                  className={errors.repetitions ? 'border-red-500' : ''}
                />
                {errors.repetitions && (
                  <p className="text-sm text-red-500">
                    {errors.repetitions.message}
                  </p>
                )}
              </div>

              {/* AC 2: Auto-switch toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSwitch" className="text-[#262626] font-medium">
                  {t.settings.pomodoro.autoSwitch}
                </Label>
                <Controller
                  name="autoSwitch"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0',
                        field.value ? 'bg-dark' : 'bg-gray-300'
                      )}
                      role="switch"
                      aria-checked={field.value}
                      id="autoSwitch"
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                          field.value ? 'translate-x-5' : 'translate-x-1'
                        )}
                      />
                    </button>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                {t.common.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-[#D9FC00] text-[#262626] hover:bg-[#c4e600]"
              >
                {t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AC 6: Warning dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier les paramètres ?</AlertDialogTitle>
            <AlertDialogDescription>
              Changer les paramètres réinitialisera le minuteur. Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelChange} onOpenChange={setShowWarning}>
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmChange}
              onOpenChange={setShowWarning}
              className="bg-[#D9FC00] text-[#262626] hover:bg-[#c4e600]"
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
