import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user-service'
import { usePomodoroStore } from '@/stores/pomodoroStore'

export function useLoadPomodoroSettings() {
  const { data: user } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userService.getMe(),
  })

  const { updateSettings } = usePomodoroStore()

  // AC 5: Load settings from backend
  useEffect(() => {
    if (user?.pomodoro_settings) {
      updateSettings(user.pomodoro_settings)
    }
  }, [user, updateSettings])
}
