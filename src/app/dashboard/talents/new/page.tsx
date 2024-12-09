import { requireAuth } from '@/lib/session'
import { TalentForm } from '@/components/talent-form'
import { Card } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default async function NewTalentPage() {
  const session = await requireAuth()
  
  if (!session?.id) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Talent</h1>
      </div>

      <Card>
        <div className="p-6">
          <TalentForm businessId={session.id} />
        </div>
      </Card>
    </div>
  )
} 