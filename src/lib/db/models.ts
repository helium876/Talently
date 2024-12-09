import mongoose, { Schema } from 'mongoose'
import { IUser, IBusiness } from '../types/models'
import { TalentStatus, BookingStatus } from '../types/data'

// User Schema
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

// Business Schema
const BusinessSchema = new Schema<IBusiness>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  talents: [{
    name: { type: String, required: true },
    basicInfo: { type: String, required: true },
    status: { 
      type: String, 
      enum: [TalentStatus.ACTIVE, TalentStatus.INACTIVE, TalentStatus.FEATURED], 
      default: TalentStatus.ACTIVE 
    },
    imagePath: { type: String, default: null }
  }],
  bookings: [{
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    status: { 
      type: String, 
      enum: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED], 
      default: BookingStatus.PENDING 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    notes: { type: String, default: null }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      if (ret.talents) {
        ret.talents = ret.talents.map((talent: any) => ({
          ...talent,
          id: talent._id.toString(),
          _id: undefined,
        }))
      }
      if (ret.bookings) {
        ret.bookings = ret.bookings.map((booking: any) => ({
          ...booking,
          id: booking._id.toString(),
          _id: undefined,
          startDate: booking.startDate.toISOString(),
          endDate: booking.endDate.toISOString(),
        }))
      }
    }
  }
})

// Initialize models
function getModels() {
  const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema)
  const Business = (mongoose.models.Business as mongoose.Model<IBusiness>) || 
    mongoose.model<IBusiness>('Business', BusinessSchema)

  return { User, Business }
}

// Export models
export const { User, Business } = getModels() 