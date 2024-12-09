'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { dbConnect } from '@/lib/db'
import { businessSchema, talentSchema, bookingSchema } from '@/lib/form-validation'
import { Business, Talent, Booking } from '@/lib/db/models'
import type { BusinessFormData, TalentFormData, BookingFormData } from '@/lib/form-validation'

// Business actions
export async function createBusiness(data: BusinessFormData) {
  const validatedData = businessSchema.parse(data)
  await dbConnect()
  const business = await Business.create(validatedData)
  revalidatePath('/dashboard')
  return business
}

export async function updateBusiness(id: string, data: Partial<BusinessFormData>) {
  const validatedData = businessSchema.partial().parse(data)
  await dbConnect()
  const business = await Business.findByIdAndUpdate(id, validatedData, { new: true })
  revalidatePath('/dashboard')
  return business
}

// Talent actions
export async function createTalent(data: TalentFormData) {
  const validatedData = talentSchema.parse(data)
  await dbConnect()
  const talent = await Talent.create(validatedData)
  revalidatePath('/dashboard')
  return talent
}

export async function updateTalent(id: string, data: Partial<TalentFormData>) {
  const validatedData = talentSchema.partial().parse(data)
  await dbConnect()
  const talent = await Talent.findByIdAndUpdate(id, validatedData, { new: true })
  revalidatePath('/dashboard')
  return talent
}

export async function deleteTalent(id: string) {
  await dbConnect()
  await Talent.findByIdAndDelete(id)
  revalidatePath('/dashboard')
}

// Booking actions
export async function createBooking(data: BookingFormData) {
  const validatedData = bookingSchema.parse(data)
  await dbConnect()
  const booking = await Booking.create(validatedData)
  revalidatePath('/dashboard')
  return booking
}

export async function updateBooking(id: string, data: Partial<BookingFormData>) {
  const validatedData = bookingSchema.partial().parse(data)
  await dbConnect()
  const booking = await Booking.findByIdAndUpdate(id, validatedData, { new: true })
  revalidatePath('/dashboard')
  return booking
}

export async function deleteBooking(id: string) {
  await dbConnect()
  await Booking.findByIdAndDelete(id)
  revalidatePath('/dashboard')
} 
} 