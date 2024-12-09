import { Types } from 'mongoose'
import { Talent, TalentStatus, dbConnect } from '../db/models'
import { logger } from '../monitoring/logger'

export interface CreateTalentInput {
  businessId: string
  name: string
  basicInfo: string
  status?: TalentStatus
  imagePath?: string
}

export interface UpdateTalentInput {
  name?: string
  basicInfo?: string
  status?: TalentStatus
  imagePath?: string
}

export interface FindTalentsOptions {
  businessId?: string
  status?: TalentStatus
  search?: string
  page?: number
  limit?: number
}

export class TalentService {
  static async create(input: CreateTalentInput) {
    try {
      await dbConnect()
      const talent = new Talent({
        ...input,
        businessId: new Types.ObjectId(input.businessId),
      })
      await talent.save()
      logger.info('Talent created', { talentId: talent.id })
      return talent.toJSON()
    } catch (error) {
      logger.error('Error creating talent', { error })
      throw error
    }
  }

  static async findById(id: string) {
    try {
      await dbConnect()
      const talent = await Talent.findById(id).lean()
      if (!talent) return null
      return {
        ...talent,
        id: talent._id.toString(),
        businessId: talent.businessId.toString(),
        _id: undefined,
      }
    } catch (error) {
      logger.error('Error finding talent', { error, talentId: id })
      throw error
    }
  }

  static async findMany(options: FindTalentsOptions = {}) {
    try {
      await dbConnect()
      const {
        businessId,
        status,
        search,
        page = 1,
        limit = 10,
      } = options

      const query: any = {}

      if (businessId) {
        query.businessId = new Types.ObjectId(businessId)
      }

      if (status) {
        query.status = status
      }

      if (search) {
        query.$text = { $search: search }
      }

      const [talents, total] = await Promise.all([
        Talent.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Talent.countDocuments(query),
      ])

      return {
        data: talents.map(talent => ({
          ...talent,
          id: talent._id.toString(),
          businessId: talent.businessId.toString(),
          _id: undefined,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    } catch (error) {
      logger.error('Error finding talents', { error, options })
      throw error
    }
  }

  static async update(id: string, input: UpdateTalentInput) {
    try {
      await dbConnect()
      const talent = await Talent.findById(id)
      if (!talent) return null

      // Update fields
      if (input.name) talent.name = input.name
      if (input.basicInfo) talent.basicInfo = input.basicInfo
      if (input.status) talent.status = input.status
      if (input.imagePath) talent.imagePath = input.imagePath

      await talent.save()
      logger.info('Talent updated', { talentId: id })
      return talent.toJSON()
    } catch (error) {
      logger.error('Error updating talent', { error, talentId: id })
      throw error
    }
  }

  static async delete(id: string) {
    try {
      await dbConnect()
      const talent = await Talent.findByIdAndDelete(id)
      if (!talent) return false
      logger.info('Talent deleted', { talentId: id })
      return true
    } catch (error) {
      logger.error('Error deleting talent', { error, talentId: id })
      throw error
    }
  }

  static async exists(id: string) {
    try {
      await dbConnect()
      return await Talent.exists({ _id: new Types.ObjectId(id) })
    } catch (error) {
      logger.error('Error checking talent existence', { error, talentId: id })
      throw error
    }
  }

  static async findByBusiness(businessId: string) {
    try {
      await dbConnect()
      const talents = await Talent.findByBusiness(new Types.ObjectId(businessId))
      return talents.map(talent => talent.toJSON())
    } catch (error) {
      logger.error('Error finding talents by business', { error, businessId })
      throw error
    }
  }

  static async findFeatured() {
    try {
      await dbConnect()
      const talents = await Talent.findFeatured()
      return talents.map(talent => talent.toJSON())
    } catch (error) {
      logger.error('Error finding featured talents', { error })
      throw error
    }
  }

  static async updateStatus(id: string, status: TalentStatus) {
    try {
      await dbConnect()
      const talent = await Talent.findById(id)
      if (!talent) return null

      talent.status = status
      await talent.save()
      logger.info('Talent status updated', { talentId: id, status })
      return talent.toJSON()
    } catch (error) {
      logger.error('Error updating talent status', { error, talentId: id })
      throw error
    }
  }
} 