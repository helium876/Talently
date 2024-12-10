import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { TalentModel } from '@/lib/db/models/talent'
import type { Talent } from '@/lib/db/models/talent'
import { cookies } from 'next/headers'
import { Business } from '@/lib/db/models'

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
    const talents = (await TalentModel.find().lean()) as unknown as Array<Talent & { _id: any }>

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
          rate: talent.rate || 0,
          imagePath: talent.imagePath || null,
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

    // Get the current session to get businessId
    const sessionId = cookies().get('session')?.value
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Please log in' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    await dbConnect()
    const business = await Business.findById(sessionId)
    if (!business) {
      return new NextResponse(
        JSON.stringify({ error: 'Business not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    const { 
      name,
      email,
      phone,
      title,
      basicInfo,
      skills,
      experience,
      rate,
      status = 'pending',
      imagePath
    } = body

    // Log missing fields
    const missingFields = ['name', 'email', 'title', 'basicInfo', 'skills', 
      'experience', 'rate'].filter(field => !body[field])
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields)
      return new NextResponse(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['name', 'email', 'title', 'basicInfo', 'skills', 
                    'experience', 'rate'],
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

    console.log('Creating talent with data:', {
      businessId: business._id,
      name,
      email,
      title,
      basicInfo,
      skills,
      experience,
      rate,
      status
    })

    const talent = await TalentModel.create({
      businessId: business._id,
      name,
      email,
      phone,
      title,
      basicInfo,
      skills,
      experience,
      rate: Number(rate),
      status,
      imagePath
    })

    console.log('Talent created successfully:', talent)

    return new NextResponse(
      JSON.stringify({
        success: true,
        talent: {
          id: talent._id.toString(),
          businessId: talent.businessId.toString(),
          name: talent.name,
          email: talent.email,
          title: talent.title,
          basicInfo: talent.basicInfo,
          status: talent.status,
          imagePath: talent.imagePath
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