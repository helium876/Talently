'use client'

import { Card } from '@/components/ui/card'
import { BookingStatus } from '@/lib/types/data'

interface BookingCardProps {
  booking: {
    id: string
    clientName: string
    clientEmail: string
    status: BookingStatus
    startDate: string
    endDate: string
    notes: string | null
  }
  businessId: string
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{booking.clientName}</h3>
            <p className="text-sm text-gray-500">{booking.clientEmail}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {booking.status}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
          </p>
          {booking.notes && (
            <p className="mt-2 text-sm text-gray-500">{booking.notes}</p>
          )}
        </div>
      </div>
    </Card>
  )
} 