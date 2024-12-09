'use client'

import { useState } from 'react'
import { LoadingButton } from '@/components/ui/loading-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { FormField } from '@/components/ui/form-field'
import { useFormValidation } from '@/hooks/use-form-validation'
import { bookingSchema, BookingStatus } from '@/lib/form-validation'
import type { BookingFormData } from '@/lib/form-validation'
import { createBooking, updateBooking } from '@/app/actions'

interface BookingFormData {
  message: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  talentId: string
  startDate: Date
  endDate: Date
  businessId: string
  clientName: string
  clientEmail: string
  notes?: string | null
  id?: string
}

interface BookingFormProps {
  initialData?: Partial<BookingFormData>
  onSuccess?: () => void
}

export function BookingForm({ businessId, talentId, initialData, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation<BookingFormData>({
    initialValues: {
      clientName: initialData?.clientName || '',
      clientEmail: initialData?.clientEmail || '',
      message: initialData?.message || '',
      status: initialData?.status || BookingStatus.PENDING,
      startDate: initialData?.startDate || new Date().toISOString(),
      endDate: initialData?.endDate || new Date().toISOString(),
      notes: initialData?.notes || null,
      talentId,
      businessId,
    },
    validation: bookingSchema,
    onSubmit: async (data) => {
      setIsSubmitting(true)
      try {
        const formattedData = {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate)
        }

        if (initialData?.id) {
          await updateBooking(initialData.id, formattedData)
        } else {
          await createBooking(formattedData)
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
        label="Client Name"
        error={errors.clientName?.[0]}
        touched={touched.clientName}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Input
          id="clientName"
          name="clientName"
          value={values.clientName}
          placeholder="Enter client name"
          required
        />
      </FormField>

      <FormField
        label="Client Email"
        error={errors.clientEmail?.[0]}
        touched={touched.clientEmail}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Input
          id="clientEmail"
          name="clientEmail"
          type="email"
          value={values.clientEmail}
          placeholder="Enter client email"
          required
        />
      </FormField>

      <FormField
        label="Message"
        error={errors.message?.[0]}
        touched={touched.message}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Textarea
          id="message"
          name="message"
          value={values.message}
          placeholder="Enter booking message"
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          error={errors.startDate?.[0]}
          touched={touched.startDate}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            value={values.startDate}
            required
          />
        </FormField>

        <FormField
          label="End Date"
          error={errors.endDate?.[0]}
          touched={touched.endDate}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <Input
            id="endDate"
            name="endDate"
            type="datetime-local"
            value={values.endDate}
            required
          />
        </FormField>
      </div>

      <FormField
        label="Status"
        error={errors.status?.[0]}
        touched={touched.status}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Select
          id="status"
          name="status"
          value={values.status}
          required
        >
          <option value={BookingStatus.PENDING}>Pending</option>
          <option value={BookingStatus.CONFIRMED}>Confirmed</option>
          <option value={BookingStatus.CANCELLED}>Cancelled</option>
        </Select>
      </FormField>

      <FormField
        label="Notes"
        error={errors.notes?.[0]}
        touched={touched.notes}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <Textarea
          id="notes"
          name="notes"
          value={values.notes || ''}
          placeholder="Enter additional notes (optional)"
        />
      </FormField>

      <LoadingButton type="submit" loading={isSubmitting} className="w-full">
        {initialData ? 'Update Booking' : 'Create Booking'}
      </LoadingButton>
    </form>
  )
} 