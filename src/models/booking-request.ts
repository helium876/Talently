import mongoose, { Schema } from 'mongoose'
import { BookingStatus } from '@/lib/types/data'
import { IBooking } from '@/lib/types/models'

const BookingRequestSchema = new Schema<IBooking>({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  talentId: { type: Schema.Types.ObjectId, ref: 'Talent', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  notes: { type: String, default: null }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      ret.startDate = ret.startDate.toISOString()
      ret.endDate = ret.endDate.toISOString()
    }
  }
})

export const BookingRequest = mongoose.models.BookingRequest || mongoose.model<IBooking>('BookingRequest', BookingRequestSchema) 