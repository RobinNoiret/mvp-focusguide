'use client'

import { useMemo } from 'react'
import zxcvbn from 'zxcvbn'

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return null
    return zxcvbn(password)
  }, [password])

  if (!strength) return null

  const score = strength.score // 0-4
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-chartreuse',
  ]
  const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded ${
              index <= score ? colors[score] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Force du mot de passe: <span className="font-medium">{labels[score]}</span>
      </p>
      {strength.feedback.warning && (
        <p className="text-sm text-orange-600">{strength.feedback.warning}</p>
      )}
    </div>
  )
}
