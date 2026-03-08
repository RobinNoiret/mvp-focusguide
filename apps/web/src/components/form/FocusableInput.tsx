import { forwardRef, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

export interface FocusableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Name of the form field (from react-hook-form register)
   */
  fieldName: string

  /**
   * Whether to focus this input when component mounts
   */
  autoFocus?: boolean

  /**
   * Additional className
   */
  className?: string
}

/**
 * Input component that properly integrates with react-hook-form
 * and supports auto-focus without TypeScript errors
 *
 * This replaces manual ref merging patterns that required @ts-expect-error
 */
export const FocusableInput = forwardRef<HTMLInputElement, FocusableInputProps>(
  ({ fieldName, autoFocus = false, className, ...props }) => {
    const { register } = useFormContext()
    const internalRef = useRef<HTMLInputElement>(null)

    // Register field with react-hook-form
    const { ref: registerRef, ...fieldProps } = register(fieldName)

    // Combine refs: internal ref + forwarded ref + register ref
    useEffect(() => {
      if (registerRef && internalRef.current) {
        registerRef(internalRef.current)
      }
    }, [registerRef])

    // Handle auto-focus
    useEffect(() => {
      if (autoFocus && internalRef.current) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          internalRef.current?.focus()
        })
      }
    }, [autoFocus])

    return (
      <input
        ref={internalRef}
        className={className}
        {...fieldProps}
        {...props}
      />
    )
  }
)

FocusableInput.displayName = 'FocusableInput'
