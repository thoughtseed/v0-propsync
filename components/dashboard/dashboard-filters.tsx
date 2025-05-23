"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface DashboardFiltersProps {
  filters: {
    status: string
    building: string
    revenue_band: string
  }
  onFiltersChange: (filters: any) => void
}

export function DashboardFilters({ filters, onFiltersChange }: DashboardFiltersProps) {
  const isMobile = useIsMobile()

  return (
    <div className={`flex ${isMobile ? "flex-col space-y-3" : "items-center space-x-4"}`}>
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search properties..." className="pl-10" />
      </div>

      {/* Filters */}
      <div className={`flex ${isMobile ? "space-x-2" : "space-x-3"}`}>
        <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
          <SelectTrigger className={isMobile ? "w-24" : "w-32"}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.revenue_band}
          onValueChange={(value) => onFiltersChange({ ...filters, revenue_band: value })}
        >
          <SelectTrigger className={isMobile ? "w-24" : "w-36"}>
            <SelectValue placeholder="Revenue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Revenue</SelectItem>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="mid-range">Mid-range</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
            <SelectItem value="ultra-luxury">Ultra-luxury</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
