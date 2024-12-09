'use client'

import { Card } from '@/components/ui/card'
import { DashboardData, BookingStatus } from '@/lib/types/data'

interface DashboardStats {
  activeTalents: number
  featuredTalents: number
  pendingBookings: number
  confirmedBookings: number
}

interface DashboardContentProps {
  data: DashboardData & {
    stats: DashboardStats
  }
}

export function DashboardContent({ data }: DashboardContentProps) {
  const { stats, recentBookings, recentTalents } = data

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Total Talents</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalTalents}</p>
          <div className="mt-2">
            <span className="text-sm text-gray-700">Active: {stats.activeTalents}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm text-gray-700">Featured: {stats.featuredTalents}</span>
          </div>
        </Card>

        <Card className="p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Total Bookings</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalBookings}</p>
          <div className="mt-2">
            <span className="text-sm text-gray-700">Pending: {stats.pendingBookings}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm text-gray-700">Confirmed: {stats.confirmedBookings}</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.clientName}</p>
                      <p className="text-sm text-gray-700">{booking.clientEmail}</p>
                      <p className="text-sm text-gray-700">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      booking.status === BookingStatus.CONFIRMED
                        ? 'bg-green-100 text-green-800'
                        : booking.status === BookingStatus.PENDING
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-700">No recent bookings</p>
          )}
        </Card>

        <Card className="p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Talents</h3>
          {recentTalents.length > 0 ? (
            <div className="space-y-4">
              {recentTalents.map((talent) => (
                <div key={talent.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-gray-900">{talent.name}</p>
                  <p className="text-sm text-gray-700">{talent.basicInfo}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-700">No talents added yet</p>
          )}
        </Card>
      </div>
    </div>
  )
} 