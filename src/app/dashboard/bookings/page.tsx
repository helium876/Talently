import { getBookings } from '@/lib/data'
import { requireAuth } from '@/lib/session'
import { BookingCard } from '@/components/booking-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SerializedBooking } from '@/lib/types/data'
import { serializeMongooseObject } from '@/lib/utils'

export default async function BookingsPage() {
  const session = await requireAuth()
  const { data: bookings } = await getBookings(session.id)

  const serializedBookings = bookings?.map(booking => 
    serializeMongooseObject<SerializedBooking>(booking)
  ) || []

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Link href="/dashboard/bookings/new">
          <Button>Add New Booking</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serializedBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            businessId={session.id}
          />
        ))}
      </div>
    </div>
  )
} 