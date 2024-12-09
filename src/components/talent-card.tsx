'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TalentStatus } from '@/lib/types/data'

interface TalentCardProps {
  talent: {
    id: string
    name: string
    basicInfo: string
    status: TalentStatus
    imagePath: string | null
  }
  businessId: string
}

export function TalentCard({ talent, businessId }: TalentCardProps) {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{talent.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{talent.basicInfo}</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            talent.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            talent.status === 'FEATURED' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {talent.status}
          </span>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={`/dashboard/talents/${talent.id}/edit`}>
              Edit
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
} 