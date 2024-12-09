import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          Welcome to Talently
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Connect with top talent and grow your business
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/auth/login">
            <Button>Get Started</Button>
          </Link>
          <Link href="/talents">
            <Button variant="outline">Browse Talents</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
