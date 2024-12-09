import { dbConnect } from '@/lib/db'
import { Talent } from '@/models/talent'
import Link from 'next/link'
import Image from 'next/image'

export default async function TalentsPage() {
  await dbConnect()
  const talents = await Talent.find().populate('business', 'name')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Available Talents
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Browse our selection of talented professionals and book their services
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="flex-shrink-0">
                <div className="h-48 w-full relative bg-gray-200">
                  {talent.imagePath ? (
                    <Image
                      src={talent.imagePath}
                      alt={talent.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-6xl font-semibold text-gray-400">
                        {talent.name[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="h-8 w-8 relative rounded-full bg-gray-200 flex items-center justify-center">
                      {talent.business.logoPath ? (
                        <Image
                          src={talent.business.logoPath}
                          alt={talent.business.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-500">
                          {talent.business.name[0]}
                        </span>
                      )}
                    </div>
                    <p className="ml-2 text-sm font-medium text-gray-900">
                      {talent.business.name}
                    </p>
                  </div>
                  <Link
                    href={`/talents/${talent.id}`}
                    className="mt-2 block"
                  >
                    <p className="text-xl font-semibold text-gray-900">
                      {talent.name}
                    </p>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                      {talent.basicInfo}
                    </p>
                  </Link>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/talents/${talent.id}`}
                    className="w-full flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 