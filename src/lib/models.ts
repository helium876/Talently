import mongoose from 'mongoose'

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  talents: [{
    name: { type: String, required: true },
    basicInfo: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'FEATURED'], default: 'ACTIVE' },
    imagePath: { type: String, default: null }
  }]
}, {
  timestamps: true
})

// Prevent mongoose from creating a model multiple times during hot reload
export const Business = mongoose.models.Business || mongoose.model('Business', businessSchema) 