'use client'

import React from 'react'
import { Card } from './card'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { SerializedTalent, TalentStatus } from '@/lib/types/data'

interface TalentCardProps {
  talent: SerializedTalent
  onStatusChange: (id: string, status: TalentStatus) => void
  selected?: boolean
  onSelect?: (id: string) => void
}

export function TalentCard({ talent, onStatusChange, selected, onSelect }: TalentCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {onSelect && (
              <Checkbox
                checked={selected}
                onCheckedChange={() => onSelect(talent.id)}
                className="mt-1"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{talent.name}</h3>
              <p className="text-sm text-gray-600">{talent.email}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              talent.status === TalentStatus.ACTIVE
                ? 'bg-green-100 text-green-800'
                : talent.status === TalentStatus.FEATURED
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {talent.status}
          </span>
        </div>
        
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">{talent.basicInfo}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{talent.experience} years exp.</span>
            <span>${talent.hourlyRate}/hour</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {talent.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(talent.id, TalentStatus.ACTIVE)}
            disabled={talent.status === TalentStatus.ACTIVE}
          >
            Activate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(talent.id, TalentStatus.FEATURED)}
            disabled={talent.status === TalentStatus.FEATURED}
          >
            Feature
          </Button>
        </div>
      </div>
    </Card>
  )
} 