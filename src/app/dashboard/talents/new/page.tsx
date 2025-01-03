'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NewTalentPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(event.currentTarget)
      const imageFile = (formData.get('image') as File)?.size > 0 ? formData.get('image') as File : null

      // First upload image if present
      let imagePath = null
      if (imageFile) {
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

      const response = await fetch('/api/talents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.get('userId'),
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          title: formData.get('title'),
          basicInfo: formData.get('basicInfo'),
          skills: formData.get('skills')?.toString().split(',').map(s => s.trim()),
          experience: formData.get('experience'),
          rate: Number(formData.get('rate')),
          status: formData.get('status') || 'pending',
          imagePath
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create talent')
      }

      router.push('/dashboard/talents')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Talent</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="userId" value="user_123" />
            
            <div>
              <Label htmlFor="image">Profile Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="e.g., Senior Developer" />
            </div>

            <div>
              <Label htmlFor="basicInfo">Basic Info</Label>
              <Textarea id="basicInfo" name="basicInfo" required placeholder="Brief description of the talent..." />
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" name="skills" required placeholder="e.g., JavaScript, React, Node.js" />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Textarea id="experience" name="experience" required placeholder="Details about work experience..." />
            </div>

            <div>
              <Label htmlFor="rate">Hourly Rate ($)</Label>
              <Input id="rate" name="rate" type="number" required min="0" step="0.01" />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
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
                {saving ? 'Creating...' : 'Create Talent'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 