'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

interface DeleteConfirmationDialogProps {
  taskTitle: string
  isOpen: boolean
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationDialog({
  taskTitle,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isDeleting, onCancel])

  if (!isOpen || !mounted || typeof document === 'undefined') return null

  const portalRoot = document.body
  if (!portalRoot) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isDeleting && onCancel()}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3
                id="delete-dialog-title"
                className="text-lg font-semibold text-dark"
              >
                {t.modals.task.delete.title}
              </h3>
              <p
                id="delete-dialog-description"
                className="text-sm text-gray-500 mt-1"
              >
                {t.modals.task.delete.description} « {taskTitle} » ?
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            {t.modals.task.delete.description}
          </p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? t.common.deleting : t.common.delete}
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  )
}
