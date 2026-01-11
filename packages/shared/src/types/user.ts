export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  pomodoroSettings: PomodoroSettings
  createdAt: string
  updatedAt: string
}

export interface PomodoroSettings {
  focusDuration: number  // minutes, default: 25
  breakDuration: number  // minutes, default: 5
  repetitions: number    // default: 3
  autoSwitch: boolean    // default: true
}
