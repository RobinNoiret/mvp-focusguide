/**
 * Merge multiple refs into one callback
 * Useful for combining react-hook-form register ref with custom refs
 *
 * @example
 * const { ref: registerRef } = register('field')
 * const myRef = useRef<HTMLInputElement>(null)
 *
 * <input ref={mergeRefs(registerRef, myRef)} />
 */
export function mergeRefs<T>(
  ...refs: (React.Ref<T> | ((instance: T | null) => void) | null | undefined)[]
): React.Ref<T> {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(instance)
      } else if ('current' in ref) {
        ;(ref as any).current = instance
      }
    })
  }
}
