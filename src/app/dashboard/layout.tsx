'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { handleLogout } from '@/lib/actions'
import { toast } from 'sonner'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Plus 
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  async function onLogout() {
    try {
      await handleLogout()
      toast.success('Logged out successfully')
      router.push('/auth/login')
      router.refresh()
    } catch (error: any) {
      if (error?.digest?.includes('NEXT_REDIRECT')) {
        toast.success('Logged out successfully')
        router.push('/auth/login')
        router.refresh()
        return
      }
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex space-x-8">
              <Link href="/dashboard" className="flex items-center text-gray-900 hover:text-gray-700">
                <LayoutDashboard className="h-5 w-5" />
                <span className="ml-2 text-sm font-medium">Dashboard</span>
              </Link>
              <Link href="/dashboard/talents" className="flex items-center text-gray-900 hover:text-gray-700">
                <Users className="h-5 w-5" />
                <span className="ml-2 text-sm font-medium">Talents</span>
              </Link>
              <Link href="/dashboard/bookings" className="flex items-center text-gray-900 hover:text-gray-700">
                <Calendar className="h-5 w-5" />
                <span className="ml-2 text-sm font-medium">Bookings</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/talents/new"
                className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Talent
              </Link>
              <Link href="/dashboard/profile" className="text-gray-900 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={onLogout}
                className="flex items-center text-gray-900 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
} 