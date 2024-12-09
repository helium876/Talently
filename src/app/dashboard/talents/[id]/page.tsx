'use client'

import { redirect } from 'next/navigation'
import { getTalentById } from '@/lib/data'
import { requireAuth } from '@/lib/session'
import { FormError } from '@/components/ui/form-error'
import { LoadingButton } from '@/components/ui/loading-button'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { deleteTalent } from '@/lib/actions/talent'

interface TalentDetailPageProps {
  params: {
    id: string
  }
}

export default async function TalentDetailPage({
  params,
}: TalentDetailPageProps) {
  const session = await requireAuth()
  const talent = await getTalentById(session.id, params.id)

  if (!talent) {
    redirect('/dashboard/talents')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{talent.name}</h1>
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/talents/${talent.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </Link>
          <form action={deleteTalent}>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Delete
            </button>
          </form>
          <FormError message="" />
          <Link
            href="/dashboard/talents"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Back to Talents
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Basic information and photo.
          </p>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Photo</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {talent.name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Basic Info</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {talent.basicInfo}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Status</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {talent.status}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}