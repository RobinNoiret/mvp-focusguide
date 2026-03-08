import { toast } from 'sonner'

export interface ErrorHandlerContext {
  /**
   * User-friendly error message to display
   */
  message: string

  /**
   * Optional description for the toast
   */
  description?: string

  /**
   * Whether the action can be retried
   */
  isRetryable?: boolean

  /**
   * Callback when user clicks retry
   */
  onRetry?: () => void

  /**
   * Log the error to console (dev mode)
   */
  logError?: boolean
}

/**
 * Centralized error handler for mutations and async operations
 * Provides consistent toast notifications and error logging
 */
export function handleError(error: unknown, context: ErrorHandlerContext) {
  // Log error in development
  if (context.logError !== false && process.env.NODE_ENV === 'development') {
    console.error('[Error Handler]', context.message, error)
  }

  // Build toast action if retryable
  const action = context.isRetryable && context.onRetry
    ? {
        label: 'Réessayer',
        onClick: context.onRetry,
      }
    : undefined

  // Show error toast
  toast.error(context.message, {
    description: context.description,
    action,
  })
}

/**
 * Common error messages for mutations
 */
export const ERROR_MESSAGES = {
  CREATE: {
    message: 'Impossible de créer',
    description: 'Veuillez réessayer.',
  },
  UPDATE: {
    message: 'Impossible de modifier',
    description: 'Veuillez réessayer.',
  },
  DELETE: {
    message: 'Impossible de supprimer',
    description: 'Veuillez réessayer.',
  },
  UNLINK: {
    message: 'Impossible de retirer',
    description: 'Veuillez réessayer.',
  },
  LINK: {
    message: 'Impossible de lier',
    description: 'Veuillez réessayer.',
  },
  SYNC: {
    message: 'Erreur de synchronisation',
    description: 'Veuillez réessayer.',
  },
} as const

/**
 * Common success messages for mutations
 */
export const SUCCESS_MESSAGES = {
  CREATE: 'Créé avec succès',
  UPDATE: 'Modifié avec succès',
  DELETE: 'Supprimé avec succès',
  UNLINK: 'Retiré avec succès',
  LINK: 'Lié avec succès',
  SYNC: 'Synchronisé',
} as const

/**
 * Create a standardized error handler for a mutation
 */
export function createMutationErrorHandler(context: {
  type: 'create' | 'update' | 'delete' | 'unlink' | 'link' | 'sync'
  entityName: string
  onRetry?: () => void
}) {
  const errorConfig = ERROR_MESSAGES[context.type.toUpperCase() as keyof typeof ERROR_MESSAGES]

  return (error: unknown) => {
    handleError(error, {
      message: `${errorConfig.message} ${context.entityName}`,
      description: errorConfig.description,
      isRetryable: !!context.onRetry,
      onRetry: context.onRetry,
    })
  }
}

/**
 * Get success message for a mutation
 */
export function getSuccessMessage(type: 'create' | 'update' | 'delete' | 'unlink' | 'link' | 'sync'): string {
  return SUCCESS_MESSAGES[type.toUpperCase() as keyof typeof SUCCESS_MESSAGES]
}
