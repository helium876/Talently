'use client'

import { useState } from 'react'
import { LoadingButton } from '@/components/ui/loading-button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { useFormValidation } from '@/hooks/use-form-validation'
import { businessSchema } from '@/lib/form-validation'
import type { BusinessFormData } from '@/lib/form-validation'
import { createBusiness, updateBusiness } from '@/app/actions'

interface BusinessFormData {
  name: string
  email: string
  password: string
  id?: string
}

interface BusinessFormProps {
  initialData?: Partial<BusinessFormData>
  onSuccess?: () => void
}

export function BusinessForm({ initialData, onSuccess }: BusinessFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation<BusinessFormData>({
    initialValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: initialData?.password || '',
    },
    validation: businessSchema,
    onSubmit: async (data) => {
      setIsSubmitting(true)
      try {
        if (initialData?.id) {
          await updateBusiness(initialData.id, data)
        } else {
          await createBusiness(data)
        }
        onSuccess?.()
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Business Name"
        error={errors.name?.[0]}
        touched={touched.name}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Input
          id="name"
          name="name"
          value={values.name}
          placeholder="Enter business name"
          required
        />
      </FormField>

      <FormField
        label="Email"
        error={errors.email?.[0]}
        touched={touched.email}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          placeholder="Enter email address"
          required
        />
      </FormField>

      <FormField
        label="Password"
        error={errors.password?.[0]}
        touched={touched.password}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Input
          id="password"
          name="password"
          type="password"
          value={values.password}
          placeholder="Enter password"
          required
        />
      </FormField>

      <LoadingButton type="submit" loading={isSubmitting} className="w-full">
        {initialData ? 'Update Business' : 'Create Business'}
      </LoadingButton>
    </form>
  )
} 