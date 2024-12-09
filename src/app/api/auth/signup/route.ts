import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { dbConnect } from '@/lib/db'
import UserModel from '@/lib/db/models/user'

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

export async function POST(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // First try to parse the request body
    let body;
    try {
      body = await request.json()
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    const { name, email, password } = body

    // Basic validation
    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ error: 'Name, email, and password are required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Connect to database
    try {
      await dbConnect()
    } catch (e) {
      console.error('Database connection error:', e)
      return new NextResponse(
        JSON.stringify({ error: 'Database connection failed' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: 'User with this email already exists' }),
        { 
          status: 409,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    })

    // Return success without sensitive data
    return new NextResponse(
      JSON.stringify({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
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
    console.error('Signup error:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'An error occurred during signup',
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