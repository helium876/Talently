import mongoose from 'mongoose'
import { BookingStatus, TalentStatus } from '../types/data'

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: false,
    transform: (_doc: any, ret: any) => {
      const id = ret._id.toString()
      delete ret._id
      delete ret.__v
      delete ret.$$id
      return { id, ...ret }
    }
  }
}

const talentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basicInfo: { type: String, required: true },
  status: { type: String, enum: Object.values(TalentStatus), required: true },
  imagePath: { type: String, default: null }
}, schemaOptions)

const bookingSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  status: { type: String, enum: Object.values(BookingStatus), required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  hourlyRate: { type: Number, required: true },
  totalHours: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  notes: { type: String, default: null }
}, schemaOptions)

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  logoPath: { type: String, default: null },
  emailPreferences: {
    marketingEmails: { type: Boolean, default: false },
    bookingNotifications: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false }
  },
  talents: [talentSchema],
  bookings: [bookingSchema]
}, {
  ...schemaOptions,
  toJSON: {
    virtuals: false,
    transform: (_doc: any, ret: any) => {
      const id = ret._id.toString()
      delete ret._id
      delete ret.__v
      delete ret.$$id

      if (ret.talents) {
        ret.talents = ret.talents.map((t: any) => ({
          id: t._id.toString(),
          name: t.name,
          basicInfo: t.basicInfo,
          status: t.status,
          imagePath: t.imagePath,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt
        }))
      }

      if (ret.bookings) {
        ret.bookings = ret.bookings.map((b: any) => ({
          id: b._id.toString(),
          clientName: b.clientName,
          clientEmail: b.clientEmail,
          status: b.status,
          startDate: b.startDate,
          endDate: b.endDate,
          hourlyRate: b.hourlyRate,
          totalHours: b.totalHours,
          totalAmount: b.totalAmount,
          notes: b.notes,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt
        }))
      }

      return { id, ...ret }
    }
  }
})

export const Business = mongoose.models.Business || mongoose.model('Business', businessSchema)
export const Talent = mongoose.models.Talent || mongoose.model('Talent', talentSchema)
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema) 