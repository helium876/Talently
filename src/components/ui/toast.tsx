'use client'

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message)
}

export function ToastContainer() {
  return (
    <SonnerToaster 
      position="bottom-right"
      theme="light"
      closeButton
      richColors
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #E5E7EB',
        },
        className: 'my-toast-class',
      }}
    />
  )
} 