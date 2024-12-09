'use server'

import { connectToDatabase } from './db'
import { Business } from './db/models'
import { SerializedTalent, SerializedBooking } from './types/data'
import { Types } from 'mongoose'

interface BusinessDoc {
  _id: Types.ObjectId;
  talents?: Array<{ _id: Types.ObjectId; [key: string]: any }>;
  bookings?: Array<{ _id: Types.ObjectId; [key: string]: any }>;
}

export async function getTalents(businessId: string) {
  try {
    await connectToDatabase()
    const business = await Business.findById(businessId).lean() as BusinessDoc
    if (!business) return { data: [], total: 0 }

    const talents = business.talents || []
    return {
      data: talents.map((talent: any) => ({
        id: talent._id.toString(),
        name: talent.name || '',
        basicInfo: talent.basicInfo || '',
        status: talent.status,
        imagePath: talent.imagePath || null,
        createdAt: talent.createdAt ? new Date(talent.createdAt).toISOString() : null,
        updatedAt: talent.updatedAt ? new Date(talent.updatedAt).toISOString() : null
      })),
      total: talents.length
    }
  } catch (error) {
    console.error('Error fetching talents:', error)
    return { data: [], total: 0 }
  }
}

export async function getTalentById(businessId: string, talentId: string) {
  try {
    await connectToDatabase()
    const business = await Business.findById(businessId).lean() as BusinessDoc
    if (!business) return null

    const talent = business.talents?.find((t: any) => t._id.toString() === talentId)
    if (!talent) return null

    return {
      id: talent._id.toString(),
      name: talent.name || '',
      basicInfo: talent.basicInfo || '',
      status: talent.status,
      imagePath: talent.imagePath || null,
      createdAt: talent.createdAt ? new Date(talent.createdAt).toISOString() : null,
      updatedAt: talent.updatedAt ? new Date(talent.updatedAt).toISOString() : null
    }
  } catch (error) {
    console.error('Error fetching talent:', error)
    return null
  }
}

export async function getBookings(businessId: string) {
  try {
    await connectToDatabase()
    const business = await Business.findById(businessId).lean() as BusinessDoc
    if (!business) return { data: [], total: 0 }

    const bookings = business.bookings || []
    return {
      data: bookings.map((booking: any) => ({
        id: booking._id.toString(),
        clientName: booking.clientName || '',
        clientEmail: booking.clientEmail || '',
        status: booking.status,
        startDate: booking.startDate ? new Date(booking.startDate).toISOString() : null,
        endDate: booking.endDate ? new Date(booking.endDate).toISOString() : null,
        hourlyRate: booking.hourlyRate || 0,
        totalHours: booking.totalHours || 0,
        totalAmount: booking.totalAmount || 0,
        notes: booking.notes || null,
        createdAt: booking.createdAt ? new Date(booking.createdAt).toISOString() : null,
        updatedAt: booking.updatedAt ? new Date(booking.updatedAt).toISOString() : null
      })),
      total: bookings.length
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return { data: [], total: 0 }
  }
}

export async function getBookingById(businessId: string, bookingId: string) {
  try {
    await connectToDatabase()
    const business = await Business.findById(businessId).lean() as BusinessDoc
    if (!business) return null

    const booking = business.bookings?.find((b: any) => b._id.toString() === bookingId)
    if (!booking) return null

    return {
      id: booking._id.toString(),
      clientName: booking.clientName || '',
      clientEmail: booking.clientEmail || '',
      status: booking.status,
      startDate: booking.startDate ? new Date(booking.startDate).toISOString() : null,
      endDate: booking.endDate ? new Date(booking.endDate).toISOString() : null,
      hourlyRate: booking.hourlyRate || 0,
      totalHours: booking.totalHours || 0,
      totalAmount: booking.totalAmount || 0,
      notes: booking.notes || null,
      createdAt: booking.createdAt ? new Date(booking.createdAt).toISOString() : null,
      updatedAt: booking.updatedAt ? new Date(booking.updatedAt).toISOString() : null
    }
  } catch (error) {
    console.error('Error fetching booking:', error)
    return null
  }
}