import { Document, Types } from 'mongoose'
import { Business } from '../db/models'
import { connectToDatabase as connectDB } from '../db'
import { BookingStatus, SerializedBooking } from '../types/data'

function serializeBooking(doc: any): SerializedBooking {
  return {
    id: doc._id.toString(),
    clientName: doc.clientName || '',
    clientEmail: doc.clientEmail || '',
    status: doc.status,
    startDate: doc.startDate ? new Date(doc.startDate).toISOString() : new Date().toISOString(),
    endDate: doc.endDate ? new Date(doc.endDate).toISOString() : new Date().toISOString(),
    hourlyRate: doc.hourlyRate || 0,
    totalHours: doc.totalHours || 0,
    totalAmount: doc.totalAmount || 0,
    notes: doc.notes || null,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null
  }
}

export async function getBookings(businessId: string) {
  try {
    await connectDB()
    
    const business = await Business.findById(businessId).lean()
    if (!business) {
      throw new Error('Business not found')
    }

    const serializedBookings = (business.bookings || []).map(serializeBooking)

    return {
      success: true,
      data: serializedBookings,
      total: serializedBookings.length
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return {
      success: false,
      error: 'Failed to fetch bookings',
      data: []
    }
  }
} 