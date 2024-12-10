import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { TalentModel } from '@/lib/db/models/talent'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    await dbConnect()
    
    // Check if ID is valid
    if (!params.id || params.id === 'undefined') {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid talent ID' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    const talent = await TalentModel.findById(params.id).lean()

    if (!talent) {
      return new NextResponse(
        JSON.stringify({ error: 'Talent not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    // Safely convert MongoDB document to a plain object with null checks
    const talentData = {
      id: talent._id?.toString() || '',
      businessId: talent.businessId?.toString() || '',
      name: talent.name || '',
      email: talent.email || '',
      phone: talent.phone || '',
      title: talent.title || '',
      basicInfo: talent.basicInfo || '',
      skills: talent.skills || [],
      experience: talent.experience || '',
      rate: talent.rate || 0,
      status: talent.status || 'pending',
      imagePath: talent.imagePath || null,
    }

    return new NextResponse(
      JSON.stringify({ talent: talentData }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Error fetching talent:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch talent' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const body = await request.json()
    await dbConnect()

    // First find the existing talent to get its businessId
    const existingTalent = await TalentModel.findById(params.id)
    if (!existingTalent) {
      return new NextResponse(
        JSON.stringify({ error: 'Talent not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    // Create update object with existing values as fallbacks
    const updateData = {
      businessId: existingTalent.businessId, // Preserve the existing businessId
      name: body.name || existingTalent.name,
      email: body.email || existingTalent.email,
      phone: body.phone || existingTalent.phone,
      title: body.title || existingTalent.title,
      basicInfo: body.basicInfo || existingTalent.basicInfo,
      skills: body.skills || existingTalent.skills,
      experience: body.experience || existingTalent.experience,
      rate: body.rate !== undefined ? Number(body.rate) : existingTalent.rate,
      status: body.status || existingTalent.status,
      imagePath: body.imagePath || existingTalent.imagePath
    }

    // Update only with validated data
    const updatedTalent = await TalentModel.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedTalent) {
      return new NextResponse(
        JSON.stringify({ error: 'Failed to update talent' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    // Safely convert the updated talent to a plain object with null checks
    const talentData = {
      id: updatedTalent._id?.toString() || '',
      businessId: updatedTalent.businessId?.toString() || '',
      name: updatedTalent.name || '',
      email: updatedTalent.email || '',
      phone: updatedTalent.phone || '',
      title: updatedTalent.title || '',
      basicInfo: updatedTalent.basicInfo || '',
      skills: updatedTalent.skills || [],
      experience: updatedTalent.experience || '',
      rate: updatedTalent.rate || 0,
      status: updatedTalent.status || 'pending',
      imagePath: updatedTalent.imagePath || null,
    }

    return new NextResponse(
      JSON.stringify({ talent: talentData }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Error updating talent:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to update talent',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    await dbConnect()
    const talent = await TalentModel.findByIdAndDelete(params.id)

    if (!talent) {
      return new NextResponse(
        JSON.stringify({ error: 'Talent not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Error deleting talent:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete talent' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
} 