import { NextResponse } from 'next/server'

export async function GET() {
  // Basic metrics for demonstration
  const metrics = {
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    },
    application: {
      version: process.env.npm_package_version || '0.1.0',
      nodeVersion: process.version,
      platform: process.platform,
    },
  }

  return NextResponse.json(metrics)
} 