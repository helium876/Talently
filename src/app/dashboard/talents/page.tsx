'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Talent {
  id: string
  name: string
  basicInfo: string
  status: string
  imagePath?: string
}

export default function TalentsDashboardPage() {
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Talents</h1>
        <Button asChild>
          <Link href="/dashboard/talents/new">Add New Talent</Link>
        </Button>
      </div>

      {talents.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <p className="text-lg text-gray-500">No talents found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/talents/new">Add Your First Talent</Link>
            </Button>
          </div>
        </div>
      ) : (
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
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/talents/${talent.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/talents/${talent.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 