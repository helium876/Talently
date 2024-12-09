'use client'

import { useState } from 'react'
import { FormField } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'
import { TalentStatus } from '@/lib/types/data'
import { useRouter } from 'next/navigation'
import { createTalent, updateTalent } from '@/lib/actions'
import { toast } from 'sonner'

interface TalentFormData {
  name: string
  basicInfo: string
  status: TalentStatus
  email: string
  experience: string
  hourlyRate: string
  skills: string
}

interface TalentFormProps {
  businessId: string
  initialData?: {
    id: string
    name: string
    basicInfo: string
    status: TalentStatus
    email: string
    experience: number
    hourlyRate: number
    skills: string[]
  }
}

export function TalentForm({ businessId, initialData }: TalentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<TalentFormData>({
    name: initialData?.name || '',
    basicInfo: initialData?.basicInfo || '',
    status: initialData?.status || TalentStatus.ACTIVE,
    email: initialData?.email || '',
    experience: initialData?.experience?.toString() || '',
    hourlyRate: initialData?.hourlyRate?.toString() || '',
    skills: initialData?.skills?.join(', ') || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (initialData) {
        await updateTalent(initialData.id, formData)
        toast.success('Talent updated successfully')
      } else {
        await createTalent(businessId, formData)
        toast.success('Talent created successfully')
      }
      router.push('/dashboard/talents')
    } catch (error) {
      toast.error('Something went wrong')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Name"
        name="name"
        required
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter talent name"
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter email address"
      />

      <FormField
        label="Basic Information"
        name="basicInfo"
        required
        value={formData.basicInfo}
        onChange={handleChange}
        placeholder="Enter basic information"
      />

      <FormField
        label="Experience (years)"
        name="experience"
        type="number"
        required
        value={formData.experience}
        onChange={handleChange}
        placeholder="Enter years of experience"
      />

      <FormField
        label="Hourly Rate ($)"
        name="hourlyRate"
        type="number"
        required
        value={formData.hourlyRate}
        onChange={handleChange}
        placeholder="Enter hourly rate"
      />

      <FormField
        label="Skills"
        name="skills"
        required
        value={formData.skills}
        onChange={handleChange}
        placeholder="Enter skills (comma separated)"
      />

      <div className="space-y-1">
        <label htmlFor="status" className="block text-sm font-medium text-gray-900">
          Status
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm text-gray-900"
        >
          {Object.values(TalentStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Talent' : 'Create Talent'}
        </Button>
      </div>
    </form>
  )
} 