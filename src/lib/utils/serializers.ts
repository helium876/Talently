import { TalentStatus, BookingStatus } from '../types/data'

export interface SerializedTalent {
  id: string
  name: string
  email: string
  status: TalentStatus
  skills: string[]
  experience: number
  hourlyRate: number
  availability: string
  createdAt: string
  updatedAt: string
}

export interface SerializedBooking {
  id: string
  clientName: string
  clientEmail: string
  status: BookingStatus
  startDate: string
  endDate: string
  notes: string | null
  talentId: string
  createdAt: string
  updatedAt: string
}

export function serializeTalent(talent: any): SerializedTalent {
  return {
    id: talent._id.toString(),
    name: talent.name,
    email: talent.email,
    status: talent.status,
    skills: talent.skills || [],
    experience: talent.experience || 0,
    hourlyRate: talent.hourlyRate || 0,
    availability: talent.availability || '',
    createdAt: talent.createdAt.toISOString(),
    updatedAt: talent.updatedAt.toISOString()
  }
}

export function serializeBooking(booking: any): SerializedBooking {
  return {
    id: booking._id.toString(),
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    status: booking.status,
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    notes: booking.notes,
    talentId: booking.talentId.toString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString()
  }
} 