import mongoose, { Schema } from 'mongoose'

export type TalentStatus = 'pending' | 'active' | 'inactive'

export interface Talent {
  userId: string
  businessId: mongoose.Types.ObjectId
  name: string
  email: string
  phone?: string
  title: string
  basicInfo: string
  skills: string[]
  experience: string
  rate: number
  status: TalentStatus
  imagePath?: string
  createdAt: Date
  updatedAt: Date
}

const talentSchema = new Schema<Talent>(
  {
    userId: { type: String, required: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    title: { type: String, required: true },
    basicInfo: { type: String, required: true },
    skills: { type: [String], required: true },
    experience: { type: String, required: true },
    rate: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'active', 'inactive'],
      default: 'pending'
    },
    imagePath: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

// Delete existing model if it exists
if (mongoose.models.Talent) {
  delete mongoose.models.Talent
}

// Create new model
const TalentModel = mongoose.model('Talent', talentSchema)
export { TalentModel } 