import { getTalents, getBookings } from '@/lib/data'
import { requireAuth } from '@/lib/session'
import { DashboardContent } from './dashboard-content'
import { DashboardData, SerializedTalent, SerializedBooking } from '@/lib/types/data'

export default async function DashboardPage() {
  const session = await requireAuth()
  
  const [talents, bookings] = await Promise.all([
    getTalents(session.id),
    getBookings(session.id)
  ])

  const dashboardData: DashboardData = {
    business: session,
    totalTalents: talents?.total || 0,
    totalBookings: bookings?.total || 0,
    recentTalents: talents?.data?.slice(0, 5).map((talent): SerializedTalent => ({
      id: talent.id,
      name: talent.name || '',
      email: talent.email || '',
      basicInfo: talent.basicInfo || '',
      status: talent.status,
      imagePath: talent.imagePath,
      experience: talent.experience || 0,
      hourlyRate: talent.hourlyRate || 0,
      skills: talent.skills || []
    })) || [],
    recentBookings: bookings?.data?.slice(0, 5).map((booking): SerializedBooking => ({
      id: booking.id,
      talentId: booking.talentId,
      status: booking.status,
      startDate: booking.startDate ? new Date(booking.startDate).toISOString() : new Date().toISOString(),
      endDate: booking.endDate ? new Date(booking.endDate).toISOString() : new Date().toISOString(),
      hourlyRate: booking.hourlyRate || 0,
      totalHours: booking.totalHours || 0,
      totalAmount: booking.totalAmount || 0,
      notes: booking.notes || null,
      createdAt: booking.createdAt ? new Date(booking.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: booking.updatedAt ? new Date(booking.updatedAt).toISOString() : new Date().toISOString()
    })) || []
  }

  return <DashboardContent data={dashboardData} />
} 