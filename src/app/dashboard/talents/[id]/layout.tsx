'use client'

import { Tabs } from '@/components/ui/tabs'
import { useParams } from 'next/navigation'

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const talentId = params.id as string

  const tabs = [
    {
      name: 'Overview',
      href: `/dashboard/talents/${talentId}`,
    },
    {
      name: 'Edit',
      href: `/dashboard/talents/${talentId}/edit`,
    },
    {
      name: 'Booking Requests',
      href: `/dashboard/talents/${talentId}/bookings`,
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} />
      {children}
    </div>
  )
} 