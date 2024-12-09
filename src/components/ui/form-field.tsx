'use client'

import { Label } from './label'
import { Input } from './input'
import { FormError } from './form-error'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  error,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full text-gray-900 placeholder:text-gray-500"
      />
      {error && <FormError message={error} />}
    </div>
  )
} 