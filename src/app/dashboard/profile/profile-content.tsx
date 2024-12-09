'use client'

import { Card } from '@/components/ui/card'
import type { SerializedBusiness } from '@/lib/types/data'

interface ProfileContentProps {
  profile: SerializedBusiness & {
    logoPath: string | null
    emailPreferences: {
      marketingEmails: boolean
      bookingNotifications: boolean
      weeklyDigest: boolean
    }
  }
}

export function ProfileContent({ profile }: ProfileContentProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <p className="mt-1 text-base text-gray-900">{profile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <p className="mt-1 text-base text-gray-900">{profile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-base text-gray-900">
              {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Preferences</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">Marketing Emails</label>
              <p className="text-sm text-gray-700">Receive updates about new features and promotions</p>
            </div>
            <input
              type="checkbox"
              checked={profile.emailPreferences.marketingEmails}
              readOnly
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">Booking Notifications</label>
              <p className="text-sm text-gray-700">Get notified about new bookings and updates</p>
            </div>
            <input
              type="checkbox"
              checked={profile.emailPreferences.bookingNotifications}
              readOnly
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">Weekly Digest</label>
              <p className="text-sm text-gray-700">Receive a summary of your weekly activity</p>
            </div>
            <input
              type="checkbox"
              checked={profile.emailPreferences.weeklyDigest}
              readOnly
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>
    </div>
  )
} 