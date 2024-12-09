import { dbConnect } from '@/lib/db'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FormError } from '@/components/ui/form-error'
import { LoadingButton } from '@/components/ui/loading-button'
import { BookingRequest } from '@/models/booking-request'
import { Talent } from '@/models/talent'

async function submitBookingRequest(formData: FormData) {
  'use server'

  const talentId = formData.get('talentId') as string
  const clientName = formData.get('clientName') as string
  const clientEmail = formData.get('clientEmail') as string
  const message = formData.get('message') as string

  if (!clientName || !clientEmail || !message) {
    return { error: 'All fields are required' }
  }

  try {
    await dbConnect()
    await BookingRequest.create({
      clientName,
      clientEmail,
      message,
      talentId,
    })

    redirect(`/talents/${talentId}/booking-confirmation`)
  } catch (error) {
    console.error('Failed to submit booking request:', error)
    return { error: 'Failed to submit booking request' }
  }
}

export default async function TalentDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  
  await dbConnect()
  const talent = await Talent.findById(id).populate('business', 'name logoPath')

  if (!talent) {
    redirect('/talents')
  }

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
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                {talent.name}
              </h1>
              <div className="mt-4 prose prose-sm max-w-none text-gray-500">
                {talent.basicInfo}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <div className="mt-10 lg:mt-0 bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Book this Talent
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Fill out the form below to request a booking.</p>
                </div>

                <form action={submitBookingRequest} className="mt-5 space-y-6">
                  <input type="hidden" name="talentId" value={talent.id} />
                  
                  <div>
                    <label
                      htmlFor="clientName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Your Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="clientName"
                        id="clientName"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="clientEmail"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Your Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="clientEmail"
                        id="clientEmail"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Message
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Please provide any additional details about your booking request..."
                      />
                    </div>
                  </div>

                  <FormError />

                  <div className="flex justify-end gap-3">
                    <Link
                      href="/talents"
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Link>
                    <LoadingButton type="submit">
                      Submit Request
                    </LoadingButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 