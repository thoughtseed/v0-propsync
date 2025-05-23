"use client"

import { useState } from "react"
import type { Property } from "@/lib/types"
import { PropertyCard } from "@/components/properties/property-card"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Plus, Grid3X3, List } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual Supabase queries
const mockProperties: Property[] = [
  {
    id: "1",
    created_at: "2024-01-01",
    updated_at: "2024-01-15",
    property_reference: "noble-remix-772-621",
    building_name: "Noble Remix",
    unit_number: "772/621",
    full_address: "772 Sukhumvit Rd, Khlong Tan, Khlong Toei, Bangkok 10110",
    property_type: "Luxury Condo",
    square_meters: 68,
    bedrooms: 1,
    bathrooms: 1,
    max_occupancy: 3,
    primary_photo: "/placeholder.svg?height=300&width=400&query=luxury condo interior",
    year_built: "2019/2023",
    description: "Modern one-bedroom luxury condo in the heart of Sukhumvit with city views.",
    status: "active",
    occupancy_rate: 85,
    avg_rating: 4.8,
    revenue_band: "luxury",
    checklist_completion: {
      basic_information: 100,
      safety_security: 90,
      kitchen_dining: 95,
      bedrooms: 100,
      bathrooms: 85,
      technology: 80,
      laundry_cleaning: 90,
      outdoor_spaces: 75,
      building_amenities: 100,
      hvac_utilities: 85,
      local_information: 95,
      luxury_amenities: 90,
      accessibility: 70,
      sustainability: 80,
      maintenance: 85,
      administrative: 95,
      overall: 87,
    },
  },
  // Add more mock properties...
]

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    status: "all",
    building: "all",
    revenue_band: "all",
  })
  const isMobile = useIsMobile()

  const filteredProperties = properties.filter((property) => {
    if (filters.status !== "all" && property.status !== filters.status) return false
    if (filters.revenue_band !== "all" && property.revenue_band !== filters.revenue_band) return false
    return true
  })

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        {/* Dashboard Stats */}
        <DashboardStats properties={properties} />

        {/* Filters and Actions */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <DashboardFilters filters={filters} onFiltersChange={setFilters} />

          <div className="flex items-center space-x-3">
            {!isMobile && (
              <div className="flex items-center border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Link href="/properties/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </Link>
          </div>
        </div>

        {/* Properties Grid/List */}
        <div
          className={
            isMobile
              ? "space-y-4"
              : viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
          }
        >
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No properties found matching your filters.</p>
            <Link href="/properties/add">
              <Button>Add Your First Property</Button>
            </Link>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}
