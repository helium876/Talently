import mongoose, { Schema, model, models } from 'mongoose'

export interface User {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.password
        return ret
      },
    },
  }
)

// Ensure email is unique
userSchema.index({ email: 1 }, { unique: true })

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)
export default UserModel