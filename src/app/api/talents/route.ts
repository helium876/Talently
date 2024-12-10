import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { TalentModel } from '@/lib/db/models/talent'
import type { Talent } from '@/lib/types'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Credentials': 'true'
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function GET(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    await dbConnect()
    const talents = await TalentModel.find({ status: 'ACTIVE' }).lean()

    if (!talents) {
      return new NextResponse(
        JSON.stringify({ talents: [] }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    return new NextResponse(
      JSON.stringify({ 
        talents: talents.map(talent => ({
          id: talent.id.toString(),
          name: talent.name || '',
          basicInfo: talent.basicInfo || '',
          status: talent.status || 'INACTIVE',
          imagePath: talent.imagePath || '',
        }))
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error('Error fetching talents:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch talents', talents: [] }),
      { 
        status: 200, // Return 200 with empty array instead of 500
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
}

export async function POST(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { name, basicInfo, status } = await request.json()

    // Basic validation
    if (!name || !basicInfo || !status) {
      return new NextResponse(
        JSON.stringify({ error: 'Name, basic info, and status are required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    await dbConnect()
    const talent = await TalentModel.create({
      name,
      basicInfo,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return new NextResponse(
      JSON.stringify({
        success: true,
        talent: {
          id: talent._id.toString(),
          name: talent.name,
          basicInfo: talent.basicInfo,
          status: talent.status,
        }
      }),
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error('Talent creation error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'An error occurred during talent creation' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
} 