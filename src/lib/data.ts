'use server'

import { connectToDatabase } from './db'
import { Business } from './db/models'
import { TalentStatus, SerializedTalent, SerializedBooking } from './types/data'

export async function getTalents(businessId: string) {
  try {
    await connectToDatabase()
    const business = await Business.findById(businessId)
    if (!business) {
      throw new Error('Business not found')
    }

    const talents = business.talents || []
    return {
      data: talents.map(talent => ({
        id: talent._id.toString(),
        name: talent.name,
        email: talent.email || '',
        basicInfo: talent.basicInfo,
        status: talent.status,
        imagePath: talent.imagePath,
        experience: talent.experience || 0,
        hourlyRate: talent.hourlyRate || 0,
        skills: talent.skills || []
      })),
      total: talents.length
    }
  } catch (error) {
    console.error('Failed to get talents:', error)
    return { data: [], total: 0 }
  }
}

export async function getTalentById(businessId: string, talentId: string) {
  try {
    await connectToDatabase()
    const business = await Business.findById(businessId)
    if (!business) {
      throw new Error('Business not found')
    }

    const talent = business.talents?.find(t => t._id.toString() === talentId)
    if (!talent) return null

    return {
      id: talent._id.toString(),
      name: talent.name,
      email: talent.email || '',
      basicInfo: talent.basicInfo,
      status: talent.status,
      imagePath: talent.imagePath,
      experience: talent.experience || 0,
      hourlyRate: talent.hourlyRate || 0,
      skills: talent.skills || []
    }
  } catch (error) {
    console.error('Failed to get talent:', error)
    return null
  }
}

export async function getBookings(businessId: string) {
  try {
    await connectToDatabase()
    const business = await Business.findById(businessId)
    if (!business) {
      throw new Error('Business not found')
    }

    const bookings = business.bookings || []
    return {
      data: bookings.map(booking => ({
        id: booking._id.toString(),
        talentId: booking.talentId.toString(),
        status: booking.status,
        startDate: booking.startDate,
        endDate: booking.endDate,
        hourlyRate: booking.hourlyRate,
        totalHours: booking.totalHours,
        totalAmount: booking.totalAmount,
        notes: booking.notes || '',
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      })),
      total: bookings.length
    }
  } catch (error) {
    console.error('Failed to get bookings:', error)
    return { data: [], total: 0 }
  }
}

export async function getBookingById(businessId: string, bookingId: string) {
  try {
    await connectToDatabase()
    const business = await Business.findById(businessId)
    if (!business) {
      throw new Error('Business not found')
    }

    const booking = business.bookings?.find(b => b._id.toString() === bookingId)
    if (!booking) return null

    return {
      id: booking._id.toString(),
      talentId: booking.talentId.toString(),
      status: booking.status,
      startDate: booking.startDate,
      endDate: booking.endDate,
      hourlyRate: booking.hourlyRate,
      totalHours: booking.totalHours,
      totalAmount: booking.totalAmount,
      notes: booking.notes || '',
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }
  } catch (error) {
    console.error('Failed to get booking:', error)
    return null
  }
}