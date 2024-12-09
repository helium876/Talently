import { Types } from 'mongoose'
import { Business } from '../db/models'
import { logger } from '../monitoring/logger'

export interface CreateBusinessInput {
  name: string
  email: string
  password: string
  logoPath?: string
  emailPreferences?: {
    marketingEmails?: boolean
    bookingNotifications?: boolean
    weeklyDigest?: boolean
  }
}

export interface UpdateBusinessInput {
  name?: string
  email?: string
  password?: string
  logoPath?: string
  emailPreferences?: {
    marketingEmails?: boolean
    bookingNotifications?: boolean
    weeklyDigest?: boolean
  }
}

export interface SerializedBusiness {
  id: string
  name: string
  email: string
  logoPath?: string
  emailPreferences: {
    marketingEmails: boolean
    bookingNotifications: boolean
    weeklyDigest: boolean
  }
  createdAt: Date
  updatedAt: Date
}

class BusinessServiceImpl {
  async create(input: CreateBusinessInput): Promise<SerializedBusiness> {
    try {
      const business = new Business(input)
      await business.save()
      logger.info('Business created', { businessId: business.id })
      return this.serializeBusiness(business)
    } catch (error) {
      logger.error('Error creating business', { error })
      throw error
    }
  }

  async findById(id: string): Promise<SerializedBusiness | null> {
    try {
      const business = await Business.findById(id)
      if (!business) return null
      return this.serializeBusiness(business)
    } catch (error) {
      logger.error('Error finding business', { error, businessId: id })
      throw error
    }
  }

  async findByEmail(email: string): Promise<SerializedBusiness | null> {
    try {
      const business = await Business.findOne({ email })
      if (!business) return null
      return this.serializeBusiness(business)
    } catch (error) {
      logger.error('Error finding business by email', { error, email })
      throw error
    }
  }

  async update(id: string, input: UpdateBusinessInput): Promise<SerializedBusiness | null> {
    try {
      const business = await Business.findById(id)
      if (!business) return null

      // Update fields
      if (input.name) business.name = input.name
      if (input.email) business.email = input.email
      if (input.password) business.password = input.password
      if (input.logoPath) business.logoPath = input.logoPath
      if (input.emailPreferences) {
        business.emailPreferences = {
          ...business.emailPreferences,
          ...input.emailPreferences,
        }
      }

      await business.save()
      logger.info('Business updated', { businessId: id })
      return this.serializeBusiness(business)
    } catch (error) {
      logger.error('Error updating business', { error, businessId: id })
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const business = await Business.findByIdAndDelete(id)
      if (!business) return false
      logger.info('Business deleted', { businessId: id })
      return true
    } catch (error) {
      logger.error('Error deleting business', { error, businessId: id })
      throw error
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      return !!(await Business.exists({ _id: new Types.ObjectId(id) }))
    } catch (error) {
      logger.error('Error checking business existence', { error, businessId: id })
      throw error
    }
  }

  async validateCredentials(email: string, password: string): Promise<SerializedBusiness | null> {
    try {
      const business = await Business.findOne({ email })
      if (!business) return null

      const isValid = await business.comparePassword(password)
      if (!isValid) return null

      return this.serializeBusiness(business)
    } catch (error) {
      logger.error('Error validating credentials', { error, email })
      throw error
    }
  }

  private serializeBusiness(business: any): SerializedBusiness {
    return {
      id: business._id.toString(),
      name: business.name,
      email: business.email,
      logoPath: business.logoPath,
      emailPreferences: business.emailPreferences,
      createdAt: business.createdAt,
      updatedAt: business.updatedAt,
    }
  }
}

export const BusinessService = new BusinessServiceImpl() 