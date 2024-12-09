import { Types } from 'mongoose'

export interface IBusiness {
  _id: Types.ObjectId
  email: string
  name: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  email: string
  expiresAt: number
}

export interface Talent {
  id: string
  status: 'ACTIVE' | 'FEATURED' | 'INACTIVE'
  // Add other talent fields as needed
}

export interface Booking {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  // Add other booking fields as needed
} 