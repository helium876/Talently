import { useState, useEffect } from 'react'

type ToastVariant = 'default' | 'destructive'

interface ToastProps {
  title?: string
  description?: string
  variant?: ToastVariant
}

interface Toast extends ToastProps {
  id: string
  visible: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => toast.visible)
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, variant, visible: true },
    ])

    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.map((t) =>
          t.id === id ? { ...t, visible: false } : t
        )
      )
    }, 3000)
  }

  return { toast, toasts }
} 