'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Talent {
  id: string
  name: string
  basicInfo: string
  status: string
  imagePath?: string
}

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTalents() {
      try {
        const response = await fetch('/api/talents')
        if (!response.ok) {
          throw new Error('Failed to fetch talents')
        }

        const data = await response.json()
        setTalents(data.talents)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadTalents()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading talents...</div>
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

  if (talents.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-gray-500">No talents found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Available Talents</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {talents.map((talent) => (
          <Card key={talent.id}>
            <CardHeader>
              <CardTitle>{talent.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600">{talent.basicInfo}</p>
                <div>
                  <span
                    className={`inline-block rounded px-2 py-1 text-sm font-semibold ${
                      talent.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : talent.status === 'FEATURED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {talent.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 