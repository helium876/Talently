import { Schema, model, models, Model, Document, Types } from 'mongoose'
import config from '../../config'

export type TalentStatus = 'ACTIVE' | 'FEATURED' | 'INACTIVE'

export interface Talent extends Document {
  businessId: Types.ObjectId
  name: string
  basicInfo: string
  status: TalentStatus
  imagePath?: string
  createdAt: Date
  updatedAt: Date
}

const talentSchema = new Schema<Talent>({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: [true, 'Business ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [config.validation.name.minLength, `Name must be at least ${config.validation.name.minLength} characters`],
    maxlength: [config.validation.name.maxLength, `Name cannot exceed ${config.validation.name.maxLength} characters`],
    trim: true,
  },
  basicInfo: {
    type: String,
    required: [true, 'Basic info is required'],
    minlength: [config.validation.basicInfo.minLength, `Basic info must be at least ${config.validation.basicInfo.minLength} characters`],
    maxlength: [config.validation.basicInfo.maxLength, `Basic info cannot exceed ${config.validation.basicInfo.maxLength} characters`],
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ['ACTIVE', 'FEATURED', 'INACTIVE'] as TalentStatus[],
      message: '{VALUE} is not a valid status',
    },
    default: 'ACTIVE',
    index: true,
  },
  imagePath: {
    type: String,
    required: false,
    validate: {
      validator: function(v: string | undefined) {
        if (!v) return true // Optional field
        return config.images.allowedTypes.some(type => 
          v.toLowerCase().endsWith(type.split('/')[1])
        )
      },
      message: 'Invalid image format',
    },
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v
      ret.id = ret._id.toString()
      delete ret._id
      ret.businessId = ret.businessId.toString()
      return ret
    },
  },
})

// Create compound indexes
talentSchema.index({ businessId: 1, status: 1 })
talentSchema.index({ name: 'text', basicInfo: 'text' })

// Middleware to ensure businessId exists
talentSchema.pre('save', async function(next) {
  try {
    const Business = models.Business
    const businessExists = await Business.exists({ _id: this.businessId })
    if (!businessExists) {
      throw new Error('Business does not exist')
    }
    next()
  } catch (error: any) {
    next(error)
  }
})

// Static methods
talentSchema.statics.findByBusiness = function(businessId: Types.ObjectId) {
  return this.find({ businessId }).sort({ createdAt: -1 })
}

talentSchema.statics.findFeatured = function() {
  return this.find({ status: 'FEATURED' }).sort({ createdAt: -1 })
}

// Export interface for static methods
export interface TalentModel extends Model<Talent> {
  findByBusiness(businessId: Types.ObjectId): Promise<Talent[]>
  findFeatured(): Promise<Talent[]>
}

// Export model
export const TalentModel = (models.Talent || model<Talent, TalentModel>('Talent', talentSchema)) as TalentModel 