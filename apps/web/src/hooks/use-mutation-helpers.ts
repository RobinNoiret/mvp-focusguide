import { useQueryClient, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleError, createMutationErrorHandler, getSuccessMessage } from '@/lib/error-handler'

export interface MutationConfig<TInput, TOutput> {
  /**
   * The mutation function to execute
   */
  mutationFn: (input: TInput) => Promise<TOutput>

  /**
   * Query key to invalidate/update
   */
  queryKey: string[]

  /**
   * Type of operation for error messages
   */
  mutationType: 'create' | 'update' | 'delete' | 'unlink' | 'link' | 'sync'

  /**
   * Name of the entity (for error messages)
   */
  entityName?: string

  /**
   * Optional optimistic update function
   */
  onOptimisticUpdate?: (queryClient: ReturnType<typeof useQueryClient>, input: TInput) => {
    previousData?: unknown
  }

  /**
   * Optional success callback
   */
  onSuccess?: (data: TOutput, input: TInput) => void

  /**
   * Custom error message (overrides default)
   */
  customErrorMessage?: string

  /**
   * Override success message (defaults to standard messages)
   */
  customSuccessMessage?: string

  /**
   * Show success toast?
   */
  showSuccessToast?: boolean

  /**
   * Override retry logic
   */
  retry?: number
}

/**
 * Create a standardized mutation hook with common patterns
 * - Optimistic updates
 * - Error rollback
 * - Query invalidation
 * - Toast notifications
 */
export function createMutationHook<TInput, TOutput>(config: MutationConfig<TInput, TOutput>) {
  return function useMutationHook(overrides?: Partial<UseMutationOptions<TOutput, Error, TInput>>) {
    const queryClient = useQueryClient()
    const entityName = config.entityName || 'item'

    return useMutation({
      mutationFn: config.mutationFn,

      onMutate: async (input) => {
        await queryClient.cancelQueries({ queryKey: config.queryKey })

        const context = {
          previousData: undefined as unknown,
        }

        // Run custom optimistic update if provided
        if (config.onOptimisticUpdate) {
          const result = config.onOptimisticUpdate(queryClient, input)
          context.previousData = result.previousData
        }

        return context
      },

      onError: (error, input, context) => {
        // Rollback on error
        if (context?.previousData !== undefined) {
          queryClient.setQueryData(config.queryKey, context.previousData)
        }

        // Show error toast
        handleError(error, {
          message: config.customErrorMessage || `Impossible de ${config.mutationType} ${entityName.toLowerCase()}`,
          description: 'Veuillez réessayer.',
          isRetryable: true,
          onRetry: () => {
            // Note: React Query will handle the retry
          },
        })

        // Call custom error handler if provided
        overrides?.onError?.(error, input, context)
      },

      onSuccess: (data, input, context) => {
        // Invalidate query to sync with server
        queryClient.invalidateQueries({ queryKey: config.queryKey })

        // Show success toast
        if (config.showSuccessToast !== false) {
          const message = config.customSuccessMessage || getSuccessMessage(config.mutationType)
          toast.success(message)
        }

        // Call custom success handler if provided
        if (config.onSuccess) {
          config.onSuccess(data, input)
        }

        overrides?.onSuccess?.(data, input, context)
      },

      retry: config.retry ?? 2,

      ...overrides,
    })
  }
}

/**
 * Simpler helper for basic mutations with minimal customization
 */
export function useMutationWithToast<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<TOutput>,
  options?: {
    successMessage?: string
    errorMessage?: string
    onSuccess?: (data: TOutput) => void
    onError?: (error: unknown) => void
  }
) {
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (options?.successMessage) {
        toast.success(options.successMessage)
      }
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      if (options?.errorMessage) {
        handleError(error, {
          message: options.errorMessage,
          description: 'Veuillez réessayer.',
        })
      }
      options?.onError?.(error)
    },
  })
}
