import './globals.css'
import { connectToDatabase } from '@/lib/db'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Talently',
  description: 'Talent Management Platform',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure database connection is established
  await connectToDatabase()

  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
