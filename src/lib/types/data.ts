export enum TalentStatus {
  ACTIVE = 'ACTIVE',
  FEATURED = 'FEATURED',
  INACTIVE = 'INACTIVE'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface SerializedTalent {
  id: string
  name: string
  basicInfo: string
  status: TalentStatus
  imagePath: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface SerializedBooking {
  id: string
  talentId?: string
  clientName: string
  clientEmail: string
  status: BookingStatus
  startDate: string | null
  endDate: string | null
  hourlyRate: number
  totalHours: number
  totalAmount: number
  notes: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface SerializedBusiness {
  id: string
  name: string
  email: string
  logoPath: string | null
  emailPreferences: {
    marketingEmails: boolean
    bookingNotifications: boolean
    weeklyDigest: boolean
  }
  talents: SerializedTalent[]
  bookings: SerializedBooking[]
  createdAt: string | null
  updatedAt: string | null
}

export interface DashboardData {
  business: SerializedBusiness
  totalTalents: number
  totalBookings: number
  recentTalents: SerializedTalent[]
  recentBookings: SerializedBooking[]
}

export type ViewMode = 'grid' | 'table' | 'list' 