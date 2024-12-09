'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/actions/auth'

interface Booking {
  id: string
  talentId: string
  clientName: string
  clientEmail: string
  startDate: string
  endDate: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function TalentBookingsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadBookings() {
      try {
        const session = await getSession()
        if (!session) {
          setError('Not authenticated')
          return
        }

        const response = await fetch(`/api/talents/${params.id}/bookings`)
        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }

        const data = await response.json()
        setBookings(data.bookings)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading bookings...</div>
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
        <h1 className="text-2xl font-bold">Talent Bookings</h1>
        <Button onClick={() => router.push(`/dashboard/talents/${params.id}/bookings/new`)}>
          Add New Booking
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <p className="text-lg text-gray-500">No bookings found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push(`/dashboard/talents/${params.id}/bookings/new`)}
            >
              Add Your First Booking
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>{booking.clientName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Email:</span> {booking.clientEmail}
                  </div>
                  <div>
                    <span className="font-medium">Start:</span>{' '}
                    {new Date(booking.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">End:</span>{' '}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`inline-block rounded px-2 py-1 text-sm font-semibold ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  {booking.notes && (
                    <div>
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/talents/${params.id}/bookings/${booking.id}/edit`)
                      }
                    >
                      Edit
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