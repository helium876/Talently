import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/profile/route'
import * as sessionModule from '@/lib/session'

// Mock the session module
jest.mock('@/lib/session', () => ({
  getSession: jest.fn()
}))

describe('Profile API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns 401 when not authenticated', async () => {
    // Mock getSession to return null (not authenticated)
    jest.mocked(sessionModule.getSession).mockResolvedValueOnce(null)

    const request = new NextRequest('http://localhost/api/profile')
    const response = await GET(request)
    expect(response.status).toBe(401)
    
    const data = await response.json()
    expect(data).toEqual({
      error: 'Not authenticated'
    })
  })

  test('returns business profile when authenticated', async () => {
    const mockBusiness = {
      id: 'test-id',
      email: 'test@example.com',
      name: 'Test Business',
      password: 'hashed-password',
      logoPath: null,
      resetToken: null,
      resetTokenExpires: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Mock getSession to return the business
    jest.mocked(sessionModule.getSession).mockResolvedValueOnce(mockBusiness)

    const request = new NextRequest('http://localhost/api/profile')
    const response = await GET(request)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toEqual(mockBusiness)
  })

  test('handles session errors gracefully', async () => {
    // Mock getSession to throw an error
    jest.mocked(sessionModule.getSession).mockRejectedValueOnce(
      new Error('Session error')
    )

    const request = new NextRequest('http://localhost/api/profile')
    const response = await GET(request)
    expect(response.status).toBe(500)
    
    const data = await response.json()
    expect(data).toEqual({
      error: 'Failed to fetch profile'
    })
  })
}) 