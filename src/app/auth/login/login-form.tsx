'use client'

import { useRouter } from 'next/navigation'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { useFormValidation } from '@/hooks/use-form-validation'
import { loginSchema, type LoginFormData } from '@/lib/validation'
import { login } from '@/lib/actions'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setIsSubmitting
  } = useFormValidation<LoginFormData>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        const result = await login(values)
        
        if (result.success) {
          toast.success('Login successful')
          router.push('/dashboard')
          router.refresh()
        } else {
          toast.error(result.error || 'Login failed. Please check your credentials.')
        }
      } catch (error) {
        console.error('Login error:', error)
        toast.error('An unexpected error occurred. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Email"
        error={touched.email && errors.email?.[0]}
        required
      >
        <Input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email"
          autoComplete="email"
        />
      </FormField>

      <FormField
        label="Password"
        error={touched.password && errors.password?.[0]}
        required
      >
        <Input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </FormField>

      <LoadingButton type="submit" loading={isSubmitting} className="w-full">
        Sign In
      </LoadingButton>
    </form>
  )
} 