import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { dbConnect } from '@/lib/db'
import { BookingRequest } from '@/models/booking-request'

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: { bookingId?: string }
}) {
  const { bookingId } = searchParams

  if (!bookingId) {
    redirect('/talents')
  }

  await dbConnect()
  const booking = await BookingRequest.findById(bookingId).populate('talent')

  if (!booking) {
    redirect('/talents')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-gray-600">
            Your booking request for {booking.talent.name} has been submitted successfully.
          </p>
          
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="text-sm font-semibold text-gray-900">What happens next?</h2>
            <ul className="mt-4 text-sm text-gray-600 space-y-3">
              <li>• The business will review your request</li>
              <li>• You'll receive an email confirmation shortly</li>
              <li>• They will contact you to discuss details</li>
            </ul>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href={`/talents/${booking.talent.id}`}
              className="block w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View Talent Profile
            </Link>
            <Link
              href="/"
              className="block w-full rounded-md bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 