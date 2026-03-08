'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      {children}
    </>
  )
}

interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-white p-6 shadow-lg',
          className
        )}
        {...props}
      />
    )
  }
)
AlertDialogContent.displayName = 'AlertDialogContent'

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)} {...props} />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
  )
)
AlertDialogTitle.displayName = 'AlertDialogTitle'

const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-600', className)} {...props} />
  )
)
AlertDialogDescription.displayName = 'AlertDialogDescription'

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onOpenChange?: (open: boolean) => void
}

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, onOpenChange, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors',
        className
      )}
      onClick={(e) => {
        props.onClick?.(e)
        onOpenChange?.(false)
      }}
      {...props}
    />
  )
)
AlertDialogAction.displayName = 'AlertDialogAction'

interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onOpenChange?: (open: boolean) => void
}

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, onOpenChange, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors',
        className
      )}
      onClick={(e) => {
        props.onClick?.(e)
        onOpenChange?.(false)
      }}
      {...props}
    />
  )
)
AlertDialogCancel.displayName = 'AlertDialogCancel'

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
