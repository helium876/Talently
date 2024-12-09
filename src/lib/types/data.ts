export enum TalentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FEATURED = 'FEATURED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export const TALENT_STATUSES = Object.values(TalentStatus)

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
  createdAt: string | null
  updatedAt: string | null
}

export interface SerializedTalent {
  id: string
  name: string
  email: string
  basicInfo: string
  status: TalentStatus
  imagePath: string | null
  experience: number
  hourlyRate: number
  skills: string[]
}

export interface SerializedBooking {
  id: string
  talentId: string
  status: BookingStatus
  startDate: string
  endDate: string
  hourlyRate: number
  totalHours: number
  totalAmount: number
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardData {
  business: SerializedBusiness
  totalTalents: number
  totalBookings: number
  recentTalents: SerializedTalent[]
  recentBookings: SerializedBooking[]
}

export type ViewMode = 'grid' | 'table' | 'list' 