import mongoose, { Schema } from 'mongoose'

export type TalentStatus = 'pending' | 'active' | 'inactive'

export interface Talent {
  userId: string
  name: string
  email: string
  phone?: string
  title: string
  basicInfo: string
  skills: string[]
  experience: string
  education: string
  availability: string
  rate: number
  status: TalentStatus
  createdAt: Date
  updatedAt: Date
}

const talentSchema = new Schema<Talent>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    title: { type: String, required: true },
    basicInfo: { type: String, required: true },
    skills: { type: [String], required: true },
    experience: { type: String, required: true },
    education: { type: String, required: true },
    availability: { type: String, required: true },
    rate: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'active', 'inactive'],
      default: 'pending'
    },
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

const TalentModel = mongoose.models.Talent || mongoose.model('Talent', talentSchema)
export { TalentModel } 