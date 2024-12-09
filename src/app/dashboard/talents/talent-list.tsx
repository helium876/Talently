'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateTalentStatus, bulkUpdateTalentStatus } from '@/lib/actions'
import { TalentStatus, type SerializedTalent, type ViewMode } from '@/lib/types/data'
import { AdvancedSearch } from '@/components/ui/advanced-search'
import { ViewToggle } from '@/components/ui/view-toggle'
import { TalentCard } from '@/components/ui/talent-card'
import { TalentTable } from '@/components/ui/talent-table'
import { Button } from '@/components/ui/button'

interface TalentListProps {
  talents: SerializedTalent[]
}

export function TalentList({ talents: initialTalents }: TalentListProps) {
  const [talents, setTalents] = useState(initialTalents)
  const [selectedTalents, setSelectedTalents] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [statusToUpdate, setStatusToUpdate] = useState<TalentStatus>(TalentStatus.ACTIVE)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (talentId: string, newStatus: TalentStatus) => {
    try {
      const result = await updateTalentStatus(talentId, newStatus)
      if ('error' in result) {
        toast.error(result.error)
      } else {
        setTalents(prevTalents =>
          prevTalents.map(talent =>
            talent.id === talentId ? { ...talent, status: newStatus } : talent
          )
        )
        toast.success('Status updated successfully')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleSearch = (query: string) => {
    const filtered = initialTalents.filter(talent =>
      talent.name.toLowerCase().includes(query.toLowerCase()) ||
      talent.email.toLowerCase().includes(query.toLowerCase()) ||
      talent.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    )
    setTalents(filtered)
  }

  const handleBulkStatusUpdate = async () => {
    if (selectedTalents.size === 0) {
      toast.error('No talents selected')
      return
    }

    try {
      setIsUpdating(true)
      const result = await bulkUpdateTalentStatus(Array.from(selectedTalents), statusToUpdate)
      
      if ('error' in result) {
        toast.error(result.error)
      } else {
        setTalents(prevTalents =>
          prevTalents.map(talent =>
            selectedTalents.has(talent.id) ? { ...talent, status: statusToUpdate } : talent
          )
        )
        setSelectedTalents(new Set())
        toast.success('Status updated successfully')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSelect = (id: string) => {
    setSelectedTalents(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectAll = (ids: string[]) => {
    setSelectedTalents(prev => {
      const allSelected = ids.every(id => prev.has(id))
      if (allSelected) {
        const next = new Set(prev)
        ids.forEach(id => next.delete(id))
        return next
      } else {
        return new Set([...prev, ...ids])
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AdvancedSearch 
          onSearch={handleSearch}
          placeholder="Search by name, email, or skills..."
        />
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {talents.map(talent => (
            <TalentCard
              key={talent.id}
              talent={talent}
              onStatusChange={handleStatusChange}
              selected={selectedTalents.has(talent.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <TalentTable
          talents={talents}
          selectedTalents={selectedTalents}
          onStatusChange={handleStatusChange}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />
      )}

      {selectedTalents.size > 0 && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white p-4 rounded-lg shadow-lg">
          <select
            value={statusToUpdate}
            onChange={(e) => setStatusToUpdate(e.target.value as TalentStatus)}
            className="rounded-md border border-gray-300 py-1.5 pl-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={TalentStatus.ACTIVE}>Active</option>
            <option value={TalentStatus.FEATURED}>Featured</option>
            <option value={TalentStatus.INACTIVE}>Inactive</option>
          </select>
          <Button 
            onClick={handleBulkStatusUpdate}
            disabled={isUpdating}
            className="whitespace-nowrap"
          >
            Update Selected ({selectedTalents.size})
          </Button>
        </div>
      )}
    </div>
  )
} 