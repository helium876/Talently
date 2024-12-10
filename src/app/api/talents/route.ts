import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { TalentModel } from '@/lib/db/models/talent'
import type { Talent } from '@/lib/db/models/talent'

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
    const talents = await TalentModel.find().lean() as (Talent & { _id: any })[]

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
          id: talent._id.toString(),
          name: talent.name || '',
          email: talent.email || '',
          title: talent.title || '',
          basicInfo: talent.basicInfo || '',
          status: talent.status || 'pending',
          skills: talent.skills || [],
          experience: talent.experience || '',
          education: talent.education || '',
          availability: talent.availability || '',
          rate: talent.rate || 0,
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
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
}

export async function POST(request: Request) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const body = await request.json()
    console.log('Received talent creation request:', body)

    const { 
      userId,
      name,
      email,
      phone,
      title,
      basicInfo,
      skills,
      experience,
      education,
      availability,
      rate,
      status = 'pending'
    } = body

    // Log missing fields
    const missingFields = ['userId', 'name', 'email', 'title', 'basicInfo', 'skills', 
      'experience', 'education', 'availability', 'rate'].filter(field => !body[field])
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields)
    }

    // Basic validation
    if (!userId || !name || !email || !title || !basicInfo || !skills || 
        !experience || !education || !availability || !rate) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['userId', 'name', 'email', 'title', 'basicInfo', 'skills', 
                    'experience', 'education', 'availability', 'rate'],
          received: body,
          missing: missingFields
        }),
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
    console.log('Creating talent with data:', {
      userId,
      name,
      email,
      title,
      basicInfo,
      skills,
      experience,
      education,
      availability,
      rate,
      status
    })

    const talent = await TalentModel.create({
      userId,
      name,
      email,
      phone,
      title,
      basicInfo,
      skills,
      experience,
      education,
      availability,
      rate: Number(rate), // Ensure rate is a number
      status
    })

    console.log('Talent created successfully:', talent)

    return new NextResponse(
      JSON.stringify({
        success: true,
        talent: {
          id: talent._id.toString(),
          name: talent.name,
          email: talent.email,
          title: talent.title,
          basicInfo: talent.basicInfo,
          status: talent.status
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
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'An error occurred during talent creation',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
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