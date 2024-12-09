'use client'

import { Card } from '@/components/ui/card'
import { DashboardData } from '@/lib/types/data'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface DashboardContentProps {
  data: DashboardData
}

export function DashboardContent({ data }: DashboardContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="space-x-4">
          <Button asChild size="lg" className="shadow-sm">
            <Link href="/dashboard/talents/new" className="gap-2">
              <PlusIcon className="h-5 w-5" />
              Add Talent
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="shadow-sm">
            <Link href="/dashboard/bookings/new" className="gap-2">
              <PlusIcon className="h-5 w-5" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-900">Total Talents</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{data.totalTalents}</p>
        </Card>
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-900">Total Bookings</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{data.totalBookings}</p>
        </Card>
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-900">Total Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {formatCurrency(data.recentBookings.reduce((sum, booking) => sum + booking.totalAmount, 0))}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Talents</h2>
              <Button variant="ghost" asChild className="gap-2">
                <Link href="/dashboard/talents">
                  View All
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {data.recentTalents.map(talent => (
              <div key={talent.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{talent.name}</p>
                    <p className="text-sm text-gray-600">{talent.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    talent.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    talent.status === 'FEATURED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {talent.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{talent.basicInfo}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Button variant="ghost" asChild className="gap-2">
                <Link href="/dashboard/bookings">
                  View All
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {data.recentBookings.map(booking => (
              <div key={booking.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Booking #{booking.id.slice(-4)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Rate: {formatCurrency(booking.hourlyRate)}/hr</p>
                  <p>Hours: {booking.totalHours}</p>
                  <p className="font-medium text-gray-900">Total: {formatCurrency(booking.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
} 