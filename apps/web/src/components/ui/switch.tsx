'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultChecked?: boolean
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, defaultChecked, ...props }, ref) => {
    const [checked, setChecked] = React.useState(defaultChecked || false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked)
      props.onChange?.(e)
    }

    return (
      <>
        <input
          ref={ref}
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <button
          type="button"
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
            checked ? 'bg-blue-500 focus:ring-blue-500' : 'bg-gray-300 focus:ring-gray-300',
            className
          )}
          onClick={() => {
            const input = ref as React.RefObject<HTMLInputElement>
            if (input.current) {
              input.current.checked = !input.current.checked
              input.current.dispatchEvent(new Event('change', { bubbles: true }))
              setChecked(!checked)
            }
          }}
          aria-pressed={checked}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              checked ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
