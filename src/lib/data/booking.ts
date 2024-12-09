import { Types } from 'mongoose'
import { Booking, BookingStatus, dbConnect } from '../db/models'
import { logger } from '../monitoring/logger'

export interface CreateBookingInput {
  talentId: string
  clientName: string
  clientEmail: string
  startDate: Date
  endDate: Date
  notes?: string
}

export interface UpdateBookingInput {
  clientName?: string
  clientEmail?: string
  startDate?: Date
  endDate?: Date
  notes?: string
  status?: BookingStatus
}

export interface FindBookingsOptions {
  talentId?: string
  clientEmail?: string
  status?: BookingStatus
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}

export class BookingService {
  static async create(input: CreateBookingInput) {
    try {
      await dbConnect()
      const booking = new Booking({
        ...input,
        talentId: new Types.ObjectId(input.talentId),
      })
      await booking.save()
      logger.info('Booking created', { bookingId: booking.id })
      return booking.toJSON()
    } catch (error) {
      logger.error('Error creating booking', { error })
      throw error
    }
  }

  static async findById(id: string) {
    try {
      await dbConnect()
      const booking = await Booking.findById(id).lean()
      if (!booking) return null
      return {
        ...booking,
        id: booking._id.toString(),
        talentId: booking.talentId.toString(),
        _id: undefined,
      }
    } catch (error) {
      logger.error('Error finding booking', { error, bookingId: id })
      throw error
    }
  }

  static async findMany(options: FindBookingsOptions = {}) {
    try {
      await dbConnect()
      const {
        talentId,
        clientEmail,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = options

      const query: any = {}

      if (talentId) {
        query.talentId = new Types.ObjectId(talentId)
      }

      if (clientEmail) {
        query.clientEmail = clientEmail
      }

      if (status) {
        query.status = status
      }

      if (startDate || endDate) {
        query.startDate = {}
        if (startDate) query.startDate.$gte = startDate
        if (endDate) query.startDate.$lte = endDate
      }

      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .sort({ startDate: 1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Booking.countDocuments(query),
      ])

      return {
        data: bookings.map(booking => ({
          ...booking,
          id: booking._id.toString(),
          talentId: booking.talentId.toString(),
          _id: undefined,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    } catch (error) {
      logger.error('Error finding bookings', { error, options })
      throw error
    }
  }

  static async update(id: string, input: UpdateBookingInput) {
    try {
      await dbConnect()
      const booking = await Booking.findById(id)
      if (!booking) return null

      // Update fields
      if (input.clientName) booking.clientName = input.clientName
      if (input.clientEmail) booking.clientEmail = input.clientEmail
      if (input.startDate) booking.startDate = input.startDate
      if (input.endDate) booking.endDate = input.endDate
      if (input.notes) booking.notes = input.notes
      if (input.status) booking.status = input.status

      await booking.save()
      logger.info('Booking updated', { bookingId: id })
      return booking.toJSON()
    } catch (error) {
      logger.error('Error updating booking', { error, bookingId: id })
      throw error
    }
  }

  static async delete(id: string) {
    try {
      await dbConnect()
      const booking = await Booking.findByIdAndDelete(id)
      if (!booking) return false
      logger.info('Booking deleted', { bookingId: id })
      return true
    } catch (error) {
      logger.error('Error deleting booking', { error, bookingId: id })
      throw error
    }
  }

  static async exists(id: string) {
    try {
      await dbConnect()
      return await Booking.exists({ _id: new Types.ObjectId(id) })
    } catch (error) {
      logger.error('Error checking booking existence', { error, bookingId: id })
      throw error
    }
  }

  static async findByTalent(talentId: string) {
    try {
      await dbConnect()
      const bookings = await Booking.findByTalent(new Types.ObjectId(talentId))
      return bookings.map(booking => booking.toJSON())
    } catch (error) {
      logger.error('Error finding bookings by talent', { error, talentId })
      throw error
    }
  }

  static async findByEmail(clientEmail: string) {
    try {
      await dbConnect()
      const bookings = await Booking.findByEmail(clientEmail)
      return bookings.map(booking => booking.toJSON())
    } catch (error) {
      logger.error('Error finding bookings by email', { error, clientEmail })
      throw error
    }
  }

  static async findUpcoming(talentId: string) {
    try {
      await dbConnect()
      const bookings = await Booking.findUpcoming(new Types.ObjectId(talentId))
      return bookings.map(booking => booking.toJSON())
    } catch (error) {
      logger.error('Error finding upcoming bookings', { error, talentId })
      throw error
    }
  }

  static async updateStatus(id: string, status: BookingStatus) {
    try {
      await dbConnect()
      const booking = await Booking.findById(id)
      if (!booking) return null

      if (status === 'CANCELLED') {
        await booking.cancel()
      } else if (status === 'CONFIRMED') {
        await booking.confirm()
      } else {
        booking.status = status
        await booking.save()
      }

      logger.info('Booking status updated', { bookingId: id, status })
      return booking.toJSON()
    } catch (error) {
      logger.error('Error updating booking status', { error, bookingId: id })
      throw error
    }
  }

  static async checkAvailability(talentId: string, startDate: Date, endDate: Date) {
    try {
      await dbConnect()
      const conflictingBooking = await Booking.findOne({
        talentId: new Types.ObjectId(talentId),
        status: { $ne: 'CANCELLED' },
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
      })

      return !conflictingBooking
    } catch (error) {
      logger.error('Error checking availability', { error, talentId })
      throw error
    }
  }
} 