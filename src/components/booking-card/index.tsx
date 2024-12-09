'use client'

import { Card } from '@/components/ui/card'
import { BookingStatus, SerializedBooking } from '@/lib/types/data'
import { formatCurrency } from '@/lib/utils'

interface BookingCardProps {
  booking: SerializedBooking;
  businessId: string;
}

export function BookingCard({ booking, businessId }: BookingCardProps) {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Booking #{booking.id.slice(-4)}</h3>
            <p className="text-sm text-gray-500">Talent ID: {booking.talentId}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-800' :
            booking.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {booking.status}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            {booking.startDate && booking.endDate ? (
              `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`
            ) : (
              'Dates not set'
            )}
          </p>
          <div className="mt-2 text-sm">
            <p>Rate: {formatCurrency(booking.hourlyRate)}/hr</p>
            <p>Hours: {booking.totalHours}</p>
            <p className="font-medium">Total: {formatCurrency(booking.totalAmount)}</p>
          </div>
          {booking.notes && (
            <p className="mt-2 text-sm text-gray-500">{booking.notes}</p>
          )}
        </div>
      </div>
    </Card>
  )
} 