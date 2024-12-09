import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  })
} 