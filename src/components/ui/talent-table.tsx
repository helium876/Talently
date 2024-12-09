'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { SerializedTalent, TalentStatus } from '@/lib/types/data'

interface TalentTableProps {
  talents: SerializedTalent[]
  selectedTalents: Set<string>
  onStatusChange: (id: string, status: TalentStatus) => void
  onSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
}

export function TalentTable({
  talents,
  selectedTalents,
  onSelect,
  onSelectAll,
  onStatusChange,
}: TalentTableProps) {
  const allTalentIds = talents.map(talent => talent.id)
  const allSelected = allTalentIds.every(id => selectedTalents.has(id))

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12 py-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => onSelectAll(allTalentIds)}
              />
            </TableHead>
            <TableHead className="py-3 text-sm font-medium text-gray-900">Name</TableHead>
            <TableHead className="py-3 text-sm font-medium text-gray-900">Email</TableHead>
            <TableHead className="py-3 text-sm font-medium text-gray-900">Skills</TableHead>
            <TableHead className="py-3 text-sm font-medium text-gray-900">Experience</TableHead>
            <TableHead className="py-3 text-sm font-medium text-gray-900">Rate</TableHead>
            <TableHead className="py-3 text-sm font-medium text-gray-900">Status</TableHead>
            <TableHead className="py-3 text-sm font-medium text-gray-900">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {talents.map((talent) => (
            <TableRow key={talent.id} className="hover:bg-gray-50">
              <TableCell className="py-4">
                <Checkbox
                  checked={selectedTalents.has(talent.id)}
                  onCheckedChange={() => onSelect(talent.id)}
                />
              </TableCell>
              <TableCell className="py-4 font-medium text-gray-900">{talent.name}</TableCell>
              <TableCell className="py-4 text-gray-700">{talent.email}</TableCell>
              <TableCell className="py-4">
                <div className="flex flex-wrap gap-1">
                  {talent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="py-4 text-gray-700">{talent.experience} years</TableCell>
              <TableCell className="py-4 text-gray-700">${talent.hourlyRate}/hour</TableCell>
              <TableCell className="py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    talent.status === TalentStatus.ACTIVE
                      ? 'bg-green-100 text-green-800'
                      : talent.status === TalentStatus.FEATURED
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {talent.status}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center space-x-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 