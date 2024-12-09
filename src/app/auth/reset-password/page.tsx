'use client'

import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { handlePasswordReset, handlePasswordResetRequest } from '@/lib/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { LoadingButton } from '@/components/ui/loading-button'
import { FormError } from '@/components/ui/form-error'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [error, setError] = useState<string>()
  const [validationErrors, setValidationErrors] = useState<{
    email?: boolean
    password?: boolean
  }>({})

  const validateForm = (formData: FormData) => {
    const errors = {
      email: token ? false : !formData.get('email'),
      password: token ? !formData.get('password') : false,
    }

    setValidationErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  async function clientAction(formData: FormData) {
    const result = token 
      ? await handlePasswordReset(formData)
      : await handlePasswordResetRequest(formData)
    
    if (result?.error) {
      setError(result.error)
      toast.error(result.error)
    } else if (result?.success) {
      if (token) {
        toast.success('Password reset successfully!')
        router.push('/auth/login')
      } else {
        toast.success('Password reset instructions sent')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {token ? 'Reset your password' : 'Forgot your password?'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {token ? (
              'Enter your new password below'
            ) : (
              'Enter your email address and we will send you a password reset link'
            )}
          </p>
        </div>

        <form 
          className="mt-8 space-y-6" 
          action={clientAction}
          onSubmit={(e) => {
            if (!validateForm(new FormData(e.currentTarget))) {
              e.preventDefault()
            }
          }}
        >
          {token && (
            <input type="hidden" name="token" value={token} />
          )}

          <div className="rounded-md shadow-sm space-y-4">
            {!token ? (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  error={!!validationErrors.email}
                  placeholder="Email address"
                  className="appearance-none block w-full px-3 py-2"
                  onChange={() => {
                    setValidationErrors((prev) => ({ ...prev, email: false }))
                    setError(undefined)
                  }}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="password" className="sr-only">
                  New password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  error={!!validationErrors.password}
                  placeholder="New password"
                  className="appearance-none block w-full px-3 py-2"
                  onChange={() => {
                    setValidationErrors((prev) => ({ ...prev, password: false }))
                    setError(undefined)
                  }}
                />
              </div>
            )}
          </div>

          <FormError error={error} />

          <div>
            <LoadingButton type="submit" className="w-full">
              {token ? 'Reset password' : 'Send reset link'}
            </LoadingButton>
          </div>

          <div className="text-sm text-center">
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 