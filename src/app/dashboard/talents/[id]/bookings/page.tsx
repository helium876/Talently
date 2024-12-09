import { dbConnect } from '@/lib/db'
import { Talent } from '@/models/talent'
import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'

export default async function TalentBookingsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  await dbConnect()
  const talent = await Talent.findById(params.id)
    .populate('business')
    .populate('bookingRequests')

  if (!talent) {
    redirect('/dashboard/talents')
  }

  // Verify ownership
  if (talent.business.id !== session.user.businessId) {
    redirect('/dashboard/talents')
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Bookings for {talent.name}
          </h2>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {talent.bookingRequests.length === 0 ? (
            <p className="text-gray-500">No booking requests yet.</p>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {talent.bookingRequests.map((booking) => (
                <li key={booking.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.clientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.clientEmail}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {booking.message}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
} 