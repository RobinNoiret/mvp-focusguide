'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle } from 'lucide-react'

interface DeleteProjectConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  projectTitle: string
  taskCount: number
}

export function DeleteProjectConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  taskCount,
}: DeleteProjectConfirmationDialogProps) {
  const [mounted, setMounted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isDeleting, onClose])

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch {
      // Error handled by parent
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen || !mounted || typeof document === 'undefined') return null

  const dialogContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-project-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isDeleting && onClose()}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 id="delete-project-title" className="text-lg font-semibold text-dark">
              Supprimer ce projet ?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Êtes-vous sûr de vouloir supprimer &quot;{projectTitle}&quot; ?
          </p>

          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800 font-medium">
              {taskCount > 0 ? (
                <>
                  Toutes les <strong>{taskCount}</strong> tâche{taskCount > 1 && 's'} de ce projet seront également supprimée{taskCount > 1 && 's'}.
                </>
              ) : (
                <>Ce projet ne contient aucune tâche.</>
              )}
            </p>
            <p className="text-sm text-red-700 mt-2">
              Cette action est irréversible.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer le projet'}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}
