'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  taskTitle: string
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: DeleteConfirmationDialogProps) {
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
      // Error handled by caller
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen || !mounted || typeof document === 'undefined') return null

  const dialogContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isDeleting && onClose()}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2
                id="delete-dialog-title"
                className="text-lg font-semibold text-dark"
              >
                Supprimer cette tâche ?
              </h2>
              <p
                id="delete-dialog-description"
                className="mt-1 text-sm text-gray-600"
              >
                Êtes-vous sûr de vouloir supprimer &quot;{taskTitle}&quot; ?
                Cette action est irréversible.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}
