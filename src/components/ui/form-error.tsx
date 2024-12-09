'use client'

interface FormErrorProps {
  message: string
}

export function FormError({ message }: FormErrorProps) {
  return (
    <p className="text-sm font-medium text-red-600">
      {message}
    </p>
  )
} 