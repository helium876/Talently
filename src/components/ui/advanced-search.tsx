'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from './input'

interface AdvancedSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function AdvancedSearch({ onSearch, placeholder = 'Search...' }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 w-full md:w-[300px]"
      />
    </div>
  )
} 