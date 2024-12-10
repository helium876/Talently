'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TalentData {
  id: string
  businessId: string
  name: string
  email: string
  phone?: string
  title: string
  basicInfo: string
  skills: string[]
  experience: string
  rate: number
  status: string
  imagePath?: string
}

export default function TalentEditPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [talent, setTalent] = useState<TalentData | null>(null)

  useEffect(() => {
    async function loadTalent() {
      try {
        const response = await fetch(`/api/talents/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch talent')
        }
        const data = await response.json()
        setTalent(data.talent)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    loadTalent()
  }, [params.id])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(event.currentTarget)
      const imageFile = formData.get('image') as File
      
      // Only process image if a new one is selected
      let imagePath = talent?.imagePath
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData()
        imageFormData.append('file', imageFile)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        })
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }
        const { path } = await uploadResponse.json()
        imagePath = path
      }

      const response = await fetch(`/api/talents/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          title: formData.get('title'),
          basicInfo: formData.get('basicInfo'),
          skills: formData.get('skills')?.toString().split(',').map(s => s.trim()),
          experience: formData.get('experience'),
          rate: Number(formData.get('rate')),
          status: formData.get('status'),
          imagePath
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update talent')
      }

      router.push('/dashboard/talents')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading talent...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Talent not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Talent</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image">Profile Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
              {talent?.imagePath && (
                <div className="mt-2">
                  <img 
                    src={talent.imagePath} 
                    alt="Current profile" 
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={talent.name} required />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={talent.email} required />
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={talent.phone} />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={talent.title} required placeholder="e.g., Senior Developer" />
            </div>

            <div>
              <Label htmlFor="basicInfo">Basic Info</Label>
              <Textarea id="basicInfo" name="basicInfo" defaultValue={talent.basicInfo} required placeholder="Brief description of the talent..." />
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input 
                id="skills" 
                name="skills" 
                defaultValue={talent.skills.join(', ')} 
                required 
                placeholder="e.g., JavaScript, React, Node.js" 
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Textarea id="experience" name="experience" defaultValue={talent.experience} required placeholder="Details about work experience..." />
            </div>

            <div>
              <Label htmlFor="rate">Hourly Rate ($)</Label>
              <Input 
                id="rate" 
                name="rate" 
                type="number" 
                defaultValue={talent.rate} 
                required 
                min="0" 
                step="0.01" 
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={talent.status}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 