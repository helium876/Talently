import { dbConnect } from '@/lib/db'
import { Talent } from '@/models/talent'
import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AlertDialog } from '@/components/ui/alert-dialog'

async function deleteTalent(talentId: string) {
  'use server'
  
  try {
    await dbConnect()
    await Talent.findByIdAndDelete(talentId)
    redirect('/dashboard/talents')
  } catch (error) {
    console.error('Failed to delete talent:', error)
    return { error: 'Failed to delete talent' }
  }
}

export default async function TalentDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  await dbConnect()
  const talent = await Talent.findById(params.id).populate('business')

  if (!talent) {
    redirect('/dashboard/talents')
  }

  // Verify ownership
  if (talent.business.id !== session.user.businessId) {
    redirect('/dashboard/talents')
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {talent.name}
          </h2>
        </div>
        <div className="mt-4 flex gap-3 md:ml-4 md:mt-0">
          <Link
            href={`/dashboard/talents/${talent.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </Link>
          <form action={handleDelete}>
            <input type="hidden" name="talentId" value={talent.id} />
            <LoadingButton
              type="submit"
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Delete
            </LoadingButton>
            <FormError />
          </form>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Image */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
              Profile Image
            </h3>
            <div className="aspect-square w-full relative rounded-lg overflow-hidden bg-gray-100">
              {talent.imagePath ? (
                <Image
                  src={talent.imagePath}
                  alt={talent.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-6xl font-semibold text-gray-300">
                    {talent.name[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="prose prose-sm max-w-none text-gray-500">
              {talent.basicInfo}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white shadow sm:rounded-lg lg:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
              Additional Details
            </h3>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(talent.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(talent.updatedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Active
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white shadow sm:rounded-lg lg:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Share Profile
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Share this talent's profile with others.</p>
            </div>
            <div className="mt-5">
              <input
                type="text"
                readOnly
                value={`${process.env.NEXT_PUBLIC_APP_URL}/talents/${talent.id}`}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}