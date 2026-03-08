import { toast as sonnerToast } from 'sonner'

export interface Toast {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function toast(props: Toast) {
  const { title, description, variant } = props

  const message = title ? (description ? `${title}\n${description}` : title) : description

  if (variant === 'destructive') {
    sonnerToast.error(message)
  } else {
    sonnerToast.success(message)
  }
}
