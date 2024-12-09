'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Business } from './db/models'
import { connectToDatabase } from './db'
import { hashPassword, verifyPassword } from './auth'
import { TalentStatus } from './types/data'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  try {
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()

    if (!email || !password) {
      return { error: 'All fields are required' }
    }

    await connectToDatabase()
    const business = await Business.findOne({ email })

    if (!business) {
      return { error: 'Invalid credentials' }
    }

    const isValid = await verifyPassword(password, business.password)
    if (!isValid) {
      return { error: 'Invalid credentials' }
    }

    // Set session cookie
    cookies().set('session', business._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function handleSignup(formData: FormData) {
  try {
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()
    const businessName = formData.get('businessName')?.toString()

    if (!email || !password || !businessName) {
      return { error: 'All fields are required' }
    }

    await connectToDatabase()
    
    // Check if business already exists
    const existingBusiness = await Business.findOne({ email })
    if (existingBusiness) {
      return { error: 'Email already exists' }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new business
    const business = await Business.create({
      email,
      password: hashedPassword,
      name: businessName,
    })

    // Set session cookie
    cookies().set('session', business._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    redirect('/dashboard')
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function handleLogout() {
  cookies().delete('session')
  redirect('/auth/login')
}

export async function updateTalentStatus(talentId: string, status: TalentStatus) {
  try {
    await connectToDatabase()
    await Business.updateOne(
      { 'talents._id': talentId },
      { $set: { 'talents.$.status': status } }
    )
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Update talent status error:', error)
    return { error: 'Failed to update talent status' }
  }
}

export async function bulkUpdateTalentStatus(talentIds: string[], status: TalentStatus) {
  try {
    await connectToDatabase()
    await Business.updateMany(
      { 'talents._id': { $in: talentIds } },
      { $set: { 'talents.$[elem].status': status } },
      { arrayFilters: [{ 'elem._id': { $in: talentIds } }] }
    )
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Bulk update talent status error:', error)
    return { error: 'Failed to update talent status' }
  }
}

export async function updateBusinessLogo(formData: FormData) {
  try {
    const file = formData.get('logo') as File
    const businessId = formData.get('businessId')?.toString()

    if (!file || !businessId) {
      return { error: 'Missing required fields' }
    }

    await connectToDatabase()
    
    // TODO: Implement file upload to cloud storage
    const logoPath = '/placeholder-logo.png' // This should be replaced with actual uploaded file path
    
    await Business.findByIdAndUpdate(businessId, {
      logoPath
    })

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    console.error('Update business logo error:', error)
    return { error: 'Failed to update business logo' }
  }
}

export async function updateBusinessDetails(formData: FormData) {
  try {
    const businessId = formData.get('businessId')?.toString()
    const name = formData.get('name')?.toString()

    if (!businessId || !name) {
      return { error: 'Missing required fields' }
    }

    await connectToDatabase()
    
    await Business.findByIdAndUpdate(businessId, {
      name
    })

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    console.error('Update business details error:', error)
    return { error: 'Failed to update business details' }
  }
}

export async function changePassword(formData: FormData) {
  try {
    const businessId = formData.get('businessId')?.toString()
    const currentPassword = formData.get('currentPassword')?.toString()
    const newPassword = formData.get('newPassword')?.toString()

    if (!businessId || !currentPassword || !newPassword) {
      return { error: 'Missing required fields' }
    }

    await connectToDatabase()
    
    const business = await Business.findById(businessId)
    if (!business) {
      return { error: 'Business not found' }
    }

    const isValid = await verifyPassword(currentPassword, business.password)
    if (!isValid) {
      return { error: 'Current password is incorrect' }
    }

    const hashedPassword = await hashPassword(newPassword)
    await Business.findByIdAndUpdate(businessId, {
      password: hashedPassword
    })

    return { success: true }
  } catch (error) {
    console.error('Change password error:', error)
    return { error: 'Failed to change password' }
  }
}

export async function updateEmailPreferences(formData: FormData) {
  try {
    const businessId = formData.get('businessId')?.toString()
    const marketingEmails = formData.get('marketingEmails') === 'true'
    const bookingNotifications = formData.get('bookingNotifications') === 'true'
    const weeklyDigest = formData.get('weeklyDigest') === 'true'

    if (!businessId) {
      return { error: 'Missing business ID' }
    }

    await connectToDatabase()
    
    await Business.findByIdAndUpdate(businessId, {
      emailPreferences: {
        marketingEmails,
        bookingNotifications,
        weeklyDigest
      }
    })

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    console.error('Update email preferences error:', error)
    return { error: 'Failed to update email preferences' }
  }
}

interface TalentInput {
  name: string
  email: string
  basicInfo: string
  experience: string | number
  hourlyRate: string | number
  skills: string | string[]
  status?: TalentStatus
}

export async function createTalent(businessId: string, input: TalentInput | FormData) {
  try {
    let data: TalentInput;
    
    if (input instanceof FormData) {
      data = {
        name: input.get('name')?.toString() || '',
        email: input.get('email')?.toString() || '',
        basicInfo: input.get('basicInfo')?.toString() || '',
        experience: Number(input.get('experience')) || 0,
        hourlyRate: Number(input.get('hourlyRate')) || 0,
        skills: input.get('skills')?.toString().split(',').map(s => s.trim()) || [],
        status: (input.get('status') as TalentStatus) || TalentStatus.ACTIVE
      }
    } else {
      data = {
        ...input,
        experience: Number(input.experience) || 0,
        hourlyRate: Number(input.hourlyRate) || 0,
        skills: typeof input.skills === 'string' ? input.skills.split(',').map(s => s.trim()) : input.skills,
        status: input.status || TalentStatus.ACTIVE
      }
    }

    if (!businessId || !data.name || !data.email || !data.basicInfo) {
      return { error: 'Missing required fields' }
    }

    await connectToDatabase()
    
    await Business.findByIdAndUpdate(businessId, {
      $push: {
        talents: {
          name: data.name,
          email: data.email,
          basicInfo: data.basicInfo,
          status: data.status,
          imagePath: null,
          experience: data.experience,
          hourlyRate: data.hourlyRate,
          skills: data.skills
        }
      }
    })

    revalidatePath('/dashboard/talents')
    return { success: true }
  } catch (error) {
    console.error('Create talent error:', error)
    return { error: 'Failed to create talent' }
  }
}

export async function updateTalent(talentId: string, input: TalentInput | FormData) {
  try {
    let data: TalentInput;
    
    if (input instanceof FormData) {
      data = {
        name: input.get('name')?.toString() || '',
        email: input.get('email')?.toString() || '',
        basicInfo: input.get('basicInfo')?.toString() || '',
        experience: Number(input.get('experience')) || 0,
        hourlyRate: Number(input.get('hourlyRate')) || 0,
        skills: input.get('skills')?.toString().split(',').map(s => s.trim()) || [],
        status: (input.get('status') as TalentStatus) || TalentStatus.ACTIVE
      }
    } else {
      data = {
        ...input,
        experience: Number(input.experience) || 0,
        hourlyRate: Number(input.hourlyRate) || 0,
        skills: typeof input.skills === 'string' ? input.skills.split(',').map(s => s.trim()) : input.skills,
        status: input.status || TalentStatus.ACTIVE
      }
    }

    if (!talentId || !data.name || !data.email || !data.basicInfo) {
      return { error: 'Missing required fields' }
    }

    await connectToDatabase()
    
    await Business.updateOne(
      { 'talents._id': talentId },
      {
        $set: {
          'talents.$.name': data.name,
          'talents.$.email': data.email,
          'talents.$.basicInfo': data.basicInfo,
          'talents.$.status': data.status,
          'talents.$.experience': data.experience,
          'talents.$.hourlyRate': data.hourlyRate,
          'talents.$.skills': data.skills
        }
      }
    )

    revalidatePath('/dashboard/talents')
    return { success: true }
  } catch (error) {
    console.error('Update talent error:', error)
    return { error: 'Failed to update talent' }
  }
}