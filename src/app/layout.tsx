import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { dbConnect } from '@/lib/db'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Talently',
  description: 'Connect with top talent and grow your business',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Skip DB connection during static generation
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    await dbConnect()
  }

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
