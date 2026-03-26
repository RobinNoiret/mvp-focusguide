'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)

    // Use external controlled value if provided, otherwise use internal state
    const checked = props.checked !== undefined ? props.checked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalChecked(e.target.checked)
      props.onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    const handleButtonClick = () => {
      const newChecked = !checked
      setInternalChecked(newChecked)
      onCheckedChange?.(newChecked)
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
          onClick={handleButtonClick}
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
