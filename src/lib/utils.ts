import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Types } from 'mongoose'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeSerialize<T>(doc: any): T {
  if (!doc) return null as T

  const obj = doc.toObject ? doc.toObject() : { ...doc }

  // Convert _id to id
  if (obj._id) {
    obj.id = obj._id.toString()
    delete obj._id
  }

  // Convert any other ObjectIds to strings
  Object.keys(obj).forEach(key => {
    if (obj[key] instanceof Types.ObjectId) {
      obj[key] = obj[key].toString()
    }
    // Handle arrays of ObjectIds
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map((item: any) => {
        if (item instanceof Types.ObjectId) {
          return item.toString()
        }
        if (item && item._id) {
          return safeSerialize(item)
        }
        return item
      })
    }
    // Handle nested objects
    if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
      obj[key] = safeSerialize(obj[key])
    }
  })

  // Remove Mongoose specific fields
  delete obj.__v
  delete obj.password

  return obj as T
} 