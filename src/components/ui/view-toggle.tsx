'use client'

import { ViewMode } from '@/lib/types/data'
import { Button } from './button'
import { LayoutGrid, List } from 'lucide-react'

interface ViewToggleProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
      <Button
        variant={mode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('grid')}
        className="px-2"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={mode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('table')}
        className="px-2"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
} 