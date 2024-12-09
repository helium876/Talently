import mongoose, { Schema } from 'mongoose'
import { TalentStatus } from '@/lib/types/data'
import { ITalent } from '@/lib/types/models'

const TalentSchema = new Schema<ITalent>({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  basicInfo: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(TalentStatus),
    default: TalentStatus.ACTIVE 
  },
  imagePath: { type: String, default: null }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
    }
  }
})

export const Talent = mongoose.models.Talent || mongoose.model<ITalent>('Talent', TalentSchema) 