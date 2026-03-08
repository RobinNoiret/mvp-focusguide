import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user-service'
import type { PomodoroSettings } from '@focus-guide/shared'
import { toast } from '@/hooks/use-toast'

export function useUpdatePomodoroSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: PomodoroSettings) =>
      userService.updatePomodoroSettings(settings),

    onSuccess: () => {
      // AC 11: Sync via API
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })

      toast({
        title: 'Succès',
        description: 'Paramètres Pomodoro enregistrés',
      })
    },

    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres',
        variant: 'destructive',
      })
    },
  })
}
