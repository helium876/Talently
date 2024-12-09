import { getTalents } from '@/lib/data'
import { requireAuth } from '@/lib/session'
import { SerializedTalent } from '@/lib/types/data'
import { TalentList } from './talent-list'
import { PageContainer } from '@/components/ui/page-container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function TalentsPage() {
  const session = await requireAuth()
  const { data: talents } = await getTalents(session.id)

  const serializedTalents: SerializedTalent[] = talents?.map(talent => ({
    id: talent.id || '',
    name: talent.name || '',
    email: talent.email || '',
    basicInfo: talent.basicInfo || '',
    status: talent.status,
    imagePath: talent.imagePath,
    experience: talent.experience || 0,
    hourlyRate: talent.hourlyRate || 0,
    skills: talent.skills || []
  })) || []

  return (
    <PageContainer
      title="Talents"
      description="Manage your talent pool and their availability"
      action={
        <Link href="/dashboard/talents/new" passHref>
          <Button>Add New Talent</Button>
        </Link>
      }
    >
      <TalentList talents={serializedTalents} />
    </PageContainer>
  )
} 