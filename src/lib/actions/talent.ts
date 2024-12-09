'use server'

import { revalidatePath } from 'next/cache'
import { TalentService, TalentStatus } from '../data'
import { logger } from '../monitoring/logger'
import { getSession } from './auth'

export async function createTalent(data: {
  name: string
  basicInfo: string
  status?: TalentStatus
  imagePath?: string
}) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    const talent = await TalentService.create({
      ...data,
      businessId: session.id,
    })

    logger.info('Talent created', { talentId: talent.id })
    revalidatePath('/talents')
    return { success: true, data: talent }
  } catch (error) {
    logger.error('Error creating talent', { error })
    return { error: 'An error occurred while creating talent' }
  }
}

export async function updateTalent(
  id: string,
  data: {
    name?: string
    basicInfo?: string
    status?: TalentStatus
    imagePath?: string
  }
) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership
    const talent = await TalentService.findById(id)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Talent not found' }
    }

    const updatedTalent = await TalentService.update(id, data)
    if (!updatedTalent) {
      return { error: 'Talent not found' }
    }

    logger.info('Talent updated', { talentId: id })
    revalidatePath('/talents')
    revalidatePath(`/talents/${id}`)
    return { success: true, data: updatedTalent }
  } catch (error) {
    logger.error('Error updating talent', { error, talentId: id })
    return { error: 'An error occurred while updating talent' }
  }
}

export async function deleteTalent(id: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership
    const talent = await TalentService.findById(id)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Talent not found' }
    }

    const success = await TalentService.delete(id)
    if (!success) {
      return { error: 'Talent not found' }
    }

    logger.info('Talent deleted', { talentId: id })
    revalidatePath('/talents')
    return { success: true }
  } catch (error) {
    logger.error('Error deleting talent', { error, talentId: id })
    return { error: 'An error occurred while deleting talent' }
  }
}

export async function getTalents(options: {
  status?: TalentStatus
  search?: string
  page?: number
  limit?: number
}) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    const result = await TalentService.findMany({
      ...options,
      businessId: session.id,
    })

    return { success: true, ...result }
  } catch (error) {
    logger.error('Error getting talents', { error })
    return { error: 'An error occurred while getting talents' }
  }
}

export async function getTalent(id: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    const talent = await TalentService.findById(id)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Talent not found' }
    }

    return { success: true, data: talent }
  } catch (error) {
    logger.error('Error getting talent', { error, talentId: id })
    return { error: 'An error occurred while getting talent' }
  }
}

export async function updateTalentStatus(id: string, status: TalentStatus) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership
    const talent = await TalentService.findById(id)
    if (!talent || talent.businessId !== session.id) {
      return { error: 'Talent not found' }
    }

    const updatedTalent = await TalentService.updateStatus(id, status)
    if (!updatedTalent) {
      return { error: 'Talent not found' }
    }

    logger.info('Talent status updated', { talentId: id, status })
    revalidatePath('/talents')
    revalidatePath(`/talents/${id}`)
    return { success: true, data: updatedTalent }
  } catch (error) {
    logger.error('Error updating talent status', { error, talentId: id })
    return { error: 'An error occurred while updating talent status' }
  }
}

export async function getFeaturedTalents() {
  try {
    const talents = await TalentService.findFeatured()
    return { success: true, data: talents }
  } catch (error) {
    logger.error('Error getting featured talents', { error })
    return { error: 'An error occurred while getting featured talents' }
  }
} 