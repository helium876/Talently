import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div>
          <h1 className="text-5xl font-bold">
            Talently
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Showcase your business talents and services online
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/auth/signup"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
