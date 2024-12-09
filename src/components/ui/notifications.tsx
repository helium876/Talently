import { toast } from 'sonner'
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { ReactNode } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationProps {
  type: NotificationType
  title: string
  message: string
  duration?: number
}

const notificationStyles = {
  success: {
    icon: CheckCircle,
    className: 'text-green-500',
    bgClass: 'bg-green-50 border-green-200'
  },
  error: {
    icon: AlertCircle,
    className: 'text-red-500',
    bgClass: 'bg-red-50 border-red-200'
  },
  info: {
    icon: Info,
    className: 'text-blue-500',
    bgClass: 'bg-blue-50 border-blue-200'
  },
  warning: {
    icon: AlertTriangle,
    className: 'text-yellow-500',
    bgClass: 'bg-yellow-50 border-yellow-200'
  }
}

export function useNotification() {
  const showNotification = ({
    type,
    title,
    message,
    duration = 5000
  }: NotificationProps) => {
    const style = notificationStyles[type]
    const Icon = style.icon

    const content = (
      <div>
        <div className="flex items-center">
          <Icon className={`w-5 h-5 mr-2 ${style.className}`} />
          <span className="font-medium">{title}</span>
        </div>
        <div className={`mt-1 rounded-md border p-4 ${style.bgClass}`}>
          {message}
        </div>
      </div>
    )

    switch (type) {
      case 'success':
        toast.success(content, { duration })
        break
      case 'error':
        toast.error(content, { duration })
        break
      case 'info':
        toast.info(content, { duration })
        break
      case 'warning':
        toast.warning(content, { duration })
        break
    }
  }

  return {
    success: (title: string, message: string, duration?: number) =>
      showNotification({ type: 'success', title, message, duration }),
    error: (title: string, message: string, duration?: number) =>
      showNotification({ type: 'error', title, message, duration }),
    info: (title: string, message: string, duration?: number) =>
      showNotification({ type: 'info', title, message, duration }),
    warning: (title: string, message: string, duration?: number) =>
      showNotification({ type: 'warning', title, message, duration }),
  }
} 