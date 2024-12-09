'use client'

import { useState, useCallback } from 'react'
import { z } from 'zod'

export interface UseFormValidationOptions<T> {
  initialValues: T
  validationSchema?: z.ZodSchema<T>
  onSubmit: (values: T) => Promise<void> | void
}

export interface UseFormValidation<T> {
  values: T
  errors: Record<keyof T, string[]>
  touched: Record<keyof T, boolean>
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  setFieldValue: (field: keyof T, value: any) => void
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void
  resetForm: () => void
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormValidationOptions<T>): UseFormValidation<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>)
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback((name: keyof T, value: any) => {
    if (!validationSchema) return []

    try {
      const schema = z.object({ [name]: validationSchema.shape[name as string] })
      schema.parse({ [name]: value })
      return []
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors.map(err => err.message)
      }
      return ['Invalid value']
    }
  }, [validationSchema])

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const finalValue = type === 'number' ? Number(value) : value

    setValues(prev => ({
      ...prev,
      [name]: finalValue
    }))

    const fieldErrors = validateField(name as keyof T, finalValue)
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }))
  }, [validateField])

  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }, [])

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }))

    const fieldErrors = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors
    }))
  }, [validateField])

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: isTouched
    }))
  }, [])

  const validateForm = useCallback(() => {
    if (!validationSchema) return true

    try {
      validationSchema.parse(values)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {} as Record<keyof T, string[]>
        error.errors.forEach(err => {
          const path = err.path[0] as keyof T
          if (!newErrors[path]) {
            newErrors[path] = []
          }
          newErrors[path].push(err.message)
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [validationSchema, values])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {} as Record<keyof T, boolean>)
    setTouched(allTouched)

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateForm, onSubmit])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({} as Record<keyof T, string[]>)
    setTouched({} as Record<keyof T, boolean>)
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm
  }
} 