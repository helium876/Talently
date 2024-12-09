import { Schema, model, models, Model, Document, Types } from 'mongoose'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Booking extends Document {
  talentId: Types.ObjectId
  clientName: string
  clientEmail: string
  status: BookingStatus
  startDate: Date
  endDate: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const bookingSchema = new Schema<Booking>({
  talentId: {
    type: Schema.Types.ObjectId,
    ref: 'Talent',
    required: [true, 'Talent ID is required'],
    index: true,
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: 'Please enter a valid email address',
    },
  },
  status: {
    type: String,
    enum: {
      values: ['PENDING', 'CONFIRMED', 'CANCELLED'] as BookingStatus[],
      message: '{VALUE} is not a valid status',
    },
    default: 'PENDING',
    index: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(this: Booking, v: Date) {
        return v >= new Date()
      },
      message: 'Start date must be in the future',
    },
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(this: Booking, v: Date) {
        return v > this.startDate
      },
      message: 'End date must be after start date',
    },
  },
  notes: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v
      ret.id = ret._id.toString()
      delete ret._id
      ret.talentId = ret.talentId.toString()
      return ret
    },
  },
})

// Create compound indexes
bookingSchema.index({ talentId: 1, status: 1 })
bookingSchema.index({ startDate: 1, endDate: 1 })
bookingSchema.index({ clientEmail: 1 })

// Middleware to ensure talentId exists and check for booking conflicts
bookingSchema.pre('save', async function(next) {
  try {
    // Check if talent exists
    const Talent = models.Talent
    const talentExists = await Talent.exists({ _id: this.talentId })
    if (!talentExists) {
      throw new Error('Talent does not exist')
    }

    // Check for booking conflicts
    if (this.isModified('startDate') || this.isModified('endDate')) {
      const BookingModel = this.constructor as BookingModel
      const conflictingBooking = await BookingModel.findOne({
        talentId: this.talentId,
        status: { $ne: 'CANCELLED' },
        _id: { $ne: this._id },
        $or: [
          {
            startDate: { $lt: this.endDate },
            endDate: { $gt: this.startDate },
          },
        ],
      })

      if (conflictingBooking) {
        throw new Error('This time slot is already booked')
      }
    }

    next()
  } catch (error: any) {
    next(error)
  }
})

// Static methods
bookingSchema.statics.findByTalent = function(talentId: Types.ObjectId) {
  return this.find({ talentId }).sort({ startDate: 1 })
}

bookingSchema.statics.findByEmail = function(clientEmail: string) {
  return this.find({ clientEmail }).sort({ startDate: 1 })
}

bookingSchema.statics.findUpcoming = function(talentId: Types.ObjectId) {
  return this.find({
    talentId,
    status: { $ne: 'CANCELLED' },
    startDate: { $gt: new Date() },
  }).sort({ startDate: 1 })
}

// Instance methods
bookingSchema.methods.cancel = async function() {
  this.status = 'CANCELLED'
  await this.save()
}

bookingSchema.methods.confirm = async function() {
  this.status = 'CONFIRMED'
  await this.save()
}

// Export interface for static methods
export interface BookingModel extends Model<Booking> {
  findByTalent(talentId: Types.ObjectId): Promise<Booking[]>
  findByEmail(clientEmail: string): Promise<Booking[]>
  findUpcoming(talentId: Types.ObjectId): Promise<Booking[]>
}

// Export model
export const BookingModel = (models.Booking || model<Booking, BookingModel>('Booking', bookingSchema)) as BookingModel 