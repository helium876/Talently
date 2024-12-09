import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Document } from 'mongoose'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function safeSerialize<T>(doc: Document | any): T {
  if (!doc) return doc

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(item => safeSerialize(item)) as T
  }

  // Handle dates
  if (doc instanceof Date) {
    return doc.toISOString() as any
  }

  // Get plain object
  const obj = doc.toObject ? doc.toObject() : doc

  // Remove Mongoose/internal fields
  const clean = { ...obj }
  if (clean._id) {
    clean.id = clean._id.toString()
    delete clean._id
  }
  delete clean.__v
  delete clean.$$id

  // Handle nested objects
  for (const [key, value] of Object.entries(clean)) {
    if (value && typeof value === 'object') {
      clean[key] = safeSerialize(value)
    }
  }

  return clean as T
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
} 