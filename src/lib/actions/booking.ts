'use server'

import { revalidatePath } from 'next/cache'
import { BookingService, BookingStatus, TalentService } from '../data'
import { logger } from '../monitoring/logger'
import { getSession } from './auth'

export async function createBooking(data: {
  talentId: string
  clientName: string
  clientEmail: string
  startDate: Date
  endDate: Date
  notes?: string
}) {
  try {
    // Check if talent exists and is active
    const talent = await TalentService.findById(data.talentId)
    if (!talent || talent.status !== 'ACTIVE') {
      return { error: 'Talent not found or not available' }
    }

    // Check availability
    const isAvailable = await BookingService.checkAvailability(
      data.talentId,
      data.startDate,
      data.endDate
    )
    if (!isAvailable) {
      return { error: 'This time slot is not available' }
    }

    const booking = await BookingService.create(data)

    logger.info('Booking created', { bookingId: booking.id })
    revalidatePath('/bookings')
    return { success: true, data: booking }
  } catch (error) {
    logger.error('Error creating booking', { error })
    return { error: 'An error occurred while creating booking' }
  }
}

export async function updateBooking(
  id: string,
  data: {
    clientName?: string
    clientEmail?: string
    startDate?: Date
    endDate?: Date
    notes?: string
    status?: BookingStatus
  }
) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership through talent
    const booking = await BookingService.findById(id)
    if (!booking) {
      return { error: 'Booking not found' }
    }

    const talent = await TalentService.findById(booking.talentId)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Booking not found' }
    }

    // Check availability if dates are being updated
    if (data.startDate || data.endDate) {
      const isAvailable = await BookingService.checkAvailability(
        booking.talentId,
        data.startDate || booking.startDate,
        data.endDate || booking.endDate
      )
      if (!isAvailable) {
        return { error: 'This time slot is not available' }
      }
    }

    const updatedBooking = await BookingService.update(id, data)
    if (!updatedBooking) {
      return { error: 'Booking not found' }
    }

    logger.info('Booking updated', { bookingId: id })
    revalidatePath('/bookings')
    revalidatePath(`/bookings/${id}`)
    return { success: true, data: updatedBooking }
  } catch (error) {
    logger.error('Error updating booking', { error, bookingId: id })
    return { error: 'An error occurred while updating booking' }
  }
}

export async function deleteBooking(id: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership through talent
    const booking = await BookingService.findById(id)
    if (!booking) {
      return { error: 'Booking not found' }
    }

    const talent = await TalentService.findById(booking.talentId)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Booking not found' }
    }

    const success = await BookingService.delete(id)
    if (!success) {
      return { error: 'Booking not found' }
    }

    logger.info('Booking deleted', { bookingId: id })
    revalidatePath('/bookings')
    return { success: true }
  } catch (error) {
    logger.error('Error deleting booking', { error, bookingId: id })
    return { error: 'An error occurred while deleting booking' }
  }
}

export async function getBookings(options: {
  talentId?: string
  status?: BookingStatus
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    // If talentId is provided, verify ownership
    if (options.talentId) {
      const talent = await TalentService.findById(options.talentId)
      if (!talent || talent.businessId !== session.id) {
        return { error: 'Talent not found' }
      }
    } else {
      // Get all talents for the business
      const talents = await TalentService.findByBusiness(session.id)
      options.talentId = talents[0]?.id // Use first talent if no specific talent is requested
    }

    const result = await BookingService.findMany(options)
    return { success: true, ...result }
  } catch (error) {
    logger.error('Error getting bookings', { error })
    return { error: 'An error occurred while getting bookings' }
  }
}

export async function getBooking(id: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    const booking = await BookingService.findById(id)
    if (!booking) {
      return { error: 'Booking not found' }
    }

    // Verify ownership through talent
    const talent = await TalentService.findById(booking.talentId)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Booking not found' }
    }

    return { success: true, data: booking }
  } catch (error) {
    logger.error('Error getting booking', { error, bookingId: id })
    return { error: 'An error occurred while getting booking' }
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership through talent
    const booking = await BookingService.findById(id)
    if (!booking) {
      return { error: 'Booking not found' }
    }

    const talent = await TalentService.findById(booking.talentId)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Booking not found' }
    }

    const updatedBooking = await BookingService.updateStatus(id, status)
    if (!updatedBooking) {
      return { error: 'Booking not found' }
    }

    logger.info('Booking status updated', { bookingId: id, status })
    revalidatePath('/bookings')
    revalidatePath(`/bookings/${id}`)
    return { success: true, data: updatedBooking }
  } catch (error) {
    logger.error('Error updating booking status', { error, bookingId: id })
    return { error: 'An error occurred while updating booking status' }
  }
}

export async function getUpcomingBookings(talentId: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership
    const talent = await TalentService.findById(talentId)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Talent not found' }
    }

    const bookings = await BookingService.findUpcoming(talentId)
    return { success: true, data: bookings }
  } catch (error) {
    logger.error('Error getting upcoming bookings', { error, talentId })
    return { error: 'An error occurred while getting upcoming bookings' }
  }
} 