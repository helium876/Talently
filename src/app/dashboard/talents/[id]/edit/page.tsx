import { notFound } from 'next/navigation'
import { getTalentById } from '@/lib/data'
import { requireAuth } from '@/lib/session'
import { TalentForm } from '@/components/talent-form'

interface EditTalentPageProps {
  params: {
    id: string
  }
}

export default async function EditTalentPage({
  params
}: EditTalentPageProps) {
  const session = await requireAuth()
  const talent = await getTalentById(session.id, params.id)

  if (!talent) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Edit Talent</h1>
          <TalentForm 
            businessId={session.id}
            initialData={talent}
          />
        </div>
      </div>
    </div>
  )
} 