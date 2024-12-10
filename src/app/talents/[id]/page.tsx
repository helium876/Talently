import { dbConnect } from '@/lib/db'
import { TalentModel } from '@/lib/db/models/talent'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function TalentDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  
  await dbConnect()
  const talent = await TalentModel.findById(id).populate('businessId', 'name logoPath').lean()

  if (!talent) {
    redirect('/talents')
  }

  const business = talent.businessId as any // Type assertion for populated field

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Talent Information */}
          <div className="space-y-6">
            <div className="aspect-square w-full relative rounded-lg overflow-hidden bg-gray-200">
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

            <div>
              <div className="flex items-center">
                <div className="h-10 w-10 relative rounded-full bg-gray-200 flex items-center justify-center">
                  {business?.logoPath ? (
                    <Image
                      src={business.logoPath}
                      alt={business.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-500">
                      {business?.name?.[0] || '?'}
                    </span>
                  )}
                </div>
                <p className="ml-2 text-sm font-medium text-gray-900">
                  {business?.name || 'Unknown Business'}
                </p>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                {talent.name}
              </h1>
              <div className="mt-4 prose prose-sm max-w-none text-gray-500">
                {talent.basicInfo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 